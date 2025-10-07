const swaggerDocument = {
	openapi: "3.0.0",
	info: {
		title: "Todo-List API",
		version: "1.0.0",
		description: "API Todo com Users, Projects e Todos (JWT, Prisma, Zod)",
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
			UserUpdate: {
				type: "object",
				properties: {
					name: { type: "string" },
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
			TodoInput: {
				type: "object",
				required: ["title"],
				properties: {
					title: { type: "string" },
					description: { type: "string" },
					done: { type: "boolean" },
				},
			},
			TodoUpdate: {
				type: "object",
				properties: {
					title: { type: "string" },
					description: { type: "string" },
					done: { type: "boolean" },
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
			ProjectInput: {
				type: "object",
				required: ["name"],
				properties: {
					name: { type: "string" },
					description: { type: "string" },
				},
			},
			ProjectUpdate: {
				type: "object",
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
				},
			},
			ProjectWithTodos: {
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
		},
	},
	paths: {
		"/users/register": {
			post: {
				tags: ["Users"],
				summary: "Registrar novo usuário",
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
						description: "Email já registrado ou dados inválidos",
					},
				},
			},
		},
		"/users/login": {
			post: {
				tags: ["Users"],
				summary: "Login de usuário",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["email", "password"],
								properties: {
									email: { type: "string", format: "email" },
									password: { type: "string" },
								},
							},
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
		"/users/me": {
			get: {
				tags: ["Users"],
				security: [{ bearerAuth: [] }],
				summary: "Buscar dados do usuário autenticado",
				responses: {
					"200": {
						description: "Dados do usuário",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/User" },
							},
						},
					},
					"401": { description: "Não autorizado" },
					"404": { description: "Usuário não encontrado" },
				},
			},
		},
		"/users/{id}": {
			put: {
				tags: ["Users"],
				security: [{ bearerAuth: [] }],
				summary: "Atualizar usuário (apenas o próprio usuário)",
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
							schema: { $ref: "#/components/schemas/UserUpdate" },
						},
					},
				},
				responses: {
					"200": {
						description: "Usuário atualizado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/User" },
							},
						},
					},
					"400": { description: "Dados inválidos" },
					"401": { description: "Não autorizado" },
					"403": { description: "Proibido" },
				},
			},
			delete: {
				tags: ["Users"],
				security: [{ bearerAuth: [] }],
				summary: "Deletar usuário (apenas o próprio usuário)",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: {
					"204": { description: "Usuário deletado com sucesso" },
					"400": { description: "ID inválido" },
					"401": { description: "Não autorizado" },
					"403": { description: "Proibido" },
				},
			},
		},
		"/projects": {
			get: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Listar todos os projetos do usuário",
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
				summary: "Criar novo projeto",
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
					"400": { description: "Dados inválidos" },
					"401": { description: "Não autorizado" },
				},
			},
		},
		"/projects/{id}": {
			get: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Buscar projeto por ID (inclui todos relacionados)",
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
						description: "Projeto encontrado com seus todos",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ProjectWithTodos",
								},
							},
						},
					},
					"400": { description: "ID inválido" },
					"401": { description: "Não autorizado" },
					"404": { description: "Projeto não encontrado" },
				},
			},
			put: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Atualizar projeto",
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
								$ref: "#/components/schemas/ProjectUpdate",
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Projeto atualizado",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Project",
								},
							},
						},
					},
					"400": { description: "Dados inválidos" },
					"401": { description: "Não autorizado" },
					"404": { description: "Projeto não encontrado" },
				},
			},
			delete: {
				tags: ["Projects"],
				security: [{ bearerAuth: [] }],
				summary: "Deletar projeto",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: {
					"204": { description: "Projeto deletado com sucesso" },
					"400": { description: "ID inválido" },
					"401": { description: "Não autorizado" },
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
					"401": { description: "Não autorizado" },
				},
			},
			post: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Criar novo todo (sem projeto)",
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
					"400": { description: "Dados inválidos" },
					"401": { description: "Não autorizado" },
				},
			},
		},
		"/todos/{id}": {
			get: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Buscar todo por ID",
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
						description: "Todo encontrado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Todo" },
							},
						},
					},
					"400": { description: "ID inválido" },
					"401": { description: "Não autorizado" },
					"404": { description: "Todo não encontrado" },
				},
			},
			put: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Atualizar todo",
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
							schema: { $ref: "#/components/schemas/TodoUpdate" },
						},
					},
				},
				responses: {
					"200": {
						description: "Todo atualizado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Todo" },
							},
						},
					},
					"400": { description: "Dados inválidos" },
					"401": { description: "Não autorizado" },
					"404": { description: "Todo não encontrado" },
				},
			},
			delete: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Deletar todo",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: {
					"204": { description: "Todo deletado com sucesso" },
					"400": { description: "ID inválido" },
					"401": { description: "Não autorizado" },
					"404": { description: "Todo não encontrado" },
				},
			},
		},
		"/todos/projects/{projectId}": {
			post: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary: "Criar todo dentro de um projeto",
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
							schema: { $ref: "#/components/schemas/TodoInput" },
						},
					},
				},
				responses: {
					"201": {
						description: "Todo criado no projeto",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Todo" },
							},
						},
					},
					"400": { description: "Dados inválidos" },
					"401": { description: "Não autorizado" },
					"404": { description: "Projeto não encontrado" },
				},
			},
		},
	},
};

export default swaggerDocument;
