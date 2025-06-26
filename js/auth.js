// js/auth.js

const emailAdmin = "solucoesestoque73@gmail.com";
const senhaAdmin = "Solucoes2024";

// Login
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (email === emailAdmin && senha === senhaAdmin) {
    sessionStorage.setItem("tipoUsuario", "admin");
    window.location.href = "admin/home-admin.html";
    return;
  }

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const cliente = clientes.find(c => c.email === email && c.senha === senha);

  if (cliente) {
    sessionStorage.setItem("tipoUsuario", "cliente");
    window.location.href = "cliente/home-cliente.html";
  } else {
    alert("Credenciais inválidas.");
  }
}

// Cadastro
function cadastrar() {
  const email = document.getElementById("cad-email").value;
  const senha = document.getElementById("cad-senha").value;

  if (!email || !senha) {
    return alert("Preencha todos os campos");
  }

  if (email === emailAdmin) {
    return alert("Este e-mail está reservado para o administrador.");
  }

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  if (clientes.some(c => c.email === email)) {
    return alert("E-mail já cadastrado.");
  }

  clientes.push({ email, senha });
  localStorage.setItem("clientes", JSON.stringify(clientes));
  alert("Cadastro realizado! Agora faça login.");
  mostrarLogin();
}

// Alternar visibilidade
function mostrarCadastro() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("cadastro-form").style.display = "block";
}

function mostrarLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("cadastro-form").style.display = "none";
}
