FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]