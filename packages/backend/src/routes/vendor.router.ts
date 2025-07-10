
import { Router } from 'express';
import {
  createVendor,
  deleteVendorController,
  getVendorByIdController,
  getVendor
} from '../controllers/vendor.controller';
const vendorRouter = Router();

vendorRouter.post("/", createVendor );
vendorRouter.get("/", getVendor );
vendorRouter.get("/:id", getVendorByIdController );
vendorRouter.delete("/:id", deleteVendorController );


 export default vendorRouter;