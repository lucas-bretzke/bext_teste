# Diagrama Entidade-Relacionamento

> Atualizar após a modelagem definitiva no Prisma.

```mermaid
erDiagram
  USER ||--o{ TASK_LIST : owns
  TASK_LIST ||--o{ TASK : contains
```
