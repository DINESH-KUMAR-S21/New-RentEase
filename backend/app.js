import express from 'express';
import products from './Routes/ProductRoute.js';
import user from './Routes/userRoutes.js';
import errorHandleMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import order from './Routes/orderRoutes.js';
import cart from './Routes/cartRoutes.js';
import rental from './Routes/rentalRoutes.js';
import vendor from './Routes/vendorRoutes.js';
import maintenance from './Routes/maintenanceRoutes.js';



const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order); 
app.use("/api/v1", cart);
app.use("/api/v1", rental);
app.use("/api/v1", vendor);
app.use("/api/v1", maintenance);

app.use(errorHandleMiddleware);

export default app;