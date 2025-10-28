#!/bin/bash

# Script para iniciar os serviços com Docker Compose

echo "🚀 Iniciando o Sistema de Gerenciamento de Usuários com Docker..."

# Verificar se o Docker e Docker Compose estão instalados
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar e remover containers existentes
echo "🔄 Parando containers existentes..."
docker-compose down --volumes --remove-orphans

# Construir e executar os serviços
echo "🏗️  Construindo e iniciando os serviços..."
docker-compose up --build -d

# Aguardar os serviços ficarem prontos
echo "⏳ Aguardando os serviços ficarem prontos..."
sleep 30

# Verificar status dos serviços
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "✅ Serviços iniciados com sucesso!"
echo ""
echo "🌐 Frontend (Angular): http://localhost:4200"
echo "🔧 Backend (Spring Boot): http://localhost:8080"
echo "🗄️  H2 Console: http://localhost:8080/h2-console"
echo ""
echo "👥 Usuários padrão:"
echo "   Admin: admin/admin123"
echo "   Usuário: user/user123"
echo ""
echo "Para parar os serviços: docker-compose down"
echo "Para ver logs: docker-compose logs -f"