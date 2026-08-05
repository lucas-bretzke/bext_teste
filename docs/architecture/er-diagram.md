# Diagrama Entidade-Relacionamento

Modelagem definida em [`prisma/schema.prisma`](../../prisma/schema.prisma).

```mermaid
erDiagram
  USERS ||--o{ TASK_LISTS : owns
  TASK_LISTS ||--o{ TASKS : contains

  USERS {
    uuid id PK
    varchar email UK
    varchar password_hash
    timestamptz created_at
    timestamptz updated_at
  }

  TASK_LISTS {
    uuid id PK
    varchar name
    uuid user_id FK
    timestamptz created_at
    timestamptz updated_at
  }

  TASKS {
    uuid id PK
    varchar title
    text description
    task_status status
    timestamptz due_date
    uuid list_id FK
    timestamptz created_at
    timestamptz updated_at
  }
```

## Observações

- `task_status` é um enum PostgreSQL (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
- `task_lists.user_id` possui `ON DELETE CASCADE`: remover um usuário remove suas listas.
- `tasks.list_id` possui `ON DELETE CASCADE`: remover uma lista remove suas tarefas.
- `(user_id, name)` é único em `task_lists` — um usuário não pode ter duas listas com o mesmo nome.
- Não existe `user_id` direto em `tasks`: a posse de uma tarefa é sempre resolvida através da lista à qual ela pertence (`tasks.list_id → task_lists.user_id`), e é isso que a camada de serviço valida em toda operação de escrita ou filtro.
