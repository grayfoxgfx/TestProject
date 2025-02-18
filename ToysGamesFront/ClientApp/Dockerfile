# Etapa 1: Construir la aplicación Angular
FROM node:18 AS build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración del proyecto
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación en modo producción
RUN npm run build -- --configuration production

# Etapa 2: Servir la aplicación usando Nginx
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
