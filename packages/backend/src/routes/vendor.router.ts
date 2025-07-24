
import { Router } from 'express';
import {
  createVendorController,
  deleteVendorController,
  getVendorByIdController,
  getVendorController,
  uploadVendorDocument
} from '../controllers/vendor.controller';
import multer from 'multer';
const vendorRouter = Router();
const upload = multer();

// vendorRouter.post('/vendors/upload-document', upload.single('file'), handleUploadDocument);
vendorRouter.post("/", createVendorController );
vendorRouter.get("/", getVendorController );
vendorRouter.get("/:id", getVendorByIdController );
vendorRouter.delete("/:id", deleteVendorController );
vendorRouter.post('/:id/documents', uploadVendorDocument);



 export default vendorRouter;