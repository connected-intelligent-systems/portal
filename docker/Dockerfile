# Base stage with common dependencies
FROM node:22 AS base
WORKDIR /app
COPY package.json package-lock.json ./

# Development target
FROM base AS development
RUN npm ci
COPY index.html tsconfig.json vite.config.ts ./
COPY public ./public
# Source files will be mounted as volume in docker-compose
CMD ["npm", "run", "dev"]

# Builder stage for production
FROM base AS builder
RUN npm install
COPY src ./src
COPY public ./public
COPY tsconfig.json vite.config.ts index.html ./
ENV REACT_APP_ENV=production
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production
ENV EDC_MANAGEMENT_API_URL=http://edc-provider:19193 \
    EDC_PROTOCOL_API_URL=http://edc-provider:19291 \
    EDC_API_KEY=supersecret
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
