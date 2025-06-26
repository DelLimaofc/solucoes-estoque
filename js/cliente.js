document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("listaProdutos");
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  if (!container) return;

  if (produtos.length === 0) {
    container.innerHTML = "<p>Nenhum produto disponível no momento.</p>";
    return;
  }

  produtos.forEach((produto, index) => {
    if (produto.quantidade > 0) {
      const card = document.createElement("div");
      card.className = "produto-card";

      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>Categoria: ${produto.categoria}</p>
        <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
        <p>Estoque disponível: ${produto.quantidade}</p>
        <input type="number" id="quantidade-${index}" min="1" max="${produto.quantidade}" value="1">
        <button onclick="adicionarAoCarrinho(${index})">Adicionar ao carrinho</button>
      `;

      container.appendChild(card);
    }
  });

  if (produtos.some(p => p.quantidade > 0)) {
    const btn = document.createElement("button");
    btn.innerText = "Efetuar Compra";
    btn.className = "botao-compra";
    btn.onclick = comprarCarrinho;
    container.appendChild(btn);
  }
});

function adicionarAoCarrinho(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const produto = produtos[index];

  const qtdInput = document.getElementById(`quantidade-${index}`);
  const quantidadeDesejada = parseInt(qtdInput.value);

  if (!quantidadeDesejada || quantidadeDesejada < 1) {
    alert("Selecione uma quantidade válida.");
    return;
  }

  if (quantidadeDesejada > produto.quantidade) {
    alert("Quantidade maior que o disponível no estoque.");
    return;
  }

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  carrinho.push({
    ...produto,
    quantidade: quantidadeDesejada,
    indexOriginal: index
  });

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  alert(`${quantidadeDesejada}x "${produto.nome}" adicionado ao carrinho.`);
}

function comprarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagemFinal = "Compra efetuada com sucesso!\n";

  carrinho.forEach(item => {
    const original = produtos[item.indexOriginal];
    original.quantidade -= item.quantidade;
    if (original.quantidade < 0) original.quantidade = 0;

    const dataEntrega = new Date();
    const dias = Math.floor(Math.random() * 14) + 1;
    dataEntrega.setDate(dataEntrega.getDate() + dias);
    const entregaFormatada = dataEntrega.toLocaleDateString("pt-BR");

    relatorios.push({
      nome: item.nome,
      quantidade: item.quantidade,
      entrega: entregaFormatada
    });

    mensagemFinal += `\nProduto: ${item.nome} - Quantidade: ${item.quantidade}\nEntrega até: ${entregaFormatada}\n`;
  });

  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("relatorios", JSON.stringify(relatorios));
  localStorage.removeItem("carrinho");

  alert(mensagemFinal);
  location.reload();
}
