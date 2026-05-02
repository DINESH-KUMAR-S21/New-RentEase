import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config({ path: './backend/config/config.env' });
connectDB();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});