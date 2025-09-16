# MongoDB Test Environment

This directory contains the MongoDB test environment setup using Docker Compose with Bitnami MongoDB image.

## Quick Start

1. **Start the MongoDB test environment:**
   ```bash
   docker-compose up -d
   ```

2. **Check container status:**
   ```bash
   docker-compose ps
   ```

3. **Run tests:**
   ```bash
   node mongodb.test.js
   ```

4. **Stop the environment:**
   ```bash
   docker-compose down
   ```

## Connection Details

- **Host:** localhost
- **Port:** 27017
- **Database:** testdb
- **Username:** testuser
- **Password:** testpass
- **Root Username:** testuser
- **Root Password:** testpass

## Environment Variables

The following environment variables are configured for Bitnami MongoDB:

- `MONGODB_ROOT_USER=testuser`
- `MONGODB_ROOT_PASSWORD=testpass`
- `MONGODB_DATABASE=testdb`
- `MONGODB_USERNAME=testuser`
- `MONGODB_PASSWORD=testpass`

## Container Features

- **Auto-restart**: Container restarts automatically unless stopped
- **Health Check**: Built-in health monitoring
- **Data Persistence**: Data is stored in Docker volume `mongodb_test_data`
- **Initialization**: Database is automatically initialized with sample data

## Initialization Script

The `init/init.js` script:
- Creates a test database user
- Creates users collection
- Inserts sample data
- Creates indexes for performance

## Troubleshooting

### Container won't start
```bash
docker-compose logs mongodb_test
```

### Reset database
```bash
docker-compose down -v
docker-compose up -d
```

### Connect to MongoDB shell
```bash
docker exec -it mongodb_test mongosh -u admin -p admin123 --authenticationDatabase admin
```

### Check database contents
```javascript
use test_db
db.users.find().pretty()
```