# Estudo: Comparação entre TypeORM e Prisma com NestJS

Este repositório faz parte de um estudo comparativo entre os ORMs TypeORM e Prisma no ecossistema NestJS. Este projeto usa TypeORM e inclui uma aplicação de cursos/tags, com migrations e testes, servindo como base para comparar produtividade, DX (developer experience), performance e manutenção com uma futura versão equivalente em Prisma.

## Stack e escopo

- NestJS 11
- TypeScript 5
- TypeORM 0.3.x com @nestjs/typeorm
- Banco: PostgreSQL (pg) e suporte a SQLite (sqlite3)
- Módulo de domínio: Courses e Tags, com relação N:N via tabela de junção

## Estrutura principal

- src/courses: controller, service, dtos e entities (courses.entity.ts, tags.entity.ts)
- src/database: configuração do TypeORM (orm-cli-config.ts) e módulo
- src/migrations: migrations para criação de tabelas e relacionamentos

## Como executar

1. Instalação

- npm install

2. Ambiente

- Defina variáveis de conexão conforme orm-cli-config.ts (Postgres por padrão). Para testes locais rápidos, é possível usar SQLite.

3. Banco e migrations (TypeORM)

- npm run build && npx typeorm migration:run -d dist/database/orm-cli-config.js

4. Aplicação

- Desenvolvimento: npm run start:dev
- Produção: npm run start:prod

5. Testes

- Unit: npm run test
- E2E: npm run test:e2e
- Cobertura: npm run test:cov

## Critérios do comparativo (TypeORM vs Prisma)

- Ergonomia de modelos e relações (N:N, migrações, seeds)
- Produtividade em CRUDs (geração, validação, DTOs)
- Performance em consultas simples e com joins
- Ferramentas de migração e DX (CLI, erros, mensagens)
- Manutenibilidade (refactors, renomeações, evolução de schema)

## Próximos passos

- Criar projeto equivalente usando Prisma (mesma modelagem e endpoints)
- Executar cenários de teste e medir tempos/complexidade
- Documentar resultados e trade-offs

Observação: este README foca no projeto TypeORM; o estudo completo incluirá o projeto Prisma em repositório ou pasta paralela para comparação direta.

