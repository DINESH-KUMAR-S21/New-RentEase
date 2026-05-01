import express from 'express';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';
import {
    vendorCreateProduct,
    vendorGetProducts,
    vendorGetSingleProduct,
    vendorUpdateProduct,
    vendorDeleteProduct,
    vendorUpdateAvailability,
    getVendorDeliveries,
    getVendorPickups,
    confirmDelivery,
    getVendorMaintenanceRequests,
    vendorUpdateMaintenanceRequest,
    getVendorDashboard
} from '../controller/vendorController.js';

const router = express.Router();

// All vendor routes are protected
const vendorAuth = [verifyUserAuth, roleBasedAccess("vendor")];

// Dashboard
router.route("/vendor/dashboard").get(...vendorAuth, getVendorDashboard);

// Product management
router.route("/vendor/products").get(...vendorAuth, vendorGetProducts);
router.route("/vendor/product/create").post(...vendorAuth, vendorCreateProduct);
router.route("/vendor/product/:id")
    .get(...vendorAuth, vendorGetSingleProduct)
    .put(...vendorAuth, vendorUpdateProduct)
    .delete(...vendorAuth, vendorDeleteProduct);
router.route("/vendor/product/availability/:id")
    .put(...vendorAuth, vendorUpdateAvailability);

// Delivery & Pickup
router.route("/vendor/deliveries").get(...vendorAuth, getVendorDeliveries);
router.route("/vendor/pickups").get(...vendorAuth, getVendorPickups);
router.route("/vendor/delivery/confirm/:id").put(...vendorAuth, confirmDelivery);

// Maintenance requests
router.route("/vendor/maintenance").get(...vendorAuth, getVendorMaintenanceRequests);
router.route("/vendor/maintenance/:id").put(...vendorAuth, vendorUpdateMaintenanceRequest);

export default router;