@echo off
echo ====================================
echo  Sistema de Gerenciamento de Usuarios
echo ====================================
echo.

echo [1/3] Compilando o backend...
cd backend
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Erro ao compilar o backend!
    pause
    exit /b 1
)

echo.
echo [2/3] Iniciando o backend...
start "Backend" cmd /c "mvn spring-boot:run"

echo.
echo [3/3] Aguardando backend inicializar...
timeout /t 10 /nobreak > nul

echo.
echo Backend iniciado em: http://localhost:8080
echo Console H2: http://localhost:8080/h2-console
echo.
echo Usuarios padrao:
echo - admin / admin123 (Administrador)
echo - user  / user123  (Usuario comum)
echo.

echo Pressione qualquer tecla para continuar...
pause > nul

echo.
echo Para iniciar o frontend, execute:
echo cd frontend
echo npm install
echo npm start
echo.
echo Frontend estara disponivel em: http://localhost:4200
echo.
pause