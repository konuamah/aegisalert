# Use official Node.js image to build the frontend
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Svelte app for production
RUN npm run build

# Use lightweight Nginx image to serve the static build files
FROM nginx:alpine

# Copy built files from previous stage to Nginx's public folder
COPY --from=build /app/public /usr/share/nginx/html

# Copy custom Nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
