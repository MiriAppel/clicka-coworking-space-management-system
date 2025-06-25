import React from 'react';
import { Button } from './Button';
import html2canvas from 'html2canvas'; // ספרייה ללכידת תוכן האלמנט כ־canvas
import jsPDF from 'jspdf';             // ספרייה ליצירת קובצי PDF
import { utils, writeFile } from 'xlsx'; // ספרייה לייצוא לקובץ Excel
import { ChartData } from './Chart'; // טיפוס הנתונים (מוגדר בנפרד)

interface ChartExportButtonsProps {
  data: ChartData[];                             // מערך הנתונים שמיוצא
  title: string;                                 // שם הקובץ
  chartRef: React.RefObject<HTMLDivElement>;     // רפרנס לאלמנט הגרף לצילום
}

// קומפוננטה שמציגה כפתורי ייצוא PDF ו־CSV (Excel)
export const ChartExportButtons: React.FC<ChartExportButtonsProps> = ({ data, title, chartRef }) => {

  // ייצוא הנתונים לקובץ Excel (CSV)
  const exportCSV = () => {
    const worksheet = utils.json_to_sheet(data);           // המרת הנתונים לגיליון
    const workbook = utils.book_new();                     // יצירת חוברת חדשה
    utils.book_append_sheet(workbook, worksheet, 'Report');// הוספת גיליון
    writeFile(workbook, `${title}.xlsx`);                  // הורדה
  };

  // ייצוא הגרף כ־PDF על ידי צילום האלמנט
  const exportPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);    // צילום האלמנט
    const imgData = canvas.toDataURL('image/png');         // המרת התמונה לפורמט PNG

    const pdf = new jsPDF({
      orientation: 'landscape',                            // תצוגה לרוחב
      unit: 'px',
      format: [canvas.width, canvas.height],               // התאמה לגודל האלמנט
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // הוספת התמונה
    pdf.save(`${title}.pdf`);                              // הורדה
  };

  return (
    <>
      <Button onClick={exportCSV} className="bg-blue-500 text-white px-2 py-1 rounded">
        CSV
      </Button>
      <Button onClick={exportPDF} className="bg-green-500 text-white px-2 py-1 rounded">
        PDF
      </Button>
    </>
  );
};
