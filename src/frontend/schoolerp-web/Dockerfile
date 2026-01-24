# Build Stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY src/frontend/schoolerp-web/package*.json ./
RUN npm ci

# Copy source code and build
COPY src/frontend/schoolerp-web/ .
RUN npm run build

# Runtime Stage (Nginx)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=build /app/dist .

# Copy custom nginx config
COPY src/frontend/schoolerp-web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
