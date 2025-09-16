// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

// Import PostgreSQL modules
import { sequelize, User, UserService } from '../index.js';
import { postgresql } from '../../../../config/database.config.js';

// Test PostgreSQL database connection
async function testPostgreSQLConnection() {
  console.log('🔄 Starting PostgreSQL database connection test...');
  
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL database connected successfully!');
    
    // Display connection information
    console.log(`📊 Connection Information:`);
    console.log(`   - Host: ${postgresql.host}`);
    console.log(`   - Port: ${postgresql.port}`);
    console.log(`   - Database: ${postgresql.database}`);
    console.log(`   - User: ${postgresql.user}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL database:', error.message);
    return false;
  }
}

// Test model synchronization
async function testModelSync() {
  console.log('\n🔄 Starting model synchronization test...');
  
  try {
    // Synchronize models with database
    await sequelize.sync({ force: false });
    console.log('✅ Models synchronized successfully!');
    
    // Check if user table exists
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Existing tables:', tableExists);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to synchronize models:', error.message);
    return false;
  }
}

// Test CRUD operations on User model
async function testUserCRUD() {
  console.log('\n🔄 Starting User CRUD operations test...');
  
  try {
    // Create new user
    const testUser = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    console.log('📝 Creating new user...');
    const createdUser = await UserService.createUser(testUser);
    console.log('✅ User created successfully:', {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email
    });
    
    // Read user
    console.log('📖 Reading user...');
    const foundUser = await UserService.getUserById(createdUser.id);
    console.log('✅ User found successfully:', {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email
    });
    
    // Update user
    console.log('✏️ Updating user...');
    const updatedUser = await UserService.updateUser(createdUser.id, {
      name: 'Updated Test User'
    });
    console.log('✅ User updated successfully:', {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email
    });
    
    // Delete user
    console.log('🗑️ Deleting user...');
    await UserService.deleteUser(createdUser.id);
    console.log('✅ User deleted successfully!');
    
    // Verify deletion
    const deletedUser = await UserService.getUserById(createdUser.id);
    if (!deletedUser) {
      console.log('✅ Confirmed: User not found after deletion');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed CRUD operations test:', error.message);
    return false;
  }
}

// Simple performance test
async function testPerformance() {
  console.log('\n🔄 Starting simple performance test...');
  
  try {
    const startTime = Date.now();
    
    // Create multiple users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await UserService.createUser({
        name: `User ${i + 1}`,
        email: `user${i + 1}_${Date.now()}@example.com`,
        password: 'password123'
      });
      users.push(user);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Created ${users.length} users in ${duration}ms`);
    console.log(`⚡ Average time per operation: ${(duration / users.length).toFixed(2)}ms`);
    
    // Clean up test data
    for (const user of users) {
      await UserService.deleteUser(user.id);
    }
    console.log('🧹 Test data cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive PostgreSQL tests\n');
  console.log('=' .repeat(50));
  
  const tests = [
    { name: 'Connection Test', fn: testPostgreSQLConnection },
    { name: 'Model Sync Test', fn: testModelSync },
    { name: 'CRUD Operations Test', fn: testUserCRUD },
    { name: 'Performance Test', fn: testPerformance }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    console.log(`\n📋 ${test.name}:`);
    console.log('-'.repeat(30));
    
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
        console.log(`✅ ${test.name} - Passed`);
      } else {
        console.log(`❌ ${test.name} - Failed`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
    }
  }
  
  // Final results
  console.log('\n' + '='.repeat(50));
  console.log('📊 Final Results:');
  console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed Tests: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! PostgreSQL is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }
  
  // Close connection
  try {
    await sequelize.close();
    console.log('\n🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing connection:', error.message);
  }
}

// Run tests if this file is executed directly
const isMainModule = import.meta.url === new URL(process.argv[1], 'file:').href;

if (isMainModule || process.argv[1]?.includes('postgresql.test.js')) {
  runAllTests().catch(console.error);
}

export {
  testPostgreSQLConnection,
  testModelSync,
  testUserCRUD,
  testPerformance,
  runAllTests
};