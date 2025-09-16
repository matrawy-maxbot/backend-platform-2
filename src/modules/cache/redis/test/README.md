# Redis Test Environment

This directory contains the Redis test environment setup using Docker Compose with Bitnami Redis image and RedisInsight for management.

## Quick Start

1. **Start the Redis test environment:**
   ```bash
   docker-compose up -d
   ```

2. **Check container status:**
   ```bash
   docker-compose ps
   ```

3. **Access RedisInsight:**
   - Open browser: http://localhost:5540
   - Add Redis connection with:
     - Host: `redis_test_container`
     - Port: `6379`
     - Password: `testpass`
     - Database: `0`

4. **Run tests:**
   ```bash
   node redis.test.js
   ```

5. **Stop the environment:**
   ```bash
   docker-compose down
   ```

## Connection Details

- **Host:** localhost
- **Port:** 6379
- **Password:** testpass
- **Database:** 0

## Environment Variables

The following environment variables are configured for Bitnami Redis:

- `REDIS_PASSWORD=testpass`
- `REDIS_DATABASE=0`

## Container Features

- **Image:** `bitnami/redis:7.4` - Security-focused Redis image
- **Health Check:** Automatic health monitoring with redis-cli ping
- **Persistent Storage:** Data persisted in `redis_test_data` volume
- **Network Isolation:** Runs in dedicated `redis_test_network`
- **Non-root User:** Enhanced security with non-root container execution

## RedisInsight Management Interface

### Features:
- **Visual Redis Browser:** Browse keys, view data structures
- **Query Interface:** Execute Redis commands with syntax highlighting
- **Performance Monitoring:** Real-time metrics and memory usage
- **Data Visualization:** Charts and graphs for Redis statistics
- **Bulk Operations:** Import/export data, bulk key operations

### Connection Setup:
1. Open http://localhost:5540 in your browser
2. Click "Add Redis Database"
3. Use these connection details:
   ```
   Host: redis_test_container
   Port: 6379
   Password: testpass
   Database Index: 0
   ```
4. Click "Add Redis Database" to connect

### Alternative Connection Methods:
If container name doesn't work, try:
- **Host:** `172.22.0.2` (Redis container IP)
- **Host:** `localhost` (if accessing from host machine)

## Redis CLI Access

To access Redis CLI inside the container:
```bash
docker exec -it redis_test_container redis-cli -a testpass
```

## Troubleshooting

### Container won't start
- Check if port 6379 is already in use: `netstat -an | findstr 6379`
- View container logs: `docker-compose logs redis_test`

### Connection issues
- Verify container is running: `docker-compose ps`
- Check health status: `docker-compose ps` (should show "healthy")
- Test connection: `docker exec redis_test_container redis-cli -a testpass ping`

### Performance issues
- Monitor Redis stats: `docker exec redis_test_container redis-cli -a testpass info stats`
- Check memory usage: `docker exec redis_test_container redis-cli -a testpass info memory`