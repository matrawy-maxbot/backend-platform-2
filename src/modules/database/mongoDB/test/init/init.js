// MongoDB Test Database Initialization Script
// This script runs when the container starts for the first time

// Switch to the test database
db = db.getSiblingDB('testdb');

// Create a test user with read/write permissions
db.createUser({
  user: 'testuser',
  pwd: 'testpass',
  roles: [
    {
      role: 'readWrite',
      db: 'testdb'
    }
  ]
});

// Create users collection with some sample data
db.createCollection('users');

// Insert sample users
db.users.insertMany([
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '$2a$10$example.hash.for.password',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: '$2a$10$example.hash.for.password',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

print('MongoDB test database initialized successfully!');
print('Database: test_db');
print('Collection: users');
print('Sample users created: 2');
print('Indexes created: email (unique), createdAt');