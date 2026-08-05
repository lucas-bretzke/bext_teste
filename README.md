# BextTeste

API para gerenciamento de tarefas desenvolvida com Express.js, TypeScript, PostgreSQL e Prisma.

## O que já está pronto

- estrutura inicial da aplicação, incluindo `app.ts` e `server.ts`;
- configuração e validação das variáveis de ambiente;
- tratamento centralizado de erros;
- logs com Pino;
- cadastro de usuários pela rota `POST /auth/register`;
- login pela rota `POST /auth/login`;
- geração e validação de token JWT;
- middleware de autenticação para proteger rotas privadas;
- CRUD de listas (`POST` / `GET` em `/lists`);
- CRUD de tarefas (`POST` / `GET` / `PATCH` / `DELETE` em `/tasks`), com filtro por lista, status e data de vencimento;
- controle de acesso: cada usuário só enxerga e manipula as próprias listas e tarefas;
- testes unitários e de integração com Vitest e Supertest, cobrindo sucesso, validação e controle de acesso entre usuários;
- documentação OpenAPI disponível em `/docs`.

## Como executar o projeto

Primeiro, crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Depois, instale as dependências e prepare o banco de dados:

```bash
npm install
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Por padrão, a API será iniciada em:

```text
http://localhost:3333
```

A documentação interativa fica disponível em:

```text
http://localhost:3333/docs
```

## Estrutura do projeto

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

Os módulos foram separados por responsabilidade. `auth` utiliza o repositório do módulo `users` para acessar dados de usuário; `tasks` utiliza o repositório do módulo `lists` para criar/listar tarefas e para validar que a lista informada pertence ao usuário autenticado. Detalhes em [`docs/architecture/architecture.md`](docs/architecture/architecture.md).

## Variáveis de ambiente

| Variável         | Descrição                                                                     | Exemplo                                                                  |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `NODE_ENV`       | Ambiente em que a aplicação está sendo executada                              | `development`                                                            |
| `PORT`           | Porta utilizada pelo servidor HTTP                                            | `3333`                                                                   |
| `DATABASE_URL`   | URL de conexão com o PostgreSQL                                               | `postgresql://postgres:postgres@localhost:5432/bext_tasks?schema=public` |
| `JWT_SECRET`     | Chave utilizada para assinar os tokens JWT. Deve ter pelo menos 16 caracteres | `substitua-por-uma-chave-segura`                                         |
| `JWT_EXPIRES_IN` | Tempo de validade do token de acesso                                          | `1d`                                                                     |
| `LOG_LEVEL`      | Nível dos logs gerados pelo Pino                                              | `info`                                                                   |

## Banco de dados

O projeto possui um arquivo `docker-compose.yml` para subir uma instância local do PostgreSQL.

Os principais comandos são:

```bash
npm run db:up
```

Sobe o container do PostgreSQL.

```bash
npm run prisma:migrate
```

Cria ou aplica migrations durante o desenvolvimento.

```bash
npm run prisma:studio
```

Abre o Prisma Studio para visualizar e editar os dados do banco.

```bash
npm run db:down
```

Encerra e remove o container local.

Em produção, as migrations existentes devem ser aplicadas com:

```bash
npm run prisma:deploy
```

Esse comando apenas aplica as migrations já criadas, sem gerar uma nova migration.

## Scripts disponíveis

| Comando                   | Descrição                                                  |
| ------------------------- | ---------------------------------------------------------- |
| `npm run dev`             | Executa o servidor em modo de desenvolvimento, com watch   |
| `npm run build`           | Compila o TypeScript e prepara os arquivos na pasta `dist` |
| `npm run start`           | Executa a versão compilada da aplicação                    |
| `npm run typecheck`       | Verifica os tipos do projeto                               |
| `npm run lint`            | Executa o ESLint                                           |
| `npm run format`          | Formata os arquivos do projeto                             |
| `npm test`                | Executa os testes                                          |
| `npm run db:up`           | Sobe o PostgreSQL pelo Docker                              |
| `npm run db:down`         | Encerra o PostgreSQL local                                 |
| `npm run prisma:generate` | Gera o Prisma Client                                       |
| `npm run prisma:migrate`  | Cria ou aplica migrations em desenvolvimento               |
| `npm run prisma:deploy`   | Aplica as migrations existentes em produção                |
| `npm run prisma:studio`   | Abre o Prisma Studio                                       |

## Versão do Prisma

O projeto utiliza o Prisma na versão `6.19.3`.

A versão foi mantida fixa porque o Prisma 7 alterou a forma de configurar a conexão do `datasource`. A propriedade `url` deixou de ser utilizada diretamente no `schema.prisma`, passando a exigir uma configuração com driver adapters.

Como essa mudança não era necessária para o objetivo deste teste, foi utilizada a versão 6, que já estava funcionando e atendia ao escopo do projeto.
