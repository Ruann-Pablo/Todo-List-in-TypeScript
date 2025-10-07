const swaggerDocument = {
	openapi: "3.0.0",
	info: {
		title: "Todo API",
		version: "1.0.0",
		description:
			"API de gerenciamento de usuários, projetos e tarefas (Todos). Utiliza ExpressJS, Prisma, PostgreSQL, Zod e JWT.",
	},
	servers: [{ url: "http://localhost:4000" }],
	components: {
		securitySchemes: {
			bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
		},
		schemas: {
			UserRegister: {
				type: "object",
				required: ["name", "email", "password"],
				properties: {
					name: { type: "string" },
					email: { type: "string", format: "email" },
					password: { type: "string" },
				},
			},
			UserLogin: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string" },
				},
			},
			User: {
				type: "object",
				properties: {
					id: { type: "integer" },
					name: { type: "string" },
					email: { type: "string" },
				},
			},
			AuthResponse: {
				type: "object",
				properties: {
					token: { type: "string" },
					user: { $ref: "#/components/schemas/User" },
				},
			},

			ProjectInput: {
				type: "object",
				required: ["name"],
				properties: {
					name: { type: "string" },
					description: { type: "string" },
				},
			},
			Project: {
				type: "object",
				properties: {
					id: { type: "integer" },
					name: { type: "string" },
					description: { type: "string" },
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" },
					todos: {
						type: "array",
						items: { $ref: "#/components/schemas/Todo" },
					},
				},
			},

			TodoInput: {
				type: "object",
				required: ["title"],
				properties: {
					title: { type: "string" },
					description: { type: "string" },
					done: { type: "boolean" },
					projectId: { type: "integer", nullable: true },
				},
			},
			Todo: {
				type: "object",
				properties: {
					id: { type: "integer" },
					title: { type: "string" },
					description: { type: "string" },
					done: { type: "boolean" },
					projectId: { type: "integer", nullable: true },
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" },
				},
			},
		},
	},
	paths: {
		"/users/register": {
			post: {
				tags: ["Users"],
				summary: "Registrar um novo usuário",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UserRegister",
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Usuário criado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/User" },
							},
						},
					},
					"400": {
						description: "Erro de validação ou email já cadastrado",
					},
				},
			},
		},
		"/users/login": {
			post: {
				tags: ["Users"],
				summary: "Fazer login e obter JWT",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/UserLogin" },
						},
					},
				},
				responses: {
					"200": {
						description: "Login bem-sucedido",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/AuthResponse",
								},
							},
						},
					},
					"400": { description: "Credenciais inválidas" },
				},
			},
		},

		"/projects": {
			get: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Listar todos os projetos do usuário autenticado",
				responses: {
					"200": {
						description: "Lista de projetos",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/Project",
									},
								},
							},
						},
					},
					"401": { description: "Não autorizado" },
				},
			},
			post: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Criar um novo projeto",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ProjectInput",
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Projeto criado",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Project",
								},
							},
						},
					},
					"400": { description: "Erro de validação" },
					"401": { description: "Não autorizado" },
				},
			},
		},
		"/projects/{id}": {
			get: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Buscar um projeto por ID (incluindo todos)",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: {
					"200": {
						description: "Projeto encontrado",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Project",
								},
							},
						},
					},
					"404": { description: "Projeto não encontrado" },
					"401": { description: "Não autorizado" },
				},
			},
			put: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Atualizar um projeto existente",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ProjectInput",
							},
						},
					},
				},
				responses: {
					"200": { description: "Projeto atualizado" },
					"400": { description: "Erro de validação" },
					"404": { description: "Projeto não encontrado" },
				},
			},
			delete: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Deletar um projeto",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: {
					"204": { description: "Deletado com sucesso" },
					"404": { description: "Projeto não encontrado" },
				},
			},
		},

		"/todos": {
			get: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Listar todos os todos do usuário",
				responses: {
					"200": {
						description: "Lista de todos",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/Todo",
									},
								},
							},
						},
					},
				},
			},
			post: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Criar um todo (sem projeto)",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/TodoInput" },
						},
					},
				},
				responses: {
					"201": {
						description: "Todo criado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Todo" },
							},
						},
					},
					"400": { description: "Erro de validação" },
				},
			},
		},
		"/todos/{id}": {
			get: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Buscar um todo por ID",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: {
					"200": { description: "Todo encontrado" },
					"404": { description: "Todo não encontrado" },
				},
			},
			put: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Atualizar um todo",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/TodoInput" },
						},
					},
				},
				responses: {
					"200": { description: "Todo atualizado" },
					"404": { description: "Todo não encontrado" },
				},
			},
			delete: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Deletar um todo",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: {
					"204": { description: "Deletado com sucesso" },
					"404": { description: "Todo não encontrado" },
				},
			},
		},
		"/todos/projects/{projectId}": {
			post: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary:
					"Criar um todo dentro de um projeto (projectId via path param)",
				parameters: [
					{
						name: "projectId",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["title"],
								properties: {
									title: { type: "string" },
									description: { type: "string" },
								},
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Todo criado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Todo" },
							},
						},
					},
					"404": { description: "Projeto não encontrado" },
				},
			},
		},
	},
};

export default swaggerDocument;
