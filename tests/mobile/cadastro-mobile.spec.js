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
} = require('../support/bugbank');

/**
 * Suíte: Mobile Web (emulação de dispositivo)
 *
 * Roda no projeto "mobile-web" do playwright.config.js, que usa devices['Pixel 7']
 * (tamanho de tela, user-agent e toque de um smartphone real).
 *
 * Isto é teste de MOBILE WEB (responsividade), não automação de app nativo.
 * Para app nativo (Android/iOS instalado), a ferramenta seria o Appium —
 * ver "Próximos passos" no README.md.
 *
 * TC-04: Mesmo fluxo do TC-01 (cadastro válido + login), agora em tela de celular
 */

test.describe('Mobile Web - Cadastro de conta', () => {
  test('TC-04 - Cadastro com dados válidos e login em viewport mobile (Pixel 7)', async ({ page }) => {
    await abrirTelaDeCadastro(page);
    await preencherCadastro(page, {
      email: USUARIO.email,
      nome: USUARIO.nome,
      senha: USUARIO.senha,
      confirmacao: USUARIO.senha,
    });
    await clicarEmCadastrar(page);

    await expect(mensagemDoModal(page)).toContainText(/A conta \d+-\d foi criada com sucesso/);
    await fecharModal(page);

    await fazerLogin(page, USUARIO.email, USUARIO.senha);
    await expect(page).toHaveURL(/\/home/);
    await expect(page.locator('#textName')).toContainText(`Olá ${USUARIO.nome}`);
  });
});
