// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Suíte: Testes de API REST
 * API sob teste: https://reqres.in (API pública de prática para testes)
 *
 * TC-05: GET lista de usuários retorna 200 e lista não vazia
 * TC-06: POST criação de usuário retorna 201 com os dados enviados
 * TC-07: GET usuário inexistente retorna 404
 */

const BASE_API_URL = 'https://reqres.in/api';

test.describe('API - Usuários', () => {
  test('TC-05 - GET /users deve retornar 200 e uma lista de usuários', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/users?page=2`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('TC-06 - POST /users deve criar um usuário e retornar 201', async ({ request }) => {
    const novoUsuario = { name: 'Fernanda Genú', job: 'QA Júnior' };

    const response = await request.post(`${BASE_API_URL}/users`, {
      data: novoUsuario,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(novoUsuario.name);
    expect(body.job).toBe(novoUsuario.job);
    expect(body.id).toBeDefined();
  });

  test('TC-07 - GET /users/23 (inexistente) deve retornar 404', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/users/23`);

    expect(response.status()).toBe(404);
  });
});
