@echo off

REM Script para iniciar os serviços com Docker Compose no Windows

echo 🚀 Iniciando o Sistema de Gerenciamento de Usuários com Docker...

REM Verificar se o Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está instalado. Por favor, instale o Docker primeiro.
    pause
    exit /b 1
)

REM Parar e remover containers existentes
echo 🔄 Parando containers existentes...
docker-compose down --volumes --remove-orphans

REM Construir e executar os serviços
echo 🏗️  Construindo e iniciando os serviços...
docker-compose up --build -d

REM Aguardar os serviços ficarem prontos
echo ⏳ Aguardando os serviços ficarem prontos...
timeout /t 30 /nobreak >nul

REM Verificar status dos serviços
echo 📊 Status dos serviços:
docker-compose ps

echo.
echo ✅ Serviços iniciados com sucesso!
echo.
echo 🌐 Frontend (Angular): http://localhost:4200
echo 🔧 Backend (Spring Boot): http://localhost:8080
echo 🗄️  H2 Console: http://localhost:8080/h2-console
echo.
echo 👥 Usuários padrão:
echo    Admin: admin/admin123
echo    Usuário: user/user123
echo.
echo Para parar os serviços: docker-compose down
echo Para ver logs: docker-compose logs -f

pause