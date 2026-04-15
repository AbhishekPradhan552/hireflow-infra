FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5001

CMD ["npm", "run", "dev"]