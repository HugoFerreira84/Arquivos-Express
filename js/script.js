// script.js

// Função para mostrar a seção apropriada e ocultar as outras
function showSection(sectionId) {
    // Oculta todas as seções
    const sections = document.querySelectorAll('#main-content > section');
    sections.forEach(section => {
        section.classList.add('d-none');
    });

    // Mostra a seção clicada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }
}

// Oculta todas as seções inicialmente
document.addEventListener('DOMContentLoaded', () => {
    showSection(''); // Nenhuma seção deve ser visível inicialmente
});




// Função para gerar QR Code
function generateQRCode() {
    const text = document.getElementById('qrcode-text').value;
    const qrcodeContainer = document.getElementById('qrcode');

    // Limpa o conteúdo anterior
    qrcodeContainer.innerHTML = "";

    if (!text) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, insira um texto ou URL para gerar o QR Code!',
        });
        return;
    }

    // Gera o QR Code
    const qrcode = new QRCode(qrcodeContainer, {
        text: text,
        width: 300,
        height: 300,
    });

    // Espera um tempo curto para que o QR Code seja gerado no DOM
    setTimeout(() => {
        // Obtém o elemento canvas gerado pelo QRCode.js
        const qrCanvas = qrcodeContainer.querySelector('canvas');
        const qrDataUrl = qrCanvas.toDataURL('image/png');

        // Faz o download automático do QR Code gerado
        downloadFile(qrDataUrl, `qrcode-${text}.png`);

        Swal.fire({
            icon: 'success',
            title: 'QR Code gerado e baixado com sucesso!',
            text: 'Seu QR Code foi gerado e baixado automaticamente.',
        });
    }, 500);  // Delay de 500ms para garantir que o QR Code foi gerado
}

// Função para converter arquivos
function convertFile() {
    const fileInput = document.getElementById('file-input');
    const format = document.getElementById('file-format').value;
    
    if (!fileInput.files.length) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, selecione um arquivo para converter!',
        });
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const convertedFile = canvas.toDataURL(`image/${format}`);
            downloadFile(convertedFile, `converted-image.${format}`);
            
            Swal.fire({
                icon: 'success',
                title: 'Conversão concluída!',
                text: `Seu arquivo foi convertido para ${format}.`,
            });
        };
    };

    reader.readAsDataURL(file);
}

function downloadFile(dataUrl, fileName) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


// Função para comprimir arquivos
function compressFile() {
    const fileInput = document.getElementById('compress-file-input');
    
    if (!fileInput || !fileInput.files.length) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, selecione uma imagem para comprimir!',
        });
        return;
    }

    const file = fileInput.files[0];

    // Verifica se o arquivo é uma imagem
    if (!file.type.startsWith('image/')) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, selecione um arquivo de imagem válido!',
        });
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Redimensiona a imagem se necessário (mantendo a proporção)
            const MAX_WIDTH = 800; // Máximo de largura
            const MAX_HEIGHT = 800; // Máximo de altura
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Desenha a imagem no canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Reduz a qualidade da imagem (0.7 = 70% de qualidade)
            const compressedDataUrl = canvas.toDataURL(file.type, 0.7);

            // Faz o download da imagem comprimida
            downloadFile(compressedDataUrl, `compressed-${file.name}`);

            Swal.fire({
                icon: 'success',
                title: 'Compressão concluída!',
                text: 'Sua imagem foi comprimida com sucesso.',
            });
        };
    };

    reader.readAsDataURL(file);
}

function downloadFile(dataUrl, fileName) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function saveAs(blob, fileName) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

