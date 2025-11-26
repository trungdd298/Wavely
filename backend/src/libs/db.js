import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Connect to db successfully');
    } catch (error) {
        console.error('Failed to connect to db: ', error);
        process.exit();
    }
}
