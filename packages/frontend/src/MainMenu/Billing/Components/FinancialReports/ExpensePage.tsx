// ייבוא React וה־hookים הנדרשים
import React, { useEffect } from "react";

// ייבוא ה־store של ההוצאות
import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";  // עדכן את הנתיב בהתאם למיקום אצלך

// קומפוננטה להצגת רשימת הוצאות
const ExpensePage: React.FC = () => {
  // שליפה מהסטור: ההוצאות, סטטוס טעינה, שגיאה ופונקציית שליפה
  const { expenses, loading, error, fetchExpenses } = useExpenseStore();

  // קריאה לשרת בעת טעינת הקומפוננטה (כמו componentDidMount)
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // הצגת סטטוס טעינה
  if (loading) return <p>טוען נתונים...</p>;

  // הצגת שגיאה אם יש
  if (error) return <p>אירעה שגיאה: {error}</p>;

  // הצגת רשימת הוצאות
  return (
    <div>
      <h2>רשימת הוצאות</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <strong>סכום:</strong> {expense.amount} ₪ | <strong>תיאור:</strong> {expense.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensePage;
