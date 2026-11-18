// @ts-check
const { test, expect } = require('@playwright/test');
const {
  USUARIO,
  abrirTelaDeCadastro,
  preencherCadastro,
  clicarEmCadastrar,
  mensagemDoModal,
  fecharModal,
  fazerLogin,
  contaExiste,
} = require('../support/bugbank');

/**
 * Requisito: "O usuário deve conseguir criar uma conta preenchendo o formulário de cadastro"
 * Site sob teste: https://bugbank.netlify.app
 *
 * Automação dos casos de teste elaborados manualmente (ver TESTCASES.md):
 * TC-01: Cadastro com dados válidos (caminho que funciona) + login com a conta criada
 * TC-02: Envio com campo obrigatório vazio
 * TC-03: Senha e confirmação de senha diferentes
 */

test.describe('Cadastro de conta', () => {
  // O passo 7 do caso diz "deixar marcada ou desmarcada" a opção "Criar conta com saldo?".
  // Em vez de escolher uma, o caso é executado nas duas variações.
  const variacoes = [
    { descricao: 'sem saldo', comSaldo: false, saldoEsperado: /R\$\s*0,00/ },
    { descricao: 'com saldo', comSaldo: true, saldoEsperado: /R\$\s*1\.000,00/ },
  ];

  for (const { descricao, comSaldo, saldoEsperado } of variacoes) {
    test(`TC-01 - Cadastro com dados válidos e login com a conta criada (${descricao})`, async ({ page }) => {
      await abrirTelaDeCadastro(page);
      await preencherCadastro(page, {
        email: USUARIO.email,
        nome: USUARIO.nome,
        senha: USUARIO.senha,
        confirmacao: USUARIO.senha,
        comSaldo,
      });
      await clicarEmCadastrar(page);

      // Resultado esperado (1/2): mensagem de sucesso e conta criada
      await expect(mensagemDoModal(page)).toContainText(/A conta \d+-\d foi criada com sucesso/);
      expect(await contaExiste(page, USUARIO.email)).toBe(true);
      await fecharModal(page);

      // Resultado esperado (2/2): usuário consegue fazer login com e-mail e senha cadastrados
      await fazerLogin(page, USUARIO.email, USUARIO.senha);
      await expect(page).toHaveURL(/\/home/);
      await expect(page.locator('#textName')).toContainText(`Olá ${USUARIO.nome}`);
      await expect(page.locator('#textBalance')).toContainText(saldoEsperado);
    });
  }

  test('TC-02 - Envio com campo obrigatório vazio (Nome em branco) deve bloquear o cadastro', async ({ page }) => {
    await abrirTelaDeCadastro(page);
    await preencherCadastro(page, {
      email: USUARIO.email,
      nome: null, // campo "Nome" fica em branco
      senha: USUARIO.senha,
      confirmacao: USUARIO.senha,
    });
    await clicarEmCadastrar(page);

    // Resultado esperado: sistema bloqueia o envio, informa que o Nome é obrigatório
    // e a conta não é criada
    await expect(mensagemDoModal(page)).toContainText(/nome não pode ser vazio/i);
    expect(await contaExiste(page, USUARIO.email)).toBe(false);
  });

  test('TC-03 - Senha e confirmação de senha diferentes devem bloquear o cadastro', async ({ page }) => {
    await abrirTelaDeCadastro(page);
    await preencherCadastro(page, {
      email: USUARIO.email,
      nome: USUARIO.nome,
      senha: USUARIO.senha,
      confirmacao: USUARIO.senhaDiferente,
    });
    await clicarEmCadastrar(page);

    // Resultado esperado: sistema bloqueia o cadastro, exibe "As senhas não são iguais"
    // e a conta não é criada
    await expect(mensagemDoModal(page)).toContainText('As senhas não são iguais');
    expect(await contaExiste(page, USUARIO.email)).toBe(false);
  });
});
