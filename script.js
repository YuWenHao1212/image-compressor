document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // 點擊上傳
    dropZone.addEventListener('click', () => fileInput.click());

    // 拖放上傳
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0071e3';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#d2d2d7';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#d2d2d7';
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    // 文件選擇處理
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // 質量滑塊變化處理
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentFile) compressImage(currentFile);
    });

    // 處理上傳的文件
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('請上傳圖片文件！');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = `原始大小: ${(file.size / 1024).toFixed(2)} KB`;
            compressImage(file);
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // 壓縮圖片
    function compressImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 保持原始尺寸
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 壓縮
                canvas.toBlob(
                    (blob) => {
                        compressedImage.src = URL.createObjectURL(blob);
                        compressedSize.textContent = `壓縮後大小: ${(blob.size / 1024).toFixed(2)} KB`;
                        
                        // 設置下載按鈕
                        downloadBtn.onclick = () => {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `compressed_${file.name}`;
                            link.click();
                        };
                    },
                    'image/jpeg',
                    qualitySlider.value / 100
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}); 