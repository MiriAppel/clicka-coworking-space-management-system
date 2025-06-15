import { VendorService } from './vendor.service';

export class VendorController {
  private service = new VendorService();

  getSummary(req: Request, res: Response) {
    const vendorId = req.params.vendorId;
    const summary = this.service.getVendorSummary(vendorId);
    res.json(summary);
  }

  saveVendor(req: Request, res: Response) {
    const input = req.body;
    const isUpdate = Boolean(input.id);
    const vendor = this.service.saveVendorProfile(input, isUpdate);
    saveVendorToDb(vendor); // או קריאה לפונקציה אחרת
    res.status(200).json(vendor);
  }

  getPaymentStats(req: Request, res: Response) {
    const vendorId = req.params.vendorId;
    const stats = this.service.getVendorPaymentHistory(vendorId);
    res.json(stats);
  }

  filterVendors(req: Request, res: Response) {
    const filters = req.query;
    const allVendors = getAllVendorsFromDb(); // פונקציה חיצונית שמחזירה את כל הספקים
    const filtered = this.service.filterVendors(allVendors, filters);
    res.json(filtered);
  }
}

