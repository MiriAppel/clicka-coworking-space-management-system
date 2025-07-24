import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentUpload from '../DocumentUpload';

// Mock stores
jest.mock('../../../../Stores/LeadAndCustomer/customerStore', () => ({
  useCustomerStore: () => ({
    customers: [
      { id: '1', name: 'לקוח 1', email: 'test1@example.com', phone: '123456789' },
      { id: '2', name: 'לקוח 2', email: 'test2@example.com', phone: '987654321' }
    ],
    fetchAllCustomers: jest.fn(),
    loading: false
  })
}));

jest.mock('../../../../Stores/LeadAndCustomer/contractsStore', () => ({
  useContractsStore: () => ({
    contracts: [
      { id: 'c1', customerId: '1', contractNumber: '001', status: 'ACTIVE' }
    ],
    fetchContractsByCustomerId: jest.fn()
  })
}));

jest.mock('../../../Common/Components/themeConfig', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#000',
        secondary: '#fff',
        neutral: ['#f5f5f5'],
        text: '#000',
        accent: '#666',
        semantic: { error: '#ff0000', success: '#00ff00' }
      },
      typography: { fontFamily: { hebrew: 'Arial' } },
      direction: 'rtl'
    }
  })
}));

describe('DocumentUpload Component', () => {
  test('renders document upload form', () => {
    render(<DocumentUpload />);
    
    expect(screen.getByText('העלאת מסמכים')).toBeInTheDocument();
    expect(screen.getByText('בחר לקוח וסוג מסמך להעלאה מאורגנת')).toBeInTheDocument();
  });

  test('displays customer and file type selection', () => {
    render(<DocumentUpload />);
    
    expect(screen.getByText(/בחר לקוח/)).toBeInTheDocument();
    expect(screen.getByText(/סוג מסמך/)).toBeInTheDocument();
  });

  test('shows message when no customer selected', () => {
    render(<DocumentUpload />);
    
    expect(screen.getByText('בחר לקוח להמשך')).toBeInTheDocument();
  });
});