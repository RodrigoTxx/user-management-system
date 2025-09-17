# Deploy em Produção - VPS/Cloud

## 🚀 Deploy com Docker (Recomendado)

### 1. Dockerfile para Backend
```dockerfile
# backend/Dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app

# Copiar JAR da aplicação
COPY target/*.jar app.jar

# Expor porta
EXPOSE 8080

# Comando de inicialização
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Dockerfile para Frontend
```dockerfile
# frontend/Dockerfile
FROM node:16-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Nginx para servir a aplicação
FROM nginx:alpine
COPY --from=build /app/dist/user-management-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 4. Configuração Nginx para Frontend
```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Fallback para Angular Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configurações de cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Deploy Manual em VPS

### 1. Preparar Servidor
```bash
# Instalar Java
sudo apt update
sudo apt install openjdk-11-jdk

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Nginx
sudo apt install nginx
```

### 2. Deploy Backend
```bash
# Gerar JAR
cd backend
mvn clean package

# Copiar para servidor
scp target/*.jar usuario@servidor:/opt/user-management/

# Criar service
sudo vim /etc/systemd/system/user-management-backend.service
```

### 3. Service para Backend
```ini
[Unit]
Description=User Management Backend
After=network.target

[Service]
Type=simple
User=app
WorkingDirectory=/opt/user-management
ExecStart=/usr/bin/java -jar user-management.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 4. Deploy Frontend
```bash
# Build para produção
cd frontend
npm run build

# Copiar arquivos para Nginx
sudo cp -r dist/* /var/www/html/
```