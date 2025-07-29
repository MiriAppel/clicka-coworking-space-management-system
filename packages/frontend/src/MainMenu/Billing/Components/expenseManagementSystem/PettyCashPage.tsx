import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../Service/Axios'; // עדכן את הנתיב בהתאם לפרויקט שלך
import { ExpenseCategory, Expense } from 'shared-types';
import { CreateExpenseForm } from './expenseForm';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { Table } from '../../../../Common/Components/BaseComponents/Table';

const PettyCashPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPettyCashExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/expenses/petty-cash');
      const allExpenses: Expense[] = response.data || [];
      const pettyOnly = allExpenses.filter(exp => exp.category === ExpenseCategory.PETTY_CASH);
      setExpenses(pettyOnly);
    } catch (err: any) {
      setError('שגיאה בטעינת הוצאות קופה קטנה');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPettyCashExpenses();
  }, []);

  const handleNewExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
    setShowForm(false);
  };

  const toggleForm = () => setShowForm(prev => !prev);

  const columns = [
    {
      header: 'מספר',
      accessor: 'id' as keyof Expense,
    },
    {
      header: 'סכום',
      accessor: 'amount' as keyof Expense,
      render: (value: number) => `${value} ₪`,
    },
    {
      header: 'תאריך',
      accessor: 'date' as keyof Expense,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'הערות',
      accessor: 'notes' as keyof Expense,
      render: (value: string) => value || '-',
    },
    {
      header: 'סטטוס',
      accessor: 'status' as keyof Expense,
    },
  ];

  if (loading) return <p>🔄 טוען נתונים...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 הוצאות קופה קטנה</h2>

      <Button onClick={toggleForm}>
        {showForm ? 'סגור טופס הוספה' : 'הוסף הוצאה חדשה'}
      </Button>

      {showForm && (
        <div style={{ marginTop: '20px' }}>
          <CreateExpenseForm
            fixedCategory={ExpenseCategory.PETTY_CASH}
            onSave={handleNewExpense}
          />
        </div>
      )}

      {expenses.length === 0 ? (
        <p>לא נמצאו הוצאות מהסוג הזה.</p>
      ) : (
        <div style={{ marginTop: '30px' }}>
          <Table data={expenses} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default PettyCashPage;
