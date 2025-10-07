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
-   Clique em **Authorize** no Swagger e cole o token no formato: `Bearer seu_token_aqui`
-   Teste os endpoints de `users`, `projects` e `todos`, observando os dados relacionados via `include`.

---

## 📝 Recursos Implementados

### 👤 **User**

-   `POST /users/register` → Registrar novo usuário
-   `POST /users/login` → Login e geração de token JWT
-   `GET /users` → Listar todos os usuários (autenticado)
-   `GET /users/{id}` → Buscar usuário por ID (autenticado)
-   `PUT /users/{id}` → Atualizar usuário (apenas o próprio usuário)
-   `DELETE /users/{id}` → Deletar usuário (apenas o próprio usuário)

### 📁 **Project**

-   `GET /projects` → Listar todos os projetos do usuário
-   `GET /projects/{id}` → Buscar projeto por ID (inclui `todos` relacionados)
-   `POST /projects` → Criar novo projeto
-   `PUT /projects/{id}` → Atualizar projeto
-   `DELETE /projects/{id}` → Deletar projeto

### 📝 **Todo**

-   `GET /todos` → Listar todos os todos do usuário
-   `GET /todos/{id}` → Buscar todo por ID
-   `POST /todos` → Criar novo todo (sem projeto)
-   `POST /todos/projects/{projectId}` → Criar todo vinculado a um projeto
-   `PUT /todos/{id}` → Atualizar todo
-   `DELETE /todos/{id}` → Deletar todo

---

## 🔒 Segurança e Validações

-   **Autenticação JWT**: Todas as rotas de usuários (exceto register e login), projetos e todos são protegidas
-   **Validação com Zod**: Todos os inputs são validados antes de serem processados
-   **Autorização**: Usuários só podem acessar, modificar e deletar seus próprios recursos
-   **Senhas hasheadas**: Utilização de bcrypt para armazenamento seguro de senhas

---

## 🧠 Sobre

Este projeto foi desenvolvido como parte de um exercício acadêmico, demonstrando conhecimentos em:

-   Desenvolvimento de APIs RESTful com TypeScript
-   Integração com banco de dados relacional via Prisma ORM
-   Documentação de API com Swagger
-   Boas práticas de validação e autenticação
-   Implementação de relacionamentos e operações CRUD completas

---

## 📹 Demonstração em Vídeo

👉 [Link para o vídeo no YouTube ou Google Drive](https://exemplo.com)

---

## 📄 Licença

Este projeto é de uso acadêmico e não possui licença de distribuição pública.
