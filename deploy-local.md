# Deploy Local - User Management System

## 📋 Pré-requisitos
- Java 11 ou superior
- Node.js 16+ e npm
- Máquina com IP acessível na rede

## 🔧 Configuração para Rede Local

### 1. Configurar Backend para Aceitar Conexões Externas

**Editar: `backend/src/main/resources/application.properties`**
```properties
# Servidor web
server.port=8080
server.address=0.0.0.0

# CORS para permitir acesso do frontend
cors.allowed-origins=http://localhost:4200,http://SEU_IP:4200

# Database H2 (desenvolvimento)
spring.datasource.url=jdbc:h2:mem:usermanagement
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# JWT
jwt.secret=meuSegredoSuperSecreto123!@#
jwt.expiration=86400000

# H2 Console (apenas desenvolvimento)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### 2. Configurar Frontend para IP da Máquina

**Editar os arquivos de serviço (ProfileService, UserService, AuthService):**
```typescript
// Trocar localhost pelo IP da sua máquina
private apiUrl = 'http://SEU_IP:8080/api/profiles';
```

### 3. Scripts de Inicialização

**start-system.sh:**
```bash
#!/bin/bash
echo "🚀 Iniciando User Management System..."

# Inicia o backend
cd backend
echo "📊 Iniciando Backend..."
nohup mvn spring-boot:run > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Aguarda o backend inicializar
sleep 15

# Inicia o frontend
cd ../frontend
echo "🎨 Iniciando Frontend..."
nohup ng serve --host 0.0.0.0 --port 4200 > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "✅ Sistema iniciado!"
echo "📊 Backend: http://SEU_IP:8080"
echo "🎨 Frontend: http://SEU_IP:4200"
echo "👤 Login: admin / admin123"
```

## 🌐 Acesso
- **URL:** `http://SEU_IP:4200`
- **Admin:** admin / admin123
- **User:** user / user123