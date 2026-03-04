# GramaRaksha AI - Deployment Guide 🚀

Complete deployment guide for GramaRaksha AI healthcare platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment](#backend-deployment)
   - [Heroku](#heroku-deployment)
   - [AWS EC2](#aws-ec2-deployment)
   - [DigitalOcean](#digitalocean-deployment)
4. [Frontend Deployment](#frontend-deployment)
   - [Vercel](#vercel-deployment)
   - [Netlify](#netlify-deployment)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

- Git installed
- Node.js 18+ installed
- MongoDB Atlas account
- Cloud provider account (Heroku/AWS/DigitalOcean)
- Domain name (optional)

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account

Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.

### 2. Create New Cluster

1. Click "Build a Cluster"
2. Choose **FREE** tier (M0)
3. Select region closest to your users
4. Name your cluster: `gramaraksha-cluster`

### 3. Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - For production, restrict to your server IPs

### 4. Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Authentication Method: **Password**
4. Username: `gramaraksha_admin`
5. Password: Generate strong password
6. Database User Privileges: **Read and write to any database**

### 5. Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string:
```
mongodb+srv://gramaraksha_admin:<password>@gramaraksha-cluster.xxxxx.mongodb.net/gramaraksha?retryWrites=true&w=majority
```
4. Replace `<password>` with your actual password

---

## Backend Deployment

### Heroku Deployment

#### 1. Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Login to Heroku

```bash
heroku login
```

#### 3. Prepare Backend

```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Ensure start script in package.json
# "start": "node server.js"
```

#### 4. Create Heroku App

```bash
heroku create gramaraksha-api

# Or use specific region
heroku create gramaraksha-api --region us
```

#### 5. Set Environment Variables

```bash
heroku config:set PORT=5000
heroku config:set MONGODB_URI="mongodb+srv://gramaraksha_admin:yourpassword@cluster.mongodb.net/gramaraksha"
heroku config:set JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
heroku config:set FRONTEND_URL="https://your-frontend-domain.com"
heroku config:set NODE_ENV=production
```

#### 6. Deploy

```bash
# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Add Heroku remote
heroku git:remote -a gramaraksha-api

# Deploy
git push heroku main
```

#### 7. Verify Deployment

```bash
heroku logs --tail
heroku open
```

Visit: `https://gramaraksha-api.herokuapp.com/health`

---

### AWS EC2 Deployment

#### 1. Launch EC2 Instance

1. Login to [AWS Console](https://aws.amazon.com/console/)
2. Navigate to **EC2** → **Launch Instance**
3. Choose **Ubuntu Server 22.04 LTS**
4. Instance type: **t2.micro** (Free tier eligible)
5. Create new key pair: `gramaraksha-key.pem`
6. Security Group rules:
   - SSH (22) from My IP
   - HTTP (80) from Anywhere
   - HTTPS (443) from Anywhere
   - Custom TCP (5000) from Anywhere

#### 2. Connect to EC2

```bash
chmod 400 gramaraksha-key.pem
ssh -i "gramaraksha-key.pem" ubuntu@<your-ec2-public-ip>
```

#### 3. Install Node.js & MongoDB Tools

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

#### 4. Clone & Setup Application

```bash
# Clone repository
git clone https://github.com/yourusername/gramaraksha-ai.git
cd gramaraksha-ai/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
```

Add environment variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://gramaraksha_admin:password@cluster.mongodb.net/gramaraksha
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

#### 5. Start with PM2

```bash
# Start application
pm2 start server.js --name gramaraksha-api

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs gramaraksha-api
```

#### 6. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/gramaraksha
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/gramaraksha /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

### DigitalOcean Deployment

#### 1. Create Droplet

1. Login to [DigitalOcean](https://www.digitalocean.com/)
2. Create → Droplets
3. Choose: **Ubuntu 22.04 LTS**
4. Plan: **Basic** ($6/month or $4/month)
5. Add SSH key
6. Choose datacenter region
7. Hostname: `gramaraksha-api`

#### 2. Follow AWS EC2 steps 2-7

The deployment process is identical to AWS EC2 from step 2 onwards.

---

## Frontend Deployment

### Vercel Deployment

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Prepare Frontend

```bash
cd frontend

# Update .env for production
echo "REACT_APP_API_URL=https://your-backend-api.com/api" > .env.production

# Test build
npm run build
```

#### 3. Deploy to Vercel

```bash
# Login
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Project name: gramaraksha-ai
# - Framework: Create React App
# - Build command: npm run build
# - Output directory: build
```

#### 4. Set Environment Variables (Vercel Dashboard)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `REACT_APP_API_URL`: `https://your-backend-api.com/api`

#### 5. Redeploy

```bash
vercel --prod
```

---

### Netlify Deployment

#### 1. Build Frontend

```bash
cd frontend
npm run build
```

#### 2. Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Follow prompts:
# - Choose "Create & configure a new site"
# - Site name: gramaraksha-ai
# - Publish directory: build
```

#### 3. Set Environment Variables

```bash
netlify env:set REACT_APP_API_URL "https://your-backend-api.com/api"
```

#### 4. Alternative: Git-based Deployment

1. Push code to GitHub
2. Login to [Netlify](https://netlify.com)
3. New site from Git
4. Connect GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Add environment variables
7. Deploy

---

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Security
JWT_SECRET=your-super-secret-key-min-32-characters-long

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-backend-api.com/api
REACT_APP_NAME=GramaRaksha AI
```

---

## Post-Deployment

### 1. Seed Database

```bash
# On your server or locally pointing to production DB
cd backend
npm run seed
```

### 2. Test Endpoints

```bash
# Health check
curl https://your-api-domain.com/health

# Test login
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999901"}'
```

### 3. Test Frontend

Visit `https://your-frontend-domain.com`
- Test symptom checker
- Test chatbot
- Test image upload
- Test all language switches

### 4. Setup Monitoring

#### Backend Monitoring (PM2)

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# View metrics
pm2 monit
```

#### Application Monitoring

**Option 1: New Relic**
```bash
npm install newrelic
# Follow New Relic setup instructions
```

**Option 2: Sentry**
```bash
npm install @sentry/node
# Add to server.js
```

### 5. Setup Backups

#### MongoDB Atlas Backups

1. Go to MongoDB Atlas cluster
2. Click **Backup**
3. Enable **Continuous Backup**
4. Configure backup schedule

#### Server Backups (for EC2/DigitalOcean)

```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
# Backup application files
tar -czf ~/backups/gramaraksha-$(date +%Y%m%d).tar.gz ~/gramaraksha-ai

# Keep only last 7 backups
cd ~/backups && ls -t | tail -n +8 | xargs rm -f
```

```bash
chmod +x ~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * ~/backup.sh
```

---

## Monitoring & Maintenance

### Performance Monitoring

```bash
# CPU & Memory usage
pm2 monit

# Application logs
pm2 logs gramaraksha-api

# Error logs only
pm2 logs gramaraksha-api --err

# System resources
htop
```

### Log Management

```bash
# View logs
pm2 logs

# Clear logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
```

### Update Deployment

```bash
# Pull latest code
cd ~/gramaraksha-ai/backend
git pull origin main

# Install dependencies
npm install --production

# Restart application
pm2 restart gramaraksha-api

# Reload without downtime
pm2 reload gramaraksha-api
```

### SSL Certificate Renewal

```bash
# Auto-renewal is setup, but to manually renew:
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] MongoDB access restricted to server IPs
- [ ] Firewall configured (UFW or Security Groups)
- [ ] Regular security updates
- [ ] Strong JWT secret (32+ characters)
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] Backups automated

---

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs gramaraksha-api --lines 100

# Check environment variables
pm2 env 0

# Check port availability
sudo lsof -i :5000

# Restart
pm2 restart gramaraksha-api
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net/test" --username gramaraksha_admin

# Check network access in MongoDB Atlas
# Verify IP whitelisting
```

### Frontend Build Issues

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Build with verbose output
npm run build --verbose
```

---

## Support

For deployment issues:
- Email: support@gramaraksha.gov.in
- Documentation: https://docs.gramaraksha.gov.in

---

**Deployed Successfully! 🎉**

Visit your live application and start transforming rural healthcare!
