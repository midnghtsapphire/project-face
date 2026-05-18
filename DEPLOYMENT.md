# Deployment Guide — Project Face

Complete guide to deploying Project Face to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Backup Strategy](#backup-strategy)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Domain name** with DNS control
- **Server** — Ubuntu 22.04+ with:
  - 2+ CPU cores
  - 4+ GB RAM
  - 20+ GB storage
  - Docker & Docker Compose v2+
- **API Keys** — OpenAI, OpenWeatherMap, Stripe

---

## Deployment Options

### Option 1: DigitalOcean Droplet (Recommended)

**Advantages:**
- Simple, affordable ($12-24/month)
- Full control over infrastructure
- Easy to scale

**Steps:**

1. **Create a Droplet**
   ```bash
   # Use the Docker marketplace image on DigitalOcean
   # Select: Ubuntu 22.04 Docker
   # Size: Basic ($12/mo or higher)
   ```

2. **SSH into your droplet**
   ```bash
   ssh root@your-server-ip
   ```

3. **Clone the repository**
   ```bash
   git clone https://github.com/midnghtsapphire/project-face.git
   cd project-face
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your production values
   ```

5. **Generate strong secrets**
   ```bash
   # Generate SECRET_KEY
   openssl rand -hex 32
   
   # Generate database password
   openssl rand -hex 24
   ```

6. **Start the application**
   ```bash
   docker compose up -d --build
   ```

7. **Check status**
   ```bash
   docker compose ps
   docker compose logs -f
   ```

### Option 2: DigitalOcean App Platform

**Advantages:**
- Fully managed (no server maintenance)
- Auto-scaling
- Built-in SSL

**Steps:**

1. **Push to GitHub** (already done)
2. **Create App on DigitalOcean**
   - Select "Create App"
   - Choose GitHub repo: `midnghtsapphire/project-face`
   - Select branch: `main`
3. **Configure Services**
   - Add PostgreSQL managed database
   - Add Redis managed database
   - Set environment variables
4. **Deploy**

### Option 3: Docker Compose (Any Server)

Works on any server with Docker installed.

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone and deploy
git clone https://github.com/midnghtsapphire/project-face.git
cd project-face
cp .env.example .env
# Edit .env with production values
docker compose up -d --build
```

---

## Environment Configuration

### Critical Variables (MUST be changed)

```bash
# Generate strong secrets
SECRET_KEY=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -hex 24)
REDIS_PASSWORD=$(openssl rand -hex 16)

# Update in .env
SECRET_KEY=<generated-secret>
POSTGRES_PASSWORD=<generated-password>
REDIS_PASSWORD=<generated-password>
```

### Production-Ready .env

```bash
# ---- PostgreSQL ----
POSTGRES_USER=projectface_prod
POSTGRES_PASSWORD=<strong-random-password>
POSTGRES_DB=projectface_prod
DATABASE_URL=postgresql://projectface_prod:<password>@postgres:5432/projectface_prod

# ---- Redis ----
REDIS_URL=redis://:<redis-password>@redis:6379/0
REDIS_PASSWORD=<strong-redis-password>

# ---- Backend ----
SECRET_KEY=<strong-secret-key-at-least-32-chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
BACKEND_CORS_ORIGINS=["https://projectface.com","https://www.projectface.com"]

# ---- OpenAI ----
OPENAI_API_KEY=sk-proj-<your-production-key>
OPENAI_MODEL=gpt-4o

# ---- Weather ----
OPENWEATHER_API_KEY=<your-production-key>

# ---- Stripe ----
STRIPE_SECRET_KEY=sk_live_<your-live-key>
STRIPE_PUBLISHABLE_KEY=pk_live_<your-live-key>
STRIPE_WEBHOOK_SECRET=whsec_<webhook-secret>
STRIPE_PRICE_MONTHLY=price_<monthly-id>
STRIPE_PRICE_YEARLY=price_<yearly-id>

# ---- Frontend ----
VITE_API_URL=https://api.projectface.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_<your-live-key>

# ---- Branding ----
VITE_BRAND_NAME=Project Face
VITE_BRAND_PARENT=GlowStarLabs
VITE_HUB_URL=https://rvvel.com
VITE_OFFICIAL_URL=https://audreyevansofficial.com
```

---

## Database Setup

### Initial Migration

```bash
# Enter the backend container
docker compose exec backend bash

# Run migrations
alembic upgrade head

# Verify
alembic current
```

### Backup Script

Create `/root/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="projectface_${DATE}.sql"

mkdir -p $BACKUP_DIR

docker compose exec -T postgres pg_dump \
  -U projectface_prod \
  -d projectface_prod \
  > "$BACKUP_DIR/$FILENAME"

# Keep only last 7 days
find $BACKUP_DIR -name "projectface_*.sql" -mtime +7 -delete

