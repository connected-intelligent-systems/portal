FROM node:22 as frontend
WORKDIR /app
COPY frontend/package-lock.json /app
COPY frontend/package.json /app
RUN npm install
COPY frontend/src /app/src
COPY frontend/public /app/public
COPY frontend/tsconfig.json /app/tsconfig.json
COPY frontend/vite.config.ts /app/vite.config.ts
COPY frontend/index.html /app/index.html
ENV REACT_APP_ENV=production
RUN npm run build

FROM nginx:alpine
ENV EDC_MANAGEMENT_API_URL=http://edc-provider:19193 \
    EDC_PROTOCOL_API_URL=http://edc-provider:19291 \
    EDC_API_KEY=supersecret
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]