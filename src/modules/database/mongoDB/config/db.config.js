import '../../../../config/index.js';
import mongoose from 'mongoose';
import { mongodb } from '../../../../config/database.config.js';
// import { User } from '../models/index.js';

const connectDB = async () => {
     try {
          await mongoose.connect(mongodb.uri, {
               // useNewUrlParser: true,
               // useUnifiedTopology: true
          });
          console.log('MongoDB connected successfully.');

          mongoose.connection.on('connected', () => {
               console.log('Mongoose connected to DB');
          });
             
          mongoose.connection.on('error', (err) => {
               console.error('Mongoose connection error:', err);
          });
             
          mongoose.connection.on('disconnected', () => {
               console.log('Mongoose disconnected from DB');
          });

     } catch (err) {
          console.error('MongoDB connection error:', err);
          //process.exit(1); // إغلاق التطبيق في حالة خطأ
     }
};

// // select 100000 example
// const selectExample = async () => {
//      try {

//           await connectDB();

//           const startTime = Date.now();

//           const result = await User.find({}).limit(1_000_000);

//           console.log("✅ done", (Date.now() - startTime) + "ms", result && result.length > 0 ? result[0] : result);


//      } catch (err) {
//           console.error('Error selecting data:', err);
//      }
// };

// selectExample();


export default connectDB;