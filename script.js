const sizes = {
  'Instagram Post': [1080, 1080],
  'Instagram Story': [1080, 1920],
  'Twitter Post': [1200, 675],
  'LinkedIn Post': [1200, 627],
  'YouTube Thumbnail': [1280, 720],
  'Facebook Post': [1200, 630]
};

let originalImage = null;

document.getElementById('uploadInput').addEventListener('change', handleFileUpload);

const dropArea = document.getElementById('dropArea');
dropArea.addEventListener('dragover', e => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#d0e9ff";
});

dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = "";
});

dropArea.addEventListener('drop', e => {
  e.preventDefault();
  dropArea.style.backgroundColor = "";
  const file = e.dataTransfer.files[0];
  handleImage(file);
});

function handleFileUpload(e) {
  const file = e.target.files[0];
  handleImage(file);
}

function handleImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert("Please upload a valid image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      originalImage = img;
      const container = document.getElementById('previewContainer');
      container.innerHTML = '';
      container.appendChild(img);
      img.style.maxWidth = '300px';
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function resizeAll() {
  if (!originalImage) {
    alert("Upload an image first.");
    return;
  }

  const container = document.getElementById('resizedContainer');
  container.innerHTML = '';

  Object.entries(sizes).forEach(([platform, [width, height]]) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    const ratio = Math.min(width / originalImage.width, height / originalImage.height);
    const newWidth = originalImage.width * ratio;
    const newHeight = originalImage.height * ratio;
    const xOffset = (width - newWidth) / 2;
    const yOffset = (height - newHeight) / 2;
    ctx.drawImage(originalImage, xOffset, yOffset, newWidth, newHeight);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<strong>${platform}</strong><br/>`;
    wrapper.appendChild(canvas);

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = "Download";
    downloadBtn.className = "button";
    downloadBtn.onclick = () => {
      canvas.toBlob(blob => {
        saveAs(blob, `${platform.replace(" ", "_")}.png`);
      });
    };
    wrapper.appendChild(document.createElement('br'));
    wrapper.appendChild(downloadBtn);

    container.appendChild(wrapper);
  });
}

function addCustomSize() {
  const name = document.getElementById('customName').value.trim();
  const width = parseInt(document.getElementById('customWidth').value);
  const height = parseInt(document.getElementById('customHeight').value);

  if (!name || isNaN(width) || isNaN(height)) {
    alert("Please enter valid custom size values.");
    return;
  }

  sizes[name] = [width, height];
  alert(`Added ${name} (${width}x${height})`);
}

function clearAll() {
  document.getElementById('uploadInput').value = '';
  document.getElementById('previewContainer').innerHTML = '';
  document.getElementById('resizedContainer').innerHTML = '';
  originalImage = null;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
