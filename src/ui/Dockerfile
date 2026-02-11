# Dockerfile para Interfaz de Usuario
# 
# Construye una aplicación Node.js con:
# - Express como framework web
# - Pug como motor de plantillas
# - Node-fetch para comunicación con API Gateway
# - Bootstrap y Font Awesome para UI

FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
