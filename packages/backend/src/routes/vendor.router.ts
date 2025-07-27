
import { Router } from 'express';
import {
  createVendorController,
  deleteVendorController,
  getVendorByIdController,
  getVendorController
} from '../controllers/vendor.controller';
const vendorRouter = Router();

vendorRouter.post("/", createVendorController );
vendorRouter.get("/", getVendorController);
vendorRouter.get("/:id", getVendorByIdController );
vendorRouter.delete("/:id", deleteVendorController );

 export default vendorRouter;