# PostgreSQL Test Environment

This directory contains Docker Compose configuration for running PostgreSQL in a test environment.

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Port 5432 available (or modify the port mapping in docker-compose.yml)

### Starting PostgreSQL

```bash
# Navigate to the test directory
cd src/modules/database/postgreSQL/test

# Start PostgreSQL container
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs postgres
```

### Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: test_db
- **Username**: postgres
- **Password**: password123

### Connecting to PostgreSQL

```bash
# Using psql from host (if installed)
psql -h localhost -p 5432 -U postgres -d test_db

# Using Docker exec
docker-compose exec postgres psql -U postgres -d test_db

# Using Docker run (one-time connection)
docker run -it --rm --network test_postgres_network postgres:latest psql -h postgres -U postgres -d test_db
```

### Environment Variables

You can customize the database configuration by modifying the environment variables in `docker-compose.yml`:

- `POSTGRES_DB`: Database name (default: test_db)
- `POSTGRES_USER`: Username (default: postgres)
- `POSTGRES_PASSWORD`: Password (default: password123)

### Initialization Scripts

SQL scripts placed in the `init/` directory will be automatically executed when the container starts for the first time. The included `init.sql` creates:

- A sample `users` table
- Sample data for testing
- Appropriate indexes
- Necessary permissions

### Stopping and Cleaning Up

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Remove everything including networks
docker-compose down -v --remove-orphans
```

### Health Check

The PostgreSQL container includes a health check that verifies the database is ready to accept connections. You can check the health status:

```bash
docker-compose ps
# Look for "healthy" status
```

### Troubleshooting

1. **Port already in use**: Change the port mapping in docker-compose.yml from `5432:5432` to `5433:5432`
2. **Permission issues**: Ensure Docker has proper permissions to create volumes
3. **Connection refused**: Wait for the health check to show "healthy" status

### Running Tests

After starting PostgreSQL, you can run your tests:

```bash
# From the project root
npm test

# Or run specific PostgreSQL tests
node src/modules/database/postgreSQL/test/postgresql.test.js
```