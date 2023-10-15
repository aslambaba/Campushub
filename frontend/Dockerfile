# Use an official Node.js runtime as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js application (change "build" to your Next.js build command if needed)
RUN npm run build

# Expose the port that your Next.js app will run on (adjust as needed)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
