# --- STAGE 1: BUILD ---
# Usa uma imagem Node maior para instalar dependências e construir o projeto
FROM node:20-slim AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o package.json e package-lock.json (aproveita o cache do Docker)
COPY package*.json ./

# Instala as dependências de produção e desenvolvimento
RUN npm install

# Copia o resto do código fonte
COPY . .

# Constrói o aplicativo (cria a pasta 'dist')
RUN npm run build

# --- STAGE 2: PRODUCTION/RUNTIME ---
# Usa uma imagem Node menor (apenas para execução)
FROM node:20-slim AS production

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia APENAS o package.json e package-lock.json
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Copia a pasta 'dist' e node_modules da etapa de build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expõe a porta que o NestJS usa (padrão 3000)
EXPOSE 3000

# Comando para iniciar o servidor em modo de produção
CMD [ "node", "dist/main" ]