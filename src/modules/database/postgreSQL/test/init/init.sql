-- PostgreSQL Test Database Initialization Script
-- This script will be executed when the container starts for the first time

-- Create test database if it doesn't exist
CREATE DATABASE IF NOT EXISTS test_db;

-- Connect to test database
\c test_db;

-- Create a sample table for testing
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES 
    ('Test User 1', 'test1@example.com'),
    ('Test User 2', 'test2@example.com')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE test_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Display success message
SELECT 'PostgreSQL test database initialized successfully!' as message;