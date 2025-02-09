# Use Node.js LTS
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json .npmrc ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Create env file from build args
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG GOOGLE_ID
ARG GOOGLE_SECRET

# Set environment variables for build time
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV GOOGLE_ID=${GOOGLE_ID}
ENV GOOGLE_SECRET=${GOOGLE_SECRET}

# After setting environment variables
RUN echo "Checking environment variables:" && \
    echo "NEXT_PUBLIC_SUPABASE_URL exists: ${NEXT_PUBLIC_SUPABASE_URL:+yes}" && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY exists: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:+yes}" && \
    echo "SUPABASE_SERVICE_ROLE_KEY exists: ${SUPABASE_SERVICE_ROLE_KEY:+yes}"

# Create a .env.local file during build
RUN echo "NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" > .env.local && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}" >> .env.local && \
    echo "SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}" >> .env.local && \
    echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env.local && \
    echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> .env.local && \
    echo "GOOGLE_ID=${GOOGLE_ID}" >> .env.local && \
    echo "GOOGLE_SECRET=${GOOGLE_SECRET}" >> .env.local

# Print the contents of .env.local (excluding sensitive values)
RUN echo "Contents of .env.local:" && \
    cat .env.local | sed 's/=.*/=exists/'

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install curl and wait-for-it
RUN apk add --no-cache curl

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/env.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.env.local ./

# Create a startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'node server.js & sleep 5 && curl --retry 30 --retry-delay 1 --retry-connrefused http://localhost:${PORT:-3000}/api/health && fg' >> /start.sh && \
    chmod +x /start.sh

# Expose port
EXPOSE 3000

# Set environment variables for runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV GOOGLE_ID=${GOOGLE_ID}
ENV GOOGLE_SECRET=${GOOGLE_SECRET}

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 \
    CMD curl --fail http://localhost:${PORT:-3000}/api/health || exit 1

# Start the application with the startup script
CMD ["/start.sh"]