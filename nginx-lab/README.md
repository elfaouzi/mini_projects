# Nginx + Node.js Production Simulation

This project demonstrates a **production-like setup** with Nginx acting as a **reverse proxy, static file server, and security/gateway layer** for a Node.js backend cluster.

## 🚀 Key Features

- **Load Balancing**: Distributes traffic across 4 Node.js instances.
- **Failover**: Nginx automatically skips unhealthy or crashed backend nodes.
- **Rate Limiting**: Protects the API from abuse (5 requests/sec per IP).
- **Static File Caching**: Nginx serves frontend files directly with a 1-hour cache.
- **Security Headers**: Implements `HSTS`, `X-Frame-Options`, and more for hardening.
- **HTTPS Redirect**: Automatically upgrades all HTTP traffic to HTTPS.

---

## 📂 Project Structure

```text
nginx-lab/
├─ public/              # Frontend static files (served by Nginx)
├─ nginx/
│  ├─ nginx.conf        # Nginx configuration
│  └─ certs/            # SSL Certificates (self-signed)
├─ server.js            # Node.js Express API
├─ Dockerfile           # Multi-stage production build
├─ docker-compose.yml   # Orchestration for app nodes + Nginx
└─ README.md
```

---

## 🛠️ Nginx Configuration Overview

### Upstream Node.js Cluster
Nginx acts as a load balancer for the 4 Node.js containers.
```nginx
upstream nodejs_cluster {
    server app-1:3000;
    server app-2:3000;
    server app-3:3000;
    server app-4:3000;
}
```

### Rate Limiting
Limits API requests to 5 per second per IP to prevent DoS attacks.
```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=5r/s;
```

### Security Headers
Hardens the server against common web vulnerabilities.
- `X-Frame-Options DENY`: Prevents clickjacking.
- `Strict-Transport-Security`: Enforces HTTPS (HSTS).

---

## 🏃 How to Run

1. **Build and start the cluster**:
   ```bash
   docker-compose up -d --build
   ```

2. **Access the application**:
   - URL: [https://localhost](https://localhost)
   - *Note: Since we use self-signed certs, your browser will show a warning.*

---

## 🧪 How to Test

### 1. Failover / Crash Recovery
Stop one Node.js container and see Nginx skip it without error:
```bash
docker-compose stop app-1
```
Check the API multiple times ([https://localhost/api/info](https://localhost/api/info)) — you will see the other nodes responding.

### 2. Rate Limiting
Rapidly call the API (more than 5 requests/sec):
```bash
for /L %i in (1,1,20) do curl -k -s -o NUL -w "%{http_code}\n" https://localhost/api/info
```
*Note: Some requests will return **503** if the limit is exceeded.*

### 3. Static File Caching
Open [https://localhost](https://localhost) in your browser.
In DevTools (Network tab), check the response headers for `index.html`:
- `Cache-Control: public`
- `Expires: <1 hour from now>`

### 4. Security Headers
Verify the headers:
```bash
curl -k -I https://localhost
```
Look for `X-Content-Type-Options`, `X-Frame-Options`, and `Strict-Transport-Security`.

---

> [!IMPORTANT]
> This setup uses self-signed certificates for local simulation. In a real production environment, use certificates from a trusted CA like Let's Encrypt.
