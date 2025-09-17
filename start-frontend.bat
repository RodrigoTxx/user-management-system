@echo off
echo ====================================
echo  Iniciando Frontend Angular
echo ====================================
echo.

echo Navegando para o diretorio frontend...
cd frontend

echo.
echo Verificando se Node.js esta instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js 16+ de: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Verificando se npm esta instalado...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado!
    pause
    exit /b 1
)

echo.
echo Instalando dependencias do Angular...
npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo Iniciando servidor de desenvolvimento Angular...
echo.
echo Frontend estara disponivel em: http://localhost:4200
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm start