#!/bin/bash

echo "===================================="
echo " Sistema de Gerenciamento de Usuarios"
echo "===================================="
echo

echo "[1/3] Compilando o backend..."
cd backend
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "Erro ao compilar o backend!"
    exit 1
fi

echo
echo "[2/3] Iniciando o backend..."
nohup mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!

echo
echo "[3/3] Aguardando backend inicializar..."
sleep 10

echo
echo "Backend iniciado em: http://localhost:8080"
echo "Console H2: http://localhost:8080/h2-console"
echo
echo "Usuarios padrao:"
echo "- admin / admin123 (Administrador)"
echo "- user  / user123  (Usuario comum)"
echo
echo "PID do backend: $BACKEND_PID"
echo

echo "Para parar o backend: kill $BACKEND_PID"
echo
echo "Para iniciar o frontend, execute:"
echo "cd frontend"
echo "npm install"
echo "npm start"
echo
echo "Frontend estara disponivel em: http://localhost:4200"