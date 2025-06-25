// ייבוא ספריית React – חובה לכל קומפוננטה
import React, { useRef } from 'react';
import { Button } from './Button';
import { useTheme } from "../themeConfig";


// ייבוא רכיבי גרפים מספריית Recharts
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ייבוא פונקציות מ־xlsx לטובת יצירת קובצי Excel
import { utils, writeFile } from 'xlsx';

// ייבוא ספריות לצילום אלמנטים והמרה ל־PDF
import html2canvas from 'html2canvas'; // משמש לצילום אלמנט כ־canvas
import jsPDF from 'jspdf';             // משמש ליצירת קובץ PDF מהתמונה

// טיפוס TypeScript שמתאר פריט בגרף
export interface ChartData {
  label: string;         // תווית בציר X
  value: number;         // ערך בציר Y
  [key: string]: any;    // תוספות אפשריות לנתונים
}

// טיפוס לפרופסים שהקומפוננטה מקבלת
interface ReportChartProps {
  type: 'line' | 'bar' | 'pie'; // סוג הגרף: קו, עמודות או עוגה
  data: ChartData[];            // מערך הנתונים לתרשים
  title: string;                // כותרת הגרף
  rtl?: boolean;                // האם להפעיל כיוון ימין־לשמאל
  color?: string;               // צבע ברירת מחדל לגרפים
}

// קומפוננטת הגרף הראשית
export const ReportChart: React.FC<ReportChartProps> = ({
  type,                     // סוג התרשים: line / bar / pie
  data = [],                // הנתונים להצגה (ברירת מחדל ריק)
  title,                    // כותרת הגרף
  rtl = true,               // ברירת מחדל: כיוון RTL מופעל
}) => {
  const chartRef = useRef<HTMLDivElement>(null); // הפניה לגרף לצורך צילום ב־PDF

  const { colors } = useTheme(); // קבלת הצבעים מהקונטקסט
  // הגדרת צבעים עבור פלחים של גרף עוגה
  const COLORS = [colors.primary, colors.secondary, colors.accent,];

  // פונקציה לייצוא הנתונים כקובץ Excel
  const exportCSV = () => {
    const worksheet = utils.json_to_sheet(data);            // הפיכת המידע ל־Sheet
    const workbook = utils.book_new();                      // יצירת קובץ אקסל חדש
    utils.book_append_sheet(workbook, worksheet, 'Report'); // הוספת גיליון בשם 'Report'
    writeFile(workbook, `${title}.xlsx`);                   // הורדה בשם הכותרת
  };

  // פונקציה לייצוא הגרף כקובץ PDF – צילום תמונה של הגרף
  const exportPDF = async () => {
    if (!chartRef.current) return;                         // בדיקה שהרפרנס קיים

    const canvas = await html2canvas(chartRef.current);    // צילום האלמנט (גרף) כ־canvas
    const imgData = canvas.toDataURL('image/png');         // המרת הצילום לנתוני תמונה PNG

    const pdf = new jsPDF({
      orientation: 'landscape',                            // תצוגת PDF לרוחב
      unit: 'px',                                          // יחידות בפיקסלים
      format: [canvas.width, canvas.height],               // גודל התמונה
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // הוספת התמונה ל־PDF
    pdf.save(`${title}.pdf`);                              // הורדה בשם הכותרת
  };

  // JSX – תצוגת הקומפוננטה בפועל
  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}                            // כיוון טקסט בהתאם ל־RTL
      className="p-4 border rounded shadow space-y-4"     // עיצוב Tailwind
    >
      {/* כותרת הגרף וכפתורי הייצוא */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="space-x-2">
          <Button
            onClick={exportCSV}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            CSV
          </Button>
          <Button
            onClick={exportPDF}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            PDF
          </Button>
        </div>
      </div>

      {/* הגרף עצמו, עם רפרנס לצורך צילום */}
      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          {/* תרשים מסוג קו */}
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" reversed={rtl} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={colors.primary} />
            </LineChart>

            // תרשים מסוג עמודות
          ) : type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" reversed={rtl} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={colors.primary} />
            </BarChart>

            // תרשים מסוג עוגה
          ) : (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} // צבע משתנה לפי אינדקס
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
