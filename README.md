# Sistema de Gerenciamento de Usuários e Perfis

Este é um sistema completo de gerenciamento de usuários e perfis desenvolvido com **Spring Boot** no backend e **Angular** no frontend.

## 📋 Características

- **Backend**: Java 8+ com Spring Boot 2.7
- **Frontend**: Angular 16+ com Angular Material
- **Banco de Dados**: H2 (desenvolvimento) / MySQL (produção)
- **Autenticação**: JWT (JSON Web Token)
- **Segurança**: Spring Security com controle de acesso baseado em perfis

## 🏗️ Arquitetura

### Backend
- **Entities**: User, Profile (JPA/Hibernate)
- **Repositories**: Spring Data JPA
- **Services**: Lógica de negócio
- **Controllers**: API REST
- **Security**: JWT + Spring Security

### Frontend
- **Components**: Login, Dashboard, Gestão de Usuários e Perfis
- **Services**: Comunicação com API
- **Guards**: Proteção de rotas
- **Material Design**: Interface moderna e responsiva

## 🚀 Como Executar

### Pré-requisitos

- **Java 8+** (JDK)
- **Maven 3.6+**
- **Node.js 16+** e **npm**
- **Angular CLI** (opcional, mas recomendado)

### 1. Executando o Backend

```bash
# Navegar para o diretório do backend
cd backend

# Compilar e executar com Maven
mvn clean spring-boot:run

# Ou compilar e executar o JAR
mvn clean package
java -jar target/user-management-backend-1.0.0.jar
```

O backend estará disponível em: `http://localhost:8080`

#### Console H2 Database
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Usuário: `sa`
- Senha: `password`

### 2. Executando o Frontend

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start
# ou
ng serve
```

O frontend estará disponível em: `http://localhost:4200`

## 👥 Usuários Padrão

O sistema inicializa com os seguintes usuários:

| Usuário | Senha | Perfil | Descrição |
|---------|-------|--------|-----------|
| `admin` | `admin123` | ADMIN | Administrador com acesso completo |
| `user` | `user123` | USER | Usuário comum (visualização própria) |

## 🔒 Funcionalidades de Segurança

### Perfis de Acesso

1. **ADMIN (Administrador)**
   - Criar, editar, visualizar e excluir usuários
   - Gerenciar perfis de acesso
   - Ativar/desativar usuários
   - Visualizar estatísticas do sistema

2. **USER (Usuário Comum)**
   - Visualizar e editar apenas seus próprios dados
   - Não pode alterar seu perfil de acesso
   - Acesso limitado ao sistema

### Endpoints da API

#### Autenticação
- `POST /api/auth/login` - Login do usuário

#### Usuários (Requer autenticação)
- `GET /api/users` - Listar usuários (apenas ADMIN)
- `GET /api/users/{id}` - Buscar usuário (ADMIN ou próprio usuário)
- `GET /api/users/me` - Dados do usuário logado
- `POST /api/users` - Criar usuário (apenas ADMIN)
- `PUT /api/users/{id}` - Atualizar usuário (apenas ADMIN)
- `PUT /api/users/me` - Atualizar próprios dados
- `DELETE /api/users/{id}` - Excluir usuário (apenas ADMIN)

#### Perfis (Requer autenticação)
- `GET /api/profiles` - Listar perfis
- `GET /api/profiles/{id}` - Buscar perfil
- `POST /api/profiles` - Criar perfil (apenas ADMIN)
- `PUT /api/profiles/{id}` - Atualizar perfil (apenas ADMIN)
- `DELETE /api/profiles/{id}` - Excluir perfil (apenas ADMIN)

## 📱 Interface do Usuário

### Telas Principais

1. **Login** - Autenticação do usuário
2. **Dashboard** - Visão geral e ações rápidas
3. **Gestão de Usuários** (Admin) - CRUD de usuários
4. **Gestão de Perfis** (Admin) - CRUD de perfis
5. **Meu Perfil** - Edição dos próprios dados

### Recursos da Interface

- **Responsiva**: Adapta-se a diferentes tamanhos de tela
- **Material Design**: Interface moderna e intuitiva
- **Validação de Formulários**: Validação em tempo real
- **Feedback Visual**: Mensagens de sucesso e erro
- **Loading States**: Indicadores de carregamento

## 🔧 Configurações

### Backend (application.properties)

```properties
# Banco H2 (Desenvolvimento)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=userManagementSecretKey
jwt.expiration=86400000

# CORS
spring.mvc.cors.allowed-origins=http://localhost:4200
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 🧪 Testes

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Build para Produção

### Backend
```bash
cd backend
mvn clean package -DskipTests
```
O JAR será gerado em `target/user-management-backend-1.0.0.jar`

### Frontend
```bash
cd frontend
npm run build
```
Os arquivos serão gerados na pasta `dist/`

## 🔄 Configuração para MySQL (Produção)

1. Adicionar dependência no `pom.xml`:
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

2. Configurar `application-prod.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_management
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

3. Executar com perfil de produção:
```bash
java -jar target/user-management-backend-1.0.0.jar --spring.profiles.active=prod
```

## 📝 Estrutura do Projeto

```
user-management-system/
├── backend/
│   ├── src/main/java/com/usermanagement/
│   │   ├── entity/          # Entidades JPA
│   │   ├── repository/      # Repositories
│   │   ├── service/         # Serviços
│   │   ├── controller/      # Controllers REST
│   │   ├── config/          # Configurações
│   │   └── dto/            # Data Transfer Objects
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/app/
│   │   ├── components/      # Componentes Angular
│   │   ├── services/        # Serviços
│   │   ├── models/         # Modelos TypeScript
│   │   └── guards/         # Guards de rota
│   └── src/assets/         # Recursos estáticos
└── README.md
```

## 📞 Contato

Para dúvidas, entre em contato através do email: rodrigoggcavalcanti@gmail.com

---

**Desenvolvido com ❤️ usando Spring Boot + Angular**