# BextTeste — base do projeto

Estrutura inicial para a API de gerenciamento de tarefas com Express.js, TypeScript, PostgreSQL e Prisma.

## Estado atual

Este pacote contém somente a fundação do projeto:

- estrutura de pastas;
- dependências e scripts;
- TypeScript, ESLint e Prettier;
- PostgreSQL via Docker Compose;
- configuração inicial do Prisma;
- Vitest e Supertest preparados;
- esqueleto da documentação OpenAPI;
- arquivos para os diagramas exigidos.

A implementação da API ainda não foi criada. Não existem controllers, services, repositories, middlewares ou rotas implementados.

## Primeiros passos

```bash
cp .env.example .env
npm install
npm run db:up
npm run prisma:generate
```

Depois, crie os arquivos `src/app.ts` e `src/server.ts` e comece a implementação.

## Estrutura

```text
src/
  config/
  docs/
  modules/
    auth/
    users/
    lists/
    tasks/
  shared/
    database/
    errors/
    middlewares/
    types/
    utils/
tests/
  integration/
  unit/
  helpers/
prisma/
  migrations/
  schema.prisma
docs/
  architecture/
```

## Scripts preparados

| Comando | Finalidade |
|---|---|
| `npm run dev` | Executar o servidor em modo watch após criar `src/server.ts` |
| `npm run build` | Compilar o TypeScript |
| `npm run start` | Executar o build |
| `npm run typecheck` | Validar os tipos |
| `npm run lint` | Executar o ESLint |
| `npm run format` | Formatar os arquivos |
| `npm test` | Executar os testes |
| `npm run db:up` | Subir o PostgreSQL |
| `npm run db:down` | Derrubar o PostgreSQL |
| `npm run prisma:migrate` | Criar/aplicar migrations em desenvolvimento |
| `npm run prisma:studio` | Abrir o Prisma Studio |

## Observação sobre versões

As dependências, com exceção do Express, usam a tag `latest` nesta base inicial. Ao executar `npm install`, o npm criará o `package-lock.json` com as versões efetivamente instaladas. Revise e mantenha esse arquivo no repositório para garantir instalações reproduzíveis.
