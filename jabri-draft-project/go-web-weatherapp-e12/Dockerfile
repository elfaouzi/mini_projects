# Stage 1: Build the Go binary
FROM golang:1.25-alpine AS builder

# Install git for Go modules that might need it
RUN apk add --no-cache git

WORKDIR /app

# Copy go mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o main .

# Stage 2: Runtime image
FROM alpine:latest

# Install ca-certificates for HTTPS requests and create non-root user
RUN apk --no-cache add ca-certificates wget && \
    addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Create app directory and set ownership
WORKDIR /app

# Copy the binary with correct ownership
COPY --from=builder --chown=appuser:appgroup /app/main .

# Switch to non-root user for security
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Run the binary
CMD ["./main"]