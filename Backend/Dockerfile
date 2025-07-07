FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

# Download wait-for-it.sh script and make executable
RUN apk add --no-cache curl && \
    curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x wait-for-it.sh

# Expose the port backend listens on
EXPOSE 4100

# Use wait-for-it to wait for db:3306 before starting nodemon on login.js
CMD ["./wait-for-it.sh", "db:3306", "--", "npx", "nodemon", "login.js"]
