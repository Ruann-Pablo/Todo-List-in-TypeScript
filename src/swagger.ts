const swaggerDocument = {
	openapi: "3.0.0",
	info: {
		title: "Todo API",
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
					projectId: { type: "integer" },
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
		},
	},
	paths: {
		"/users": {
			get: {
				tags: ["Users"],
				security: [{ bearerAuth: [] }],
				summary: "Listar todos os usuários",
				responses: {
					"200": {
						description: "Lista de usuários",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/User",
									},
								},
							},
						},
					},
					"401": { description: "Não autorizado" },
				},
			},
		},
		"/users/{id}": {
			get: {
				tags: ["Users"],
				security: [{ bearerAuth: [] }],
				summary: "Buscar usuário por ID",
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
						description: "Usuário encontrado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/User" },
							},
						},
					},
					"400": { description: "ID inválido" },
					"401": { description: "Não autorizado" },
					"404": { description: "Usuário não encontrado" },
				},
			},
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
		"/todos/projects/{projectId}": {
			post: {
				tags: ["Todos"],
				security: [{ bearerAuth: [] }],
				summary:
					"Criar todo dentro de um projeto (sem enviar projectId no body)",
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
									done: { type: "boolean" },
								},
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Criado",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Todo" },
							},
						},
					},
					"400": { description: "Bad request" },
					"401": { description: "Não autorizado" },
				},
			},
		},
	},
};

export default swaggerDocument;
