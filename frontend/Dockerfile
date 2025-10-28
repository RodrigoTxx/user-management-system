# Estágio 1: Build da aplicação Angular
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para o build)
RUN npm ci

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@16.2.0

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN ng build --configuration=production

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copiar arquivos buildados para o Nginx
COPY --from=builder /app/dist/user-management-frontend /usr/share/nginx/html

# Copiar configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]