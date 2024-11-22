#!/bin/bash

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js if not already installed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configure PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE voting_dashboard;"
sudo -u postgres psql -c "CREATE USER dashboard_user WITH PASSWORD 'your-secure-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voting_dashboard TO dashboard_user;"

# Install PM2 globally
sudo npm install -y pm2 -g

# Install project dependencies
npm install

# Build the frontend
npm run build

# Run database migrations
npm run migrate

# Start the application with PM2
pm2 start ecosystem.config.cjs

# Save PM2 process list and configure to start on system boot
pm2 save
pm2 startup

# Install and configure Nginx
sudo apt install -y nginx
sudo cp nginx.conf /etc/nginx/sites-available/dashboard.ersecretballot.in
sudo ln -s /etc/nginx/sites-available/dashboard.ersecretballot.in /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Install SSL certificate using Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d dashboard.ersecretballot.in --non-interactive --agree-tos --email your-email@example.com

# Restart Nginx
sudo systemctl restart nginx

echo "Deployment completed successfully!"