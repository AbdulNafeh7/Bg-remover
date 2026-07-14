// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const apiStatus = document.getElementById('apiStatus');
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const uploadStatus = document.getElementById('uploadStatus');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');
const processingStatus = document.getElementById('processingStatus');
const actionsSection = document.getElementById('actionsSection');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// State
let apiKey = '';
let originalImageFile = null;
let processedImageBlob = null;

// Load API Key from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = localStorage.getItem('removeBgApiKey');
    if (savedApiKey) {
        apiKey = savedApiKey;
        apiKeyInput.value = '..................';
        showStatus('apiStatus', 'API key loaded successfully', 'success');
    }
});

// Save API Key
saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    
    if (!key) {
        showStatus('apiStatus', 'Please enter an API key', 'error');
        return;
    }

    if (key.length < 10) {
        showStatus('apiStatus', 'API key seems too short. Please verify.', 'error');
        return;
    }

    apiKey = key;
    localStorage.setItem('removeBgApiKey', key);
    apiKeyInput.value = '..................';
    showStatus('apiStatus', 'API key saved successfully', 'success');
});

// Upload Area Click
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

// File Input Change
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImageUpload(e.target.files[0]);
    }
});

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files[0]);
    }
});

// Handle Image Upload
async function handleImageUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showStatus('uploadStatus', 'Please select a valid image file', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showStatus('uploadStatus', 'Image size should be less than 10MB', 'error');
        return;
    }

    // Check if API key is set
    if (!apiKey) {
        showStatus('uploadStatus', 'Please save your API key first', 'error');
        return;
    }

    originalImageFile = file;
    
    // Display original image
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        previewSection.style.display = 'block';
        actionsSection.style.display = 'none';
        processingStatus.style.display = 'none';
        
        // Auto-process the image
        processImage();
    };
    reader.readAsDataURL(file);

    showStatus('uploadStatus', 'Image loaded. Starting processing...', 'info');
}

// Process Image
async function processImage() {
    processingStatus.style.display = 'block';
    actionsSection.style.display = 'none';

    try {
        const formData = new FormData();
        formData.append('image_file', originalImageFile);
        formData.append('size', 'auto');
        formData.append('type', 'auto');
        formData.append('format', 'png');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-API-Key': apiKey
            },
            body: formData
        });

        if (!response.ok) {
            let errorMessage = 'Failed to process image';
            
            if (response.status === 403) {
                errorMessage = 'Invalid API key. Please check and try again.';
            } else if (response.status === 402) {
                errorMessage = 'API quota exceeded. Please upgrade your remove.bg account.';
            } else if (response.status === 400) {
                errorMessage = 'Invalid image format or file too large.';
            }

            throw new Error(errorMessage);
        }

        processedImageBlob = await response.blob();
        const processedImageUrl = URL.createObjectURL(processedImageBlob);
        processedImage.src = processedImageUrl;

        processingStatus.style.display = 'none';
        actionsSection.style.display = 'flex';
        showStatus('uploadStatus', 'Background removed successfully!', 'success');

    } catch (error) {
        processingStatus.style.display = 'none';
        console.error('Error:', error);
        
        const errorMsg = error.message || 'Failed to process image';
        showStatus('uploadStatus', errorMsg, 'error');
    }
}

// Download Image
downloadBtn.addEventListener('click', () => {
    if (!processedImageBlob) return;

    const url = URL.createObjectURL(processedImageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `removed-bg-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatus('uploadStatus', 'Image downloaded successfully!', 'success');
});

// Reset
resetBtn.addEventListener('click', () => {
    originalImageFile = null;
    processedImageBlob = null;
    imageInput.value = '';
    previewSection.style.display = 'none';
    actionsSection.style.display = 'none';
    processingStatus.style.display = 'none';
    uploadStatus.innerHTML = '';
    showStatus('uploadStatus', '', 'info');
});

// Show Status Message
function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `status-message ${type} show`;

    if (type !== 'error' && message) {
        setTimeout(() => {
            if (element.textContent === message) {
                element.classList.remove('show');
            }
        }, 5000);
    }
}

// Clear status message when user focuses on API input
apiKeyInput.addEventListener('focus', () => {
    apiStatus.classList.remove('show');
});

imageInput.addEventListener('focus', () => {
    uploadStatus.classList.remove('show');
});