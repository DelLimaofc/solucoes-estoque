// js/admin.js

// Cadastrar produto com upload de imagem (sem alertas)
function cadastrarProduto() {
  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const preco = parseFloat(document.getElementById("preco").value);
  const imagemInput = document.getElementById("imagem");
  const imagemFile = imagemInput.files[0];

  if (!nome || !categoria || !quantidade || !preco || !imagemFile) {
    return; // Validação silenciosa
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const imagemBase64 = e.target.result;
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    produtos.push({
      nome,
      categoria,
      quantidade,
      preco,
      imagem: imagemBase64
    });

    localStorage.setItem("produtos", JSON.stringify(produtos));
    limparFormulario();
    mostrarPreview(imagemBase64);
  };

  reader.readAsDataURL(imagemFile);
}

// Limpa os campos após o cadastro
function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("imagem").value = "";
  document.getElementById("preview").innerHTML = "";
}

// Exibe prévia da imagem após cadastro
function mostrarPreview(base64) {
  const preview = document.getElementById("preview");
  preview.innerHTML = `<h4>Prévia da imagem cadastrada:</h4><img src="${base64}" alt="Imagem do produto">`;
}

// Exibir produtos na aba admin/produtos.html
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("listaProdutos");

  if (container) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    if (produtos.length === 0) {
      container.innerHTML = "<p>Nenhum produto cadastrado ainda.</p>";
    } else {
      produtos.forEach((produto, index) => {
        const card = document.createElement("div");
        card.className = "produto-card";

        card.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <h3>${produto.nome}</h3>
          <p>Categoria: ${produto.categoria}</p>
          <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
          <p>Estoque: ${produto.quantidade}</p>
          <button onclick="removerProduto(${index})">Remover</button>
        `;

        container.appendChild(card);
      });
    }
  }

  // Exibir relatórios de compras e permitir exclusão individual
  const relatorioEl = document.getElementById("relatorioContainer");
  if (relatorioEl) {
    const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];

    if (relatorios.length === 0) {
      relatorioEl.innerHTML = "<p>Nenhum relatório de compra gerado ainda.</p>";
    } else {
      relatorios.forEach((r, index) => {
        const div = document.createElement("div");
        div.className = "relatorio-card";
        div.innerHTML = `
          <h3>${r.nome}</h3>
          <p>Quantidade comprada: ${r.quantidade}</p>
          <p>Previsão de entrega: ${r.entrega}</p>
          <button class="excluir-relatorio" onclick="excluirRelatorio(${index})">Excluir</button>
        `;
        relatorioEl.appendChild(div);
      });
    }
  }
});

// Excluir relatório individual
function excluirRelatorio(index) {
  const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];
  relatorios.splice(index, 1);
  localStorage.setItem("relatorios", JSON.stringify(relatorios));
  location.reload();
}

// Remover produto do localStorage
function removerProduto(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.splice(index, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  location.reload();
}
