# Use uma imagem base do Node.js
FROM node:latest

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install --legacy-peer-deps

# Instale o nodemon globalmente
RUN npm install -g @nestjs/cli

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta em que o aplicativo está sendo executado
EXPOSE 3000

# Comando para iniciar o nodemon em ambiente de desenvolvimento
CMD ["npm", "run", "start:dev"]
