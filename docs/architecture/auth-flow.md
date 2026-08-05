# Fluxo de autenticação

A autenticação da API funciona com JWT e não utiliza sessões armazenadas no banco de dados.

Ao realizar o login ou o cadastro, o usuário recebe um token que contém seu identificador no campo `sub`. Esse token deve ser enviado nas requisições protegidas e é validado pela API sempre que uma nova requisição é recebida.

## Cadastro e login

```mermaid
sequenceDiagram
  participant C as Cliente
  participant A as API
  participant D as Banco

  C->>A: POST /auth/register (email, senha)
  A->>D: Verifica se o e-mail já está cadastrado
  A->>D: Salva o usuário com a senha criptografada usando bcrypt
  A-->>C: 201 - Retorna o usuário e o token JWT

  C->>A: POST /auth/login (email, senha)
  A->>D: Busca o usuário pelo e-mail
  A->>A: Compara a senha informada com o hash armazenado
  A-->>C: 200 - Retorna o usuário e o token JWT
```

No cadastro, a API verifica primeiro se já existe uma conta com o e-mail informado. Caso não exista, a senha é protegida com `bcrypt` antes de o usuário ser salvo no banco.

No login, a API localiza o usuário pelo e-mail e compara a senha enviada com o hash armazenado. Se os dados estiverem corretos, um novo token JWT é gerado e retornado ao cliente.

## Acesso a rotas protegidas

```mermaid
sequenceDiagram
  participant C as Cliente
  participant A as API

  C->>A: Requisição com Authorization: Bearer <token>
  A->>A: authMiddleware valida a assinatura e a validade do token
  A->>A: Define req.user.id com o sub do token
  A-->>C: A requisição segue para o controller
```

Para acessar uma rota protegida, o cliente precisa enviar o token no cabeçalho da requisição:

```text
Authorization: Bearer <token>
```

O `authMiddleware` valida a assinatura do token e verifica se ele ainda está dentro do prazo de validade. Depois disso, o identificador presente no campo `sub` é atribuído a `req.user.id`, permitindo que o restante da aplicação saiba qual usuário está fazendo a requisição.

Caso o token não seja enviado, esteja expirado ou seja inválido, a requisição é interrompida e a API retorna o status `401`. Dessa forma, o controller só é executado quando o usuário está devidamente autenticado.
