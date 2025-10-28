# Estágio 1: Build da aplicação
FROM maven:3.8-openjdk-8-slim AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar pom.xml primeiro (para cache de dependências)
COPY pom.xml .

# Baixar dependências
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar a aplicação
RUN mvn clean package -DskipTests

# Estágio 2: Runtime
FROM openjdk:8-jre-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar o JAR compilado do estágio anterior
COPY --from=builder /app/target/user-management-backend-1.0.0.jar app.jar

# Expor a porta 8080
EXPOSE 8080

# Configurações de JVM otimizadas para container
ENV JAVA_OPTS="-Xmx512m -Xms256m -Djava.security.egd=file:/dev/./urandom"

# Comando para executar a aplicação
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]