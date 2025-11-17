const produtos = {
    steal: [
        { nome: "Conta V1", stock: 2, preco: "R$10,00" },
        { nome: "Conta V2", stock: 1, preco: "R$15,00" },
        { nome: "Conta V3", stock: 4, preco: "R$8,50" },
    ],
    blox: [
        { nome: "Conta BF Full", stock: 3, preco: "R$20,00" },
        { nome: "Conta BF Starter", stock: 5, preco: "R$12,00" },
    ]
};

function mostrarProdutos(jogo) {
    const container = document.getElementById("produtos-container");
    container.innerHTML = '';

    produtos[jogo].forEach(prod => {
        const div = document.createElement("div");
        div.className = "produto";
        div.innerHTML = `
            <h4>${prod.nome}</h4>
            <p>Stock: ${prod.stock}</p>
            <p>Preço: ${prod.preco}</p>
            <button>Comprar</button>
        `;
        container.appendChild(div);
    });

    container.scrollIntoView({ behavior: "smooth" });
}
