# Casos de Teste

Casos de teste do **BugBank** (https://bugbank.netlify.app), um banco digital fictício feito
para praticar testes. Os casos TC-01 a TC-03 foram elaborados manualmente por mim em uma
palestra de QA e depois automatizados neste projeto.
O formato segue o usado em ferramentas de gestão de teste como o **Xray** (Jira): ID, título,
pré-condição, passos, resultado esperado e prioridade.

## Requisito coberto

> "O usuário deve conseguir criar uma conta preenchendo o formulário de cadastro"

---

### TC-01 — Cadastro com dados válidos (caminho que funciona)

| Campo | Descrição |
|---|---|
| **Cenário** | Usuário preenche todos os campos do formulário corretamente e envia o cadastro |
| **Pré-condição** | Usuário está na tela de Cadastro (aba "Registrar") e o e-mail utilizado ainda não está cadastrado no sistema |
| **Passos** | 1. Acessar a tela de login<br>2. Clicar em "Registrar"<br>3. Digitar um e-mail válido (ex.: fernanda.silva@gmail.com) no campo "E-mail"<br>4. Digitar um nome válido (ex.: Fernanda Silva) no campo "Nome"<br>5. Digitar uma senha válida (ex.: Senha123) no campo "Senha"<br>6. Digitar a mesma senha no campo "Confirmação senha"<br>7. Deixar marcada ou desmarcada a opção "Criar conta com saldo?"<br>8. Clicar em "Cadastrar" |
| **Resultado esperado** | Sistema exibe mensagem de sucesso e a conta é criada. Usuário consegue fazer login com o e-mail e a senha cadastrados. |
| **Prioridade** | Alta |
| **Tipo** | Funcional — Cenário positivo |
| **Automatizado** | Sim — `tests/web/cadastro.spec.js`. O passo 7 é executado nas **duas variações** (sem saldo → saldo R$ 0,00; com saldo → saldo R$ 1.000,00). |

### TC-02 — Envio com campo obrigatório vazio

| Campo | Descrição |
|---|---|
| **Cenário** | Usuário tenta se cadastrar deixando o campo "Nome" em branco |
| **Pré-condição** | Usuário está na tela de Cadastro |
| **Passos** | 1. Acessar a tela de login<br>2. Clicar em "Registrar"<br>3. Deixar o campo "Nome" em branco<br>4. Preencher normalmente "E-mail", "Senha" e "Confirmação senha" com dados válidos<br>5. Clicar em "Cadastrar" |
| **Resultado esperado** | Sistema bloqueia o envio e exibe mensagem informando que o campo "Nome" é obrigatório. A conta não é criada. |
| **Prioridade** | Alta |
| **Tipo** | Funcional — Cenário negativo |
| **Automatizado** | Sim — `tests/web/cadastro.spec.js` |
| **Observação da execução** | O sistema bloqueia o cadastro e exibe "Nome não pode ser vazio." em uma **janela (modal)**, e não como mensagem de validação ao lado do campo, como acontece com o e-mail. O comportamento essencial (bloquear e informar) está de acordo com o esperado. |

### TC-03 — Senha e confirmação de senha diferentes

| Campo | Descrição |
|---|---|
| **Cenário** | Usuário preenche o formulário com uma senha e uma confirmação de senha diferentes entre si |
| **Pré-condição** | Usuário está na tela de Cadastro e possui um e-mail ainda não cadastrado |
| **Passos** | 1. Acessar a tela de login<br>2. Clicar em "Registrar"<br>3. Digitar um nome válido (ex.: Fernanda Silva) no campo "Nome"<br>4. Digitar um e-mail válido (ex.: fernanda.silva@gmail.com) no campo "E-mail"<br>5. Digitar a senha Senha123 no campo "Senha"<br>6. Digitar a senha Senha456 (diferente) no campo "Confirmação senha"<br>7. Clicar em "Cadastrar" |
| **Resultado esperado** | Sistema bloqueia o cadastro e exibe a mensagem "As senhas não são iguais". A conta não é criada. |
| **Prioridade** | Alta |
| **Tipo** | Funcional — Cenário negativo |
| **Automatizado** | Sim — `tests/web/cadastro.spec.js` |

### TC-04 — Cadastro e login em tela de celular (mobile web)

| Campo | Descrição |
|---|---|
| **Cenário** | Mesmo fluxo do TC-01, em um dispositivo móvel emulado |
| **Pré-condição** | Acesso simulando um Pixel 7 (tamanho de tela, user-agent e toque emulados) |
| **Passos** | Os mesmos do TC-01, seguidos de login com a conta criada |
| **Resultado esperado** | O cadastro é concluído com mensagem de sucesso e o login leva à tela inicial da conta, mesmo em tela pequena |
| **Prioridade** | Média |
| **Tipo** | Mobile Web (responsividade) — Cenário positivo |
| **Automatizado** | Sim — `tests/mobile/cadastro-mobile.spec.js` |

### TC-05 — API: listar usuários

| Campo | Descrição |
|---|---|
| **Pré-condição** | API pública `reqres.in` disponível |
| **Passos** | 1. Enviar `GET /api/users?page=2` |
| **Resultado esperado** | Status `200` e corpo com uma lista (`data`) não vazia |
| **Prioridade** | Alta |
| **Tipo** | API — Cenário positivo |
| **Automatizado** | Sim — `tests/api/reqres-api.spec.js` |

### TC-06 — API: criar usuário

| Campo | Descrição |
|---|---|
| **Pré-condição** | API pública `reqres.in` disponível |
| **Passos** | 1. Enviar `POST /api/users` com `name` e `job`<br>2. Verificar a resposta |
| **Resultado esperado** | Status `201`, com `name`, `job` e `id` no corpo da resposta |
| **Prioridade** | Alta |
| **Tipo** | API — Cenário positivo |
| **Automatizado** | Sim — `tests/api/reqres-api.spec.js` |

### TC-07 — API: usuário inexistente

| Campo | Descrição |
|---|---|
| **Pré-condição** | API pública `reqres.in` disponível |
| **Passos** | 1. Enviar `GET /api/users/23` (ID que não existe) |
| **Resultado esperado** | Status `404` |
| **Prioridade** | Média |
| **Tipo** | API — Cenário negativo |
| **Automatizado** | Sim — `tests/api/reqres-api.spec.js` |

---

## Evidências de execução

Cada execução gera automaticamente (configurado em `playwright.config.js`):
- **Screenshot** do momento da falha
- **Vídeo** da execução do teste que falhou
- **Trace** navegável passo a passo, com rede e DOM
- **Relatório HTML** consolidado (`npm run report`)
