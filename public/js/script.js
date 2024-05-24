const imageInput = document.getElementById('imageInput');
const imageCanvas = document.getElementById('imageCanvas');
const textInput = document.getElementById('textInput');
const addTextBtn = document.getElementById('addTextBtn');
const fontSelect = document.getElementById('fontSelect');
const colorInput = document.getElementById('colorInput');
const sizeInput = document.getElementById('sizeInput');
const saveBtn = document.getElementById('saveBtn');
const imageLibrary = document.getElementById('imageLibrary');
const ctx = imageCanvas.getContext('2d');
let image = null;
let text = {
    content: '',
    font: 'Arial',
    color: '#ffffff',
    size: 30,
    x: 50,
    y: 50
};
let isDragging = false;
let offsetX, offsetY;

// Carregar imagens da biblioteca
// Carregar imagens da biblioteca
fetch('/getImages')
    .then(response => response.json())
    .then(imagePaths => {
        imagePaths.forEach(imagePath => {
            const img = document.createElement('img');
            img.src = imagePath;
            img.style.width = '100px';
            img.style.height = 'auto';
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                loadImage(imagePath);
            });
            imageLibrary.appendChild(img);
        });
    })
    .catch(error => console.error(error));


// Função para carregar imagem selecionada
function loadImage(imageSrc) {
    const img = new Image();
    img.onload = function() {
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        image = img;
    };
    img.src = imageSrc;
}

// Adicionar texto à imagem
addTextBtn.addEventListener('click', function() {
    text.content = textInput.value;
    text.font = fontSelect.value;
    text.color = colorInput.value;
    text.size = parseInt(sizeInput.value);
    drawText();
});

// Desenhar texto na imagem
function drawText() {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.drawImage(image, 0, 0);

    ctx.font = `${text.size}px ${text.font}`;
    ctx.fillStyle = text.color;
    ctx.fillText(text.content, text.x, text.y);
}

// Mover texto na imagem
imageCanvas.addEventListener('mousedown', function(event) {
    const mouseX = event.clientX - imageCanvas.getBoundingClientRect().left;
    const mouseY = event.clientY - imageCanvas.getBoundingClientRect().top;

    if (
        mouseX >= text.x &&
        mouseX <= text.x + ctx.measureText(text.content).width &&
        mouseY >= text.y - text.size &&
        mouseY <= text.y
    ) {
        isDragging = true;
        offsetX = mouseX - text.x;
        offsetY = mouseY - text.y;
    }
});

imageCanvas.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const mouseX = event.clientX - imageCanvas.getBoundingClientRect().left;
        const mouseY = event.clientY - imageCanvas.getBoundingClientRect().top;

        text.x = mouseX - offsetX;
        text.y = mouseY - offsetY;
        drawText();
    }
});

window.addEventListener('mouseup', function() {
    isDragging = false;
});
+


// Salvar imagem
// No evento de clique do botão "Salvar":
saveBtn.addEventListener('click', function() {
  const dataURL = imageCanvas.toDataURL('image/png'); // Gera a imagem base64

  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'imagem.png'; // Define o nome do arquivo
  a.click(); // Simula o clique no link para iniciar o download
});



