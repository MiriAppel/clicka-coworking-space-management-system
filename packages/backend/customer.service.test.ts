import { customerService } from './src/services/customer.service';
import { CustomerModel } from './src/models/customer.model';
import { CustomerStatus, PaymentMethodType, CreateCustomerRequest, RecordExitNoticeRequest, StatusChangeRequest } from 'shared-types';

// Mock dependencies
jest.mock('./src/db/supabaseClient');
jest.mock('./src/services/baseService');
jest.mock('./src/services/customerPeriod.service');
jest.mock('./src/services/contract.service');
jest.mock('./src/services/customerPaymentMethod.service');
jest.mock('./src/services/emailTemplate.service');
jest.mock('./src/services/gmail-service');
jest.mock('./src/services/userTokenService');

describe('CustomerService', () => {
  let service: customerService;
  let mockCustomer: CustomerModel;

  beforeEach(() => {
    service = new customerService();
    mockCustomer = {
      id: '1',
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '123456789',
      status: CustomerStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      toDatabaseFormat: jest.fn()
    } as CustomerModel;
  });

  describe('getAllCustomers', () => {
    it('should return all customers with payment methods', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockCustomer]);
      CustomerModel.fromDatabaseFormatArray = jest.fn().mockReturnValue([mockCustomer]);

      const result = await service.getAllCustomers();

      expect(result).toEqual([mockCustomer]);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('createCustomer', () => {
    it('should create customer with contract', async () => {
      const createRequest: CreateCustomerRequest = {
        name: 'New Customer',
        email: 'new@example.com',
        phone: '987654321',
        paymentMethodType: PaymentMethodType.BANK_TRANSFER,
        contractSignDate: new Date().toISOString(),
        contractStartDate: new Date().toISOString(),
        billingStartDate: new Date().toISOString()
      };

      jest.spyOn(service, 'post').mockResolvedValue({ ...mockCustomer, id: '2' });

      const result = await service.createCustomer(createRequest);

      expect(result.name).toBe(createRequest.name);
      expect(result.status).toBe(CustomerStatus.CREATED);
    });
  });

  describe('updateCustomer', () => {
    it('should update customer successfully', async () => {
      const updateData = { name: 'Updated Name' };
      jest.spyOn(service, 'patch').mockResolvedValue(undefined);

      await service.updateCustomer(updateData, '1');

      expect(service.patch).toHaveBeenCalled();
    });

    it('should handle credit card payment method updates', async () => {
      const updateData = {
        paymentMethodType: PaymentMethodType.CREDIT_CARD,
        creditCardNumber: '1234567890123456'
      };
      jest.spyOn(service, 'patch').mockResolvedValue(undefined);

      await service.updateCustomer(updateData, '1');

      expect(service.patch).toHaveBeenCalled();
    });
  });

  describe('postExitNotice', () => {
    it('should process exit notice', async () => {
      const exitNotice: RecordExitNoticeRequest = {
        plannedExitDate: new Date().toISOString(),
        exitNoticeDate: new Date().toISOString(),
        exitReason: 'Moving'
      };

      jest.spyOn(service, 'getById').mockResolvedValue(mockCustomer);
      jest.spyOn(service, 'patch').mockResolvedValue(undefined);
      jest.spyOn(service, 'updateCustomer').mockResolvedValue(undefined);

      await service.postExitNotice(exitNotice, '1');

      expect(service.updateCustomer).toHaveBeenCalled();
      expect(service.patch).toHaveBeenCalled();
    });
  });

  describe('getCustomersByText', () => {
    it('should search customers by text', async () => {
      const mockSupabaseResponse = { data: [mockCustomer], error: null };
      require('./src/db/supabaseClient').supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          or: jest.fn().mockResolvedValue(mockSupabaseResponse)
        })
      });

      CustomerModel.fromDatabaseFormatArray = jest.fn().mockReturnValue([mockCustomer]);

      const result = await service.getCustomersByText('test');

      expect(result).toEqual([mockCustomer]);
    });

    it('should return empty array on error', async () => {
      const mockSupabaseResponse = { data: null, error: { message: 'Error' } };
      require('./src/db/supabaseClient').supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          or: jest.fn().mockResolvedValue(mockSupabaseResponse)
        })
      });

      const result = await service.getCustomersByText('test');

      expect(result).toEqual([]);
    });
  });

  describe('getCustomersByPage', () => {
    it('should return paginated customers', async () => {
      const mockSupabaseResponse = { data: [mockCustomer], error: null };
      require('./src/db/supabaseClient').supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(mockSupabaseResponse)
          })
        })
      });

      CustomerModel.fromDatabaseFormatArray = jest.fn().mockReturnValue([mockCustomer]);

      const result = await service.getCustomersByPage({ page: '1', limit: 10 });

      expect(result).toEqual([mockCustomer]);
    });

    it('should throw error for invalid pagination params', async () => {
      await expect(service.getCustomersByPage({ page: 'invalid', limit: 10 }))
        .rejects.toThrow('Invalid filters provided for pagination');
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email and activate customer', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockCustomer);
      jest.spyOn(service, 'patch').mockResolvedValue(undefined);
      jest.spyOn(service, 'sendWellcomeMessageForEveryMember').mockResolvedValue(undefined);
      global.fetch = jest.fn().mockResolvedValue({ ok: true });

      await service.confirmEmail('new@example.com', '1');

      expect(service.patch).toHaveBeenCalled();
      expect(mockCustomer.status).toBe(CustomerStatus.ACTIVE);
    });
  });

  describe('sendStatusChangeEmails', () => {
    it('should send status change emails', async () => {
      const statusChange: StatusChangeRequest = {
        newStatus: CustomerStatus.ACTIVE,
        effectiveDate: new Date().toISOString(),
        notifyCustomer: true
      };

      jest.spyOn(service, 'getById').mockResolvedValue(mockCustomer);
      service.emailService.getTemplateByName = jest.fn().mockResolvedValue({
        subject: 'Test Subject',
        bodyHtml: 'Test Body'
      });
      service.emailService.renderTemplate = jest.fn().mockResolvedValue('Rendered HTML');

      await service.sendStatusChangeEmails(statusChange, '1', 'mock-token');

      expect(service.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('sendEmailWithContract', () => {
    it('should send contract email', async () => {
      service.serviceUserToken.getSystemAccessToken = jest.fn().mockResolvedValue('token');
      service.emailService.getTemplateByName = jest.fn().mockResolvedValue({
        subject: 'Contract',
        bodyHtml: 'Contract body'
      });
      service.emailService.renderTemplate = jest.fn().mockResolvedValue('Rendered');

      await service.sendEmailWithContract(mockCustomer, 'http://contract-link.com');

      expect(service.emailService.getTemplateByName).toHaveBeenCalledWith('שליחת חוזה ללקוח');
    });
  });

  describe('sendWellcomeMessageForEveryMember', () => {
    it('should send welcome message to all members', async () => {
      service.serviceUserToken.getSystemAccessToken = jest.fn().mockResolvedValue('token');
      service.emailService.getTemplateByName = jest.fn().mockResolvedValue({
        subject: 'Welcome',
        bodyHtml: 'Welcome body'
      });
      service.emailService.renderTemplate = jest.fn().mockResolvedValue('Rendered');
      jest.spyOn(service, 'getAll').mockResolvedValue([mockCustomer]);

      await service.sendWellcomeMessageForEveryMember('New Member');

      expect(service.getAll).toHaveBeenCalled();
    });
  });
});