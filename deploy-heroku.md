# Deploy Rápido - Heroku

## 🚀 Deploy Gratuito no Heroku

### 1. Preparar Backend para Heroku

**Criar: `backend/Procfile`**
```
web: java -Dserver.port=$PORT -jar target/*.jar
```

**Atualizar: `backend/src/main/resources/application-prod.properties`**
```properties
# Heroku PostgreSQL
spring.datasource.url=${DATABASE_URL}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update

# Server port dinâmica
server.port=${PORT:8080}

# CORS para Heroku
cors.allowed-origins=${FRONTEND_URL:http://localhost:4200}

# JWT
jwt.secret=${JWT_SECRET:meuSegredoSuperSecreto123!@#}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

### 2. Deploy Backend
```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Criar app backend
heroku create seu-app-backend

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variáveis
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set JWT_SECRET="seuSegredoMuitoSeguro123!@#$"
heroku config:set FRONTEND_URL="https://seu-app-frontend.herokuapp.com"

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 3. Preparar Frontend para Heroku

**Criar: `frontend/server.js`**
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/user-management-frontend'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/user-management-frontend/index.html'));
});

app.listen(process.env.PORT || 8080);
```

**Atualizar: `frontend/package.json`**
```json
{
  "scripts": {
    "heroku-postbuild": "ng build --prod",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### 4. Deploy Frontend
```bash
# Criar app frontend
heroku create seu-app-frontend

# Deploy
git add .
git commit -m "Deploy frontend"
git push heroku main
```

## 🌐 URLs Finais
- **Backend:** `https://seu-app-backend.herokuapp.com`
- **Frontend:** `https://seu-app-frontend.herokuapp.com`
- **Login:** admin / admin123