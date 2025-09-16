// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

// Import MongoDB modules
import mongoose from 'mongoose';
import { User, UserService } from '../index.js';
import { mongodb } from '../../../../config/database.config.js';

// Test MongoDB database connection
async function testMongoDBConnection() {
  console.log('🔄 Starting MongoDB database connection test...');
  
  try {
    // Test connection with bitnami/mongodb configuration
    const testUri = mongodb.uri;
    await mongoose.connect(testUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB database connected successfully!');
    
    // Display connection information
    console.log(`📊 Connection Information:`);
    console.log(`   - URI: ${testUri}`);
    console.log(`   - Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   - Ready State: ${mongoose.connection.readyState}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB database:', error.message);
    return false;
  }
}

// Test collection operations
async function testCollectionOperations() {
  console.log('\n🔄 Starting collection operations test...');
  
  try {
    // Check if users collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log('📋 Existing collections:', collectionNames);
    
    // Get users collection stats
    if (collectionNames.includes('users')) {
      const usersCollection = mongoose.connection.db.collection('users');
      const documentCount = await usersCollection.countDocuments();
      console.log('📊 Users collection stats:');
      console.log(`   - Document count: ${documentCount}`);
      
      // Get a sample document to estimate size
      const sampleDoc = await usersCollection.findOne();
      if (sampleDoc) {
        const docSize = JSON.stringify(sampleDoc).length;
        console.log(`   - Sample document size: ~${docSize} bytes`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to test collection operations:', error.message);
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
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email
    });
    
    // Read user
    console.log('📖 Reading user...');
    const foundUser = await UserService.getUserById(createdUser._id);
    console.log('✅ User found successfully:', {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email
    });
    
    // Update user
    console.log('✏️ Updating user...');
    const updatedUser = await UserService.updateUser(createdUser._id, {
      name: 'Updated Test User'
    });
    console.log('✅ User updated successfully:', {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
    
    // Delete user
    console.log('🗑️ Deleting user...');
    await UserService.deleteUser(createdUser._id);
    console.log('✅ User deleted successfully!');
    
    // Verify deletion
    const deletedUser = await UserService.getUserById(createdUser._id);
    if (!deletedUser) {
      console.log('✅ Confirmed: User not found after deletion');
    } else {
      throw new Error('User still exists after deletion');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed CRUD operations test:', error.message);
    return false;
  }
}

// Test performance with multiple operations
async function testPerformance() {
  console.log('\n🔄 Starting simple performance test...');
  
  try {
    const startTime = Date.now();
    const testUsers = [];
    
    // Create multiple users
    for (let i = 0; i < 5; i++) {
      const user = await UserService.createUser({
        name: `Performance Test User ${i + 1}`,
        email: `perf_test_${Date.now()}_${i}@example.com`,
        password: 'testpassword123'
      });
      testUsers.push(user);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Created ${testUsers.length} users in ${duration}ms`);
    console.log(`⚡ Average time per operation: ${(duration / testUsers.length).toFixed(2)}ms`);
    
    // Clean up test data
    for (const user of testUsers) {
      await UserService.deleteUser(user._id);
    }
    console.log('🧹 Test data cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ Failed performance test:', error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting MongoDB comprehensive tests...');
  console.log('=' .repeat(50));
  
  const tests = [
    { name: 'Connection Test', func: testMongoDBConnection },
    { name: 'Collection Operations Test', func: testCollectionOperations },
    { name: 'CRUD Operations Test', func: testUserCRUD },
    { name: 'Performance Test', func: testPerformance }
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const test of tests) {
    console.log(`\n📋 ${test.name}:`);
    console.log('-'.repeat(30));
    
    try {
      const result = await test.func();
      if (result) {
        console.log(`✅ ${test.name} - Passed`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name} - Failed`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Failed with error:`, error.message);
      failedTests++;
    }
  }
  
  const totalTests = passedTests + failedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Final Results:');
  console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed Tests: ${failedTests}/${totalTests}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! MongoDB is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }
  
  // Close database connection
  try {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
}

// Run tests if this file is executed directly
const isMainModule = import.meta.url === new URL(process.argv[1], 'file:').href;

if (isMainModule || process.argv[1]?.includes('mongodb.test.js')) {
  runAllTests().catch(console.error);
}

export {
  testMongoDBConnection,
  testCollectionOperations,
  testUserCRUD,
  testPerformance,
  runAllTests
};