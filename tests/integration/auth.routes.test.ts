import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { buildTestApp } from '../helpers/buildTestApp';
import { FakeUserRepository } from '../helpers/FakeUserRepository';

describe('POST /api/v1/auth/register', () => {
  let app: Express;

  beforeEach(() => {
    app = buildTestApp(new FakeUserRepository());
  });

  it('cadastra um usuário e retorna 201 com o token de acesso', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'ana@example.com', password: 'senha1234' });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ email: 'ana@example.com' });
    expect(response.body.token).toBeTypeOf('string');
  });

  it('retorna 400 quando os dados são inválidos', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'nao-e-email', password: '123' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('retorna 409 ao tentar cadastrar um e-mail já existente', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'ana@example.com', password: 'senha1234' });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'ana@example.com', password: 'outrasenha' });

    expect(response.status).toBe(409);
  });
});

describe('POST /api/v1/auth/login', () => {
  let app: Express;

  beforeEach(async () => {
    app = buildTestApp(new FakeUserRepository());
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'ana@example.com', password: 'senha1234' });
  });

  it('autentica com credenciais válidas e retorna 200 com o token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ana@example.com', password: 'senha1234' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTypeOf('string');
  });

  it('retorna 401 para senha incorreta', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ana@example.com', password: 'senha-errada' });

    expect(response.status).toBe(401);
  });

  it('retorna 400 quando o e-mail não é informado', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({ password: 'senha1234' });

    expect(response.status).toBe(400);
  });
});
