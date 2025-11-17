// Pegar jogo via query string
const params = new URLSearchParams(window.location.search);
const jogo = params.get('jogo');
const titulo = document.getElementById('titulo-jogo');

if (jogo === 'steal') {
    titulo.textContent = 'STEAL A BRAINROT';
} else if (jogo === 'blox') {
    titulo.textContent = 'BLOX FRUIT';
}

// Função para gerar código aleatório único
function gerarCodigo(tamanho = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < tamanho; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
}

// Evento do botão "Paguei"
document.getElementById('btn-paguei').addEventListener('click', () => {
    const codigoContainer = document.getElementById('codigo-container');
    const codigoGerado = document.getElementById('codigo-gerado');

    codigoGerado.textContent = gerarCodigo();
    codigoContainer.style.display = 'block';

    // Scroll suave para mostrar o código
    codigoContainer.scrollIntoView({ behavior: 'smooth' });
});
