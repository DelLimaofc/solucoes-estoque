// Funções comuns para carregar e salvar no localStorage
function salvarProduto(produto) {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  produtos.push(produto);
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

function obterProdutos() {
  return JSON.parse(localStorage.getItem('produtos') || '[]');
}

function removerProduto(index) {
  const produtos = obterProdutos();
  produtos.splice(index, 1);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  location.reload();
}

// Página: cadastrar.html
if (document.getElementById('formProduto')) {
  document.getElementById('formProduto').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const categoria = document.getElementById('categoria').value;
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').files[0];

    const reader = new FileReader();
    reader.onload = function() {
      const produto = {
        nome,
        quantidade,
        categoria,
        preco,
        imagem: reader.result
      };

      salvarProduto(produto);
      alert('Produto cadastrado com sucesso!');
      document.getElementById('formProduto').reset();
    };

    if (imagem) {
      reader.readAsDataURL(imagem);
    }
  });
}

// Página: produtos.html
if (document.getElementById('listaProdutos')) {
  const produtos = obterProdutos();
  const lista = document.getElementById('listaProdutos');

  produtos.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <strong>${p.nome}</strong><br>
      Quantidade: ${p.quantidade}<br>
      Categoria: ${p.categoria}<br>
      Preço: R$ ${parseFloat(p.preco).toFixed(2)}<br>
      <button onclick="removerProduto(${index})">Excluir</button>
    `;
    lista.appendChild(div);
  });
}

// Página: relatorios.html
if (document.getElementById('relatorio')) {
  const produtos = obterProdutos();
  const totalProdutos = produtos.length;
  const totalQuantidade = produtos.reduce((sum, p) => sum + parseInt(p.quantidade), 0);
  const totalValor = produtos.reduce((sum, p) => sum + (parseFloat(p.preco) * parseInt(p.quantidade)), 0);

  const relatorio = document.getElementById('relatorio');
  relatorio.innerHTML = `
    <p>Total de produtos cadastrados: <strong>${totalProdutos}</strong></p>
    <p>Total em estoque (quantidade): <strong>${totalQuantidade}</strong></p>
    <p>Valor total estimado do estoque: <strong>R$ ${totalValor.toFixed(2)}</strong></p>
  `;
}
