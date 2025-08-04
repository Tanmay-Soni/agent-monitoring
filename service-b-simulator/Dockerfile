# Dockerfile

# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build (optional if you use tsc output)
RUN npm run build || true  # Avoid breaking build if not needed

# Start the simulation
CMD ["npm", "run", "dev"]
