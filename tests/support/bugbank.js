// @ts-check
const { expect } = require('@playwright/test');

/**
 * Funções de apoio para os testes do BugBank (https://bugbank.netlify.app).
 *
 * Observação sobre a página: o formulário de login e o de cadastro existem ao mesmo
 * tempo no HTML (o site "vira" o cartão com uma animação). Por isso cada campo é
 * localizado dentro do cartão certo (.card__login ou .card__register), senão o
 * mesmo texto (ex.: "Informe seu e-mail") casaria com dois elementos.
 */

// Dados usados nos casos de teste (os mesmos exemplos dos casos de teste originais)
const USUARIO = {
  nome: 'Fernanda Silva',
  email: 'fernanda.silva@gmail.com',
  senha: 'Senha123',
  senhaDiferente: 'Senha456',
};

/** Passos 1 e 2 dos casos: acessar a tela de login e clicar em "Registrar". */
async function abrirTelaDeCadastro(page) {
  await page.goto('/');
  await page.locator('.card__login').getByRole('button', { name: 'Registrar' }).click();
  await expect(page.locator('.card__register')).toBeVisible();
}

/**
 * Preenche o formulário de cadastro. Qualquer campo pode ser omitido (ficando em branco)
 * passando `null` — é assim que o Caso 02 deixa o "Nome" vazio.
 */
async function preencherCadastro(page, { email, nome, senha, confirmacao, comSaldo = false }) {
  const form = page.locator('.card__register');

  if (email !== null) await form.getByPlaceholder('Informe seu e-mail', { exact: true }).fill(email);
  if (nome !== null) await form.getByPlaceholder('Informe seu Nome', { exact: true }).fill(nome);
  if (senha !== null) await form.getByPlaceholder('Informe sua senha', { exact: true }).fill(senha);
  if (confirmacao !== null) {
    await form.getByPlaceholder('Informe a confirmação da senha', { exact: true }).fill(confirmacao);
  }
  if (comSaldo) await form.locator('#toggleAddBalance').click();
}

async function clicarEmCadastrar(page) {
  await page.locator('.card__register').getByRole('button', { name: 'Cadastrar' }).click();
}

/** Mensagem exibida na janela (modal) que o BugBank abre após o cadastro/erro. */
function mensagemDoModal(page) {
  return page.locator('#modalText');
}

async function fecharModal(page) {
  await page.locator('#btnCloseModal').click();
}

/** Login com e-mail e senha (cartão de login). */
async function fazerLogin(page, email, senha) {
  const form = page.locator('.card__login');
  await form.getByPlaceholder('Informe seu e-mail', { exact: true }).fill(email);
  await form.getByPlaceholder('Informe sua senha', { exact: true }).fill(senha);
  await form.getByRole('button', { name: 'Acessar' }).click();
}

/**
 * O BugBank não tem banco de dados: guarda as contas no localStorage do navegador,
 * usando o e-mail como chave. Usamos isso para confirmar se a conta foi (ou não) criada.
 */
async function contaExiste(page, email) {
  return page.evaluate((chave) => localStorage.getItem(chave) !== null, email);
}

module.exports = {
  USUARIO,
  abrirTelaDeCadastro,
  preencherCadastro,
  clicarEmCadastrar,
  mensagemDoModal,
  fecharModal,
  fazerLogin,
  contaExiste,
};
