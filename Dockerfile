# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_PUBLIC_SUPABASE_URL=https://vsnfewogxjiukoarykfq.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbmZld29neGppdWtvYXJ5a2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMzQyOTAsImV4cCI6MjA1NDYxMDI5MH0.1QKaD1h31xhAw0xEPlqfv2OBzHJikMdGJaH1N84pNz0
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbmZld29neGppdWtvYXJ5a2ZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTAzNDI5MCwiZXhwIjoyMDU0NjEwMjkwfQ.c3EBCUe_Vdx5XDQTQWStcDZ8omu6vWHwS3W3MzmmpRY

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"]