echo "Backup saved: $FILENAME"
```

Make it executable and add to cron:

```bash
chmod +x /root/backup-db.sh
crontab -e

# Add this line (daily backup at 2am)
0 2 * * * /root/backup-db.sh >> /var/log/db-backup.log 2>&1
```

---

## SSL/TLS Configuration

### Option 1: Let's Encrypt (Free, Automatic)

1. **Install Certbot**
   ```bash
   apt update
   apt install -y certbot python3-certbot-nginx
   ```

2. **Stop Nginx container**
   ```bash
   docker compose stop nginx
   ```

3. **Get certificate**
   ```bash
   certbot certonly --standalone -d projectface.com -d www.projectface.com
   ```

4. **Copy certificates to nginx/ssl/**
   ```bash
   cp /etc/letsencrypt/live/projectface.com/fullchain.pem nginx/ssl/
   cp /etc/letsencrypt/live/projectface.com/privkey.pem nginx/ssl/
   ```

5. **Update nginx.conf**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name projectface.com www.projectface.com;
       
       ssl_certificate /etc/nginx/ssl/fullchain.pem;
       ssl_certificate_key /etc/nginx/ssl/privkey.pem;
       
       # ... rest of config
   }
   ```

6. **Restart**
   ```bash
   docker compose up -d nginx
   ```

### Option 2: Cloudflare (Easy, Free)

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Enable "Full (strict)" SSL mode
4. Enable "Always Use HTTPS"
5. No server-side SSL needed (Cloudflare handles it)

---

## Monitoring & Logging

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Last 100 lines
docker compose logs --tail=100 backend
```

### Log Rotation

Create `/etc/logrotate.d/docker-compose`:

```
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
```

### Health Monitoring

Add this to cron for uptime monitoring:

```bash
#!/bin/bash
# /root/health-check.sh

HEALTH_URL="https://projectface.com/health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$STATUS" != "200" ]; then
    echo "$(date): Health check failed - Status $STATUS" >> /var/log/health.log
    # Add alert (email, Slack, etc.)
fi
```

---

## Backup Strategy

### What to Backup

1. **Database** — Daily automated backups (see above)
2. **User uploads** — `backend/uploads/` directory
3. **Environment config** — `.env` file (store securely)

### Upload Backups

```bash
# /root/backup-uploads.sh
#!/bin/bash
UPLOAD_DIR="/path/to/project-face/backend/uploads"
BACKUP_DIR="/backups/uploads"
DATE=$(date +%Y%m%d)

rsync -av --delete $UPLOAD_DIR/ $BACKUP_DIR/$DATE/
```

### Off-site Backups

Consider using:
- **DigitalOcean Spaces** (S3-compatible)
- **AWS S3**
- **Backblaze B2** (cheap)

```bash
# Install s3cmd
apt install s3cmd

# Configure
s3cmd --configure

# Sync backups
s3cmd sync /backups/ s3://your-bucket/projectface-backups/
```

---

## Troubleshooting

### Services won't start

```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Check memory
free -h

# Recreate containers
docker compose down -v
docker compose up -d --build
```

### Database connection failed

```bash
# Check PostgreSQL status
docker compose exec postgres pg_isready

# Check credentials in .env
cat .env | grep POSTGRES

# Restart database
docker compose restart postgres
```

### Frontend can't reach backend

1. Check CORS settings in `.env`
2. Verify nginx configuration
3. Check firewall rules:
   ```bash
   ufw status
   ufw allow 80/tcp
   ufw allow 443/tcp
   ```

### Out of memory

```bash
# Add swap file
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Stripe webhooks not working

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://projectface.com/api/v1/subscription/webhook`
3. Select events: `customer.subscription.*`
4. Copy webhook secret to `.env`

---

## Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] All API keys configured
- [ ] Database backups automated
- [ ] Upload backups configured
- [ ] Monitoring/alerting setup
- [ ] Firewall configured (only 80, 443, 22)
- [ ] SSH key authentication enabled (disable password)
- [ ] Fail2ban installed for SSH protection
- [ ] Domain DNS correctly pointed
- [ ] Stripe webhooks configured
- [ ] Test user registration
- [ ] Test image upload and analysis
- [ ] Test payment flow
- [ ] Review logs for errors

---

## Maintenance

### Update Application

```bash
cd /path/to/project-face
git pull origin main
docker compose down
docker compose up -d --build
```

### Update Docker Images

```bash
docker compose pull
docker compose up -d
```

### Clean Up

```bash
# Remove old images
docker image prune -a

# Remove old volumes (CAREFUL!)
docker volume prune
```

---

## Support

For issues or questions:
- **GitHub Issues:** https://github.com/midnghtsapphire/project-face/issues
- **Email:** angelreporters@gmail.com
- **Hub:** https://rvvel.com

---

**Part of the GlowStarLabs / Audrey Evans ecosystem.**
