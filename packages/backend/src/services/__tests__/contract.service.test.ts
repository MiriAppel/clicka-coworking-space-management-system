import { contractService } from '../contract.service';
import { ContractStatus } from 'shared-types';

// Mock supabase
jest.mock('../../db/supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  }
}));

jest.mock('crypto', () => ({
  randomUUID: () => 'test-uuid-123'
}));

describe('contractService', () => {
  let service: contractService;

  beforeEach(() => {
    service = new contractService();
    jest.clearAllMocks();
  });

  describe('createOrUpdateContractWithDocument', () => {
    test('should create new contract when none exists', async () => {
      const customerId = 'customer-123';
      const documentId = 'doc-456';

      // Mock getAllContractsByCustomerId to return empty array
      jest.spyOn(service, 'getAllContractsByCustomerId').mockResolvedValue([]);
      
      // Mock post method
      const mockPost = jest.spyOn(service, 'post').mockResolvedValue({} as any);

      await service.createOrUpdateContractWithDocument(customerId, documentId);

      expect(mockPost).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId,
          documents: [documentId],
          status: ContractStatus.DRAFT
        })
      );
    });

    test('should update existing contract with document', async () => {
      const customerId = 'customer-123';
      const documentId = 'doc-456';
      const existingContract = {
        id: 'contract-789',
        customerId,
        documents: ['existing-doc-1']
      };

      // Mock getAllContractsByCustomerId to return existing contract
      jest.spyOn(service, 'getAllContractsByCustomerId').mockResolvedValue([existingContract] as any);
      
      // Mock patch method
      const mockPatch = jest.spyOn(service, 'patch').mockResolvedValue({} as any);

      await service.createOrUpdateContractWithDocument(customerId, documentId);

      expect(mockPatch).toHaveBeenCalledWith(
        { documents: ['existing-doc-1', documentId] },
        existingContract.id
      );
    });
  });

  describe('updateContractWithDocument', () => {
    test('should add document to existing contract', async () => {
      const contractId = 'contract-123';
      const documentId = 'doc-456';
      const existingContract = {
        id: contractId,
        documents: ['doc-1', 'doc-2']
      };

      // Mock getById
      jest.spyOn(service, 'getById').mockResolvedValue(existingContract as any);
      
      // Mock patch
      const mockPatch = jest.spyOn(service, 'patch').mockResolvedValue({} as any);

      await service.updateContractWithDocument(contractId, documentId);

      expect(mockPatch).toHaveBeenCalledWith(
        { documents: ['doc-1', 'doc-2', documentId] },
        contractId
      );
    });
  });

  describe('deleteContractDocument', () => {
    test('should remove document from contract', async () => {
      const contractId = 'contract-123';
      const documentId = 'doc-2';
      const existingContract = {
        id: contractId,
        documents: ['doc-1', 'doc-2', 'doc-3']
      };

      // Mock getById
      jest.spyOn(service, 'getById').mockResolvedValue(existingContract as any);
      
      // Mock patch
      const mockPatch = jest.spyOn(service, 'patch').mockResolvedValue({} as any);

      await service.deleteContractDocument(contractId, documentId);

      expect(mockPatch).toHaveBeenCalledWith(
        { documents: ['doc-1', 'doc-3'] },
        contractId
      );
    });
  });
});