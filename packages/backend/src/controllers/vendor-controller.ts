import { VendorService } from './vendor.service';

export class Vendor_controller {
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
  create(req: Request, res: Response) {
    const data = req.body;
    this.service.create(data)
      .then(vendor => res.status(201).json(vendor))
      .catch(err => res.status(500).json({ error: err.message }));
  }

  getAll(req: Request, res: Response) {
    this.service.findAll()
      .then(vendors => res.json(vendors))
      .catch(err => res.status(500).json({ error: err.message }));
  }

  getById(req: Request, res: Response) {
    const id = req.params.id;
    this.service.findOne(id)
      .then(vendor => {
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  }

  update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    this.service.update(id, data)
      .then(vendor => res.json(vendor))
      .catch(err => res.status(500).json({ error: err.message }));
  }

  delete(req: Request, res: Response) {
    const id = req.params.id;
    this.service.delete(id)
      .then(() => res.status(204).send())
      .catch(err => res.status(500).json({ error: err.message }));
  }
}

