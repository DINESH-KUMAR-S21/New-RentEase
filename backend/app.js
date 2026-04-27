import express from 'express';
import products from './Routes/ProductRoute.js';
import user from './Routes/userRoutes.js';
import errorHandleMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import order from './Routes/orderRoutes.js';




const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order); 

app.use(errorHandleMiddleware);
export default app;