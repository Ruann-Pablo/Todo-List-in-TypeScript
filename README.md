# 📌 API Todo com Express, TypeScript, Prisma, PostgreSQL, Zod e Swagger

Este projeto é uma API RESTful desenvolvida como parte de um exercício acadêmico, atendendo aos seguintes requisitos:

-   Utilização de **ExpressJS**, **TypeScript**, **Prisma**, **PostgreSQL** e **Zod**
-   Implementação de **3 resources** principais: `User`, `Project` e `Todo`
-   Cada resource possui os **5 endpoints básicos**: GET All, GET by ID, POST, PUT e DELETE
-   **Relacionamentos** entre as entidades (`Project` → `Todo`, `User` → `Project`/`Todo`)
-   Uso de **include** do Prisma para retornar dados relacionados
-   **Validações com Zod** para garantir segurança e consistência dos dados de entrada
-   **Autenticação JWT** para proteger rotas privadas
-   **Documentação completa com Swagger**, acessível via `/docs`

---

## 🚀 Tecnologias Utilizadas

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Prisma ORM](https://www.prisma.io/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Zod](https://zod.dev/)
-   [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

## 📦 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste conforme seu banco):

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
JWT_SECRET="sua_chave_secreta"
```

### 4. Executar migrações do Prisma

```bash
npx prisma migrate dev
```

### 5. Rodar o servidor

```bash
npm run dev
```

Servidor será iniciado em:  
👉 [http://localhost:4000](http://localhost:4000)  
Swagger UI:  
👉 [http://localhost:4000/docs](http://localhost:4000/docs)

---

## 🧪 Testando a API

-   Utilize a **interface Swagger** para testar todos os endpoints.
-   Crie um usuário, faça login e copie o token JWT.
-   Clique em **Authorize** no Swagger e cole o token.
-   Teste os endpoints de `projects` e `todos`, observando os dados relacionados via `include`.

---

## 📝 Recursos Implementados

### 👤 **User**

-   `POST /users/register`
-   `POST /users/login`

### 📁 **Project**

-   `GET /projects`
-   `GET /projects/{id}` → inclui `todos` relacionados
-   `POST /projects`
-   `PUT /projects/{id}`
-   `DELETE /projects/{id}`

### 📝 **Todo**

-   `GET /todos`
-   `GET /todos/{id}`
-   `POST /todos`
-   `POST /todos/projects/{projectId}` → cria Todo vinculado a um projeto
-   `PUT /todos/{id}`
-   `DELETE /todos/{id}`

---

## 🧠 Sobre

Este projeto foi desenvolvido como parte de um exercício acadêmico, demonstrando conhecimentos em:

-   Desenvolvimento de APIs RESTful com TypeScript
-   Integração com banco de dados relacional via Prisma ORM
-   Documentação de API com Swagger
-   Boas práticas de validação e autenticação

---

## 📹 Demonstração em Vídeo

👉 [Link para o vídeo no YouTube ou Google Drive](https://exemplo.com)

---

## 📄 Licença

Este projeto é de uso acadêmico e não possui licença de distribuição pública.
