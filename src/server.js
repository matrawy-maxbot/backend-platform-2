import app from './app.js';
import { SERVER_HOST, SERVER_PORT, NODE_ENV } from './config/server.config.js';
import { createServer } from 'http';

// إنشاء HTTP server
const server = createServer(app);

// متغيرات للتحكم في إيقاف الخادم بشكل آمن
let isShuttingDown = false;
const connections = new Set();

// تتبع الاتصالات النشطة
server.on('connection', (connection) => {
    connections.add(connection);
    
    connection.on('close', () => {
        connections.delete(connection);
    });
});

// دالة لإيقاف الخادم بشكل آمن
const gracefulShutdown = (signal) => {
    console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
    
    if (isShuttingDown) {
        console.log('⚠️  Shutdown already in progress...');
        return;
    }
    
    isShuttingDown = true;
    
    // إيقاف قبول اتصالات جديدة
    server.close((err) => {
        if (err) {
            console.error('❌ Error during server shutdown:', err);
            process.exit(1);
        }
        
        console.log('✅ HTTP server closed successfully');
        
        // إغلاق جميع الاتصالات النشطة
        for (const connection of connections) {
            connection.destroy();
        }
        
        console.log('✅ All connections closed');
        console.log('👋 Graceful shutdown completed');
        process.exit(0);
    });
    
    // إجبار الإغلاق بعد 30 ثانية
    setTimeout(() => {
        console.error('⚠️  Forced shutdown after 30 seconds');
        process.exit(1);
    }, 30000);
};

// معالجة إشارات النظام للإيقاف الآمن
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// معالجة الأخطاء غير المتوقعة
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
});

// دالة لبدء تشغيل الخادم
const startServer = async () => {
    try {
        // هنا يمكن إضافة اتصالات قاعدة البيانات والخدمات الأخرى
        // await connectToDatabase();
        // await connectToRedis();
        // await initializeServices();
        
        // بدء تشغيل الخادم
        server.listen(SERVER_PORT, SERVER_HOST, () => {
            console.log('🚀 ================================');
            console.log(`🌟 Server is running successfully!`);
            console.log(`📍 Environment: ${NODE_ENV}`);
            console.log(`🌐 Host: ${SERVER_HOST}`);
            console.log(`🔌 Port: ${SERVER_PORT}`);
            console.log(`🔗 URL: http://${SERVER_HOST}:${SERVER_PORT}`);
            console.log(`💚 Health Check: http://${SERVER_HOST}:${SERVER_PORT}/health`);
            console.log('🚀 ================================');
            
            // في بيئة التطوير، عرض معلومات إضافية
            if (NODE_ENV === 'development') {
                console.log('🔧 Development Mode Features:');
                console.log('   📝 Request logging enabled');
                console.log('   🐛 Detailed error messages');
                console.log('   ⚡ Hot reload ready');
                console.log('🚀 ================================');
            }
        });
        
        // معالجة أخطاء الخادم
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${SERVER_PORT} is already in use`);
                console.log('💡 Try using a different port or stop the process using this port');
            } else if (error.code === 'EACCES') {
                console.error(`❌ Permission denied to bind to port ${SERVER_PORT}`);
                console.log('💡 Try using a port number greater than 1024 or run with elevated privileges');
            } else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });
        
    } catch (error) {
        console.error('💥 Failed to start server:', error);
        process.exit(1);
    }
};

// بدء تشغيل الخادم
startServer();

// تصدير الخادم للاستخدام في الاختبارات
export default server;