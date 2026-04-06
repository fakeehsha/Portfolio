// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const previewContainer = document.getElementById('preview-container');
const galleryGrid = document.getElementById('gallery-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

// --- Navigation & Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// --- Upload Logic ---

// Trigger file input on button click
browseBtn.addEventListener('click', () => {
    fileInput.click();
});

// Drag and Drop Events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('dragover');
}

function unhighlight(e) {
    dropZone.classList.remove('dragover');
}

// Handle Drop
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle File Input Selection
fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    [...files].forEach(previewFile);
}

function previewFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload image files only.');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        
        // Create Preview Item
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.id = `preview-${id}`;
        
        previewItem.innerHTML = `
            <img src="${reader.result}" alt="Preview">
            <button class="btn-remove" onclick="removePreview('${id}')">&times;</button>
            <div class="preview-overlay">
                <input type="text" placeholder="Project Name" id="title-${id}">
                <input type="text" placeholder="Category" id="cat-${id}">
                <button class="btn btn-primary" onclick="publishToGallery('${id}', '${reader.result}')" style="width: 100%; padding: 8px; font-size: 0.9rem;">Publish</button>
            </div>
        `;
        
        previewContainer.appendChild(previewItem);
    }
}

// Remove Preupload Item
window.removePreview = function(id) {
    const el = document.getElementById(`preview-${id}`);
    if (el) el.remove();
}

// Publish to Gallery (Mock)
window.publishToGallery = function(id, imgSrc) {
    const titleInput = document.getElementById(`title-${id}`).value || 'Untitled Project';
    const catInput = document.getElementById(`cat-${id}`).value || 'Uncategorized';
    
    // Create Gallery Item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item glass';
    galleryItem.innerHTML = `
        <div class="item-img-wrapper">
            <img src="${imgSrc}" alt="${titleInput}">
        </div>
        <div class="item-details">
            <h4>${titleInput}</h4>
            <p>${catInput}</p>
        </div>
    `;
    
    // Add to top of gallery
    galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
    
    // Remove from preview
    removePreview(id);
    
    // Optional: Show success message/animation
    alert('Project published to your portfolio hub!');
    
    // Scroll to gallery
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

// --- Filter Logic (Mock) ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Real filtering would be implemented here based on categories
    });
});
