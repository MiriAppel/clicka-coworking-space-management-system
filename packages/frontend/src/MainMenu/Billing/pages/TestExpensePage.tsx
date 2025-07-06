import React from 'react';
import { CreateExpenseForm } from '../Components/expenseManagementSystem/expenseForm';
import { Vendor } from 'shared-types';
const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'הובלות דני',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'v2',
    name: 'שירותי ניקיון אור',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
    {
    id: 'v2',
    name: '  נספרסו בע"מ',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export const TestExpensePage = () => {
  return (
    <div>
     
      <CreateExpenseForm vendors={mockVendors} />
    </div>
  );
};
