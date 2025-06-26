// import React from 'react';
// import { Button } from './Button';
// import html2canvas from 'html2canvas'; // ספרייה ללכידת תוכן האלמנט כ־canvas
// import jsPDF from 'jspdf';             // ספרייה ליצירת קובצי PDF
// import { utils, writeFile } from 'xlsx'; // ספרייה לייצוא לקובץ Excel
// import { ChartData } from './Chart'; // טיפוס הנתונים (מוגדר בנפרד)

// interface ChartExportButtonsProps {
//   data: ChartData[];                             // מערך הנתונים שמיוצא
//   title: string;                                 // שם הקובץ
//   chartRef: React.RefObject<HTMLDivElement>;     // רפרנס לאלמנט הגרף לצילום
// }

// // קומפוננטה שמציגה כפתורי ייצוא PDF ו־CSV (Excel)
// export const ChartExportButtons: React.FC<ChartExportButtonsProps> = ({ data, title, chartRef }) => {

//   // ייצוא הנתונים לקובץ Excel (CSV)
//   const exportCSV = () => {
//     const worksheet = utils.json_to_sheet(data);           // המרת הנתונים לגיליון
//     const workbook = utils.book_new();                     // יצירת חוברת חדשה
//     utils.book_append_sheet(workbook, worksheet, 'Report');// הוספת גיליון
//     writeFile(workbook, `${title}.xlsx`);                  // הורדה
//   };

//   // ייצוא הגרף כ־PDF על ידי צילום האלמנט
//   const exportPDF = async () => {
//     if (!chartRef.current) return;

//     const canvas = await html2canvas(chartRef.current);    // צילום האלמנט
//     const imgData = canvas.toDataURL('image/png');         // המרת התמונה לפורמט PNG

//     const pdf = new jsPDF({
//       orientation: 'landscape',                            // תצוגה לרוחב
//       unit: 'px',
//       format: [canvas.width, canvas.height],               // התאמה לגודל האלמנט
//     });

//     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // הוספת התמונה
//     pdf.save(`${title}.pdf`);                              // הורדה
//   };

//   return (
//     <>
//       <Button onClick={exportCSV} className="bg-blue-500 text-white px-2 py-1 rounded">
//         CSV
//       </Button>
//       <Button onClick={exportPDF} className="bg-green-500 text-white px-2 py-1 rounded">
//         PDF
//       </Button>
//     </>
//   );
// };


// import React, { useRef } from 'react'; // ייבוא React + useRef לשמירה על DOM ref
// import { Button } from './Button'; // כפתור מותאם אישית
// import { ChartData } from './Chart'; // טיפוס נתונים ל־Chart
// import { ChartDisplay } from './Chart'; // קומפוננטת גרף

// // ספריות חיצוניות לייצוא
// import html2canvas from 'html2canvas'; // צילום אזור כ־canvas
// import jsPDF from 'jspdf';             // המרת canvas לקובץ PDF
// import { utils, writeFile } from 'xlsx'; // יצירת קובץ Excel

// // טיפוס לפרופסים שהקומפוננטה מקבלת

// interface ReportChartProps {
//   type: 'line' | 'bar' | 'pie'; // סוג התרשים להצגה
//   data: ChartData[];            // נתונים לתרשים
//   title?: string;                // כותרת התרשים (לכותרת ולשם הקבצים)
//   rtl?: boolean;                // האם להפעיל תמיכה ב־RTL (ברירת מחדל: true)
// }

// // קומפוננטה שמציגה גרף וכוללת כפתורי ייצוא ל־PDF ו־Excel
// export const ReportChart: React.FC<ReportChartProps> = ({
//   type,
//   data = [],
//   title,
//   rtl = true,
// }) => {
//   const chartRef = useRef<HTMLDivElement>(null); // הפניה לאלמנט לצילום PDF

//   // פונקציה לייצוא לאקסל
//   const exportCSV = () => {
//     const worksheet = utils.json_to_sheet(data); // הפיכת נתונים לגיליון
//     const workbook = utils.book_new();           // יצירת קובץ חדש
//     utils.book_append_sheet(workbook, worksheet, 'Report'); // הוספת גיליון בשם "Report"
//     writeFile(workbook, `${title}.xlsx`); // שמירת הקובץ עם שם הכותרת
//   };

//   // פונקציה לייצוא כ־PDF (צילום הגרף)
//   const exportPDF = async () => {
//     if (!chartRef.current) return; // בדיקה שהגרף נטען
//     const canvas = await html2canvas(chartRef.current); // צילום הגרף
//     const imgData = canvas.toDataURL('image/png'); // המרת canvas לתמונה
//     const pdf = new jsPDF({
//       orientation: 'landscape',
//       unit: 'px',
//       format: [canvas.width, canvas.height],
//     });
//     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // הוספת התמונה למסמך
//     pdf.save(`${title}.pdf`); // הורדת הקובץ
//   };

//   return (
//     <div dir={rtl ? 'rtl' : 'ltr'} className="p-4 border rounded shadow space-y-4">
//       {/* כותרת + כפתורים */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-bold">{title}</h3>
//         <div className="flex gap-2">
//           <Button onClick={exportCSV} className="bg-blue-500 text-white px-2 py-1 rounded">
//             CSV
//           </Button>
//           <Button onClick={exportPDF} className="bg-green-500 text-white px-2 py-1 rounded">
//             PDF
//           </Button>
//         </div>
//       </div>

//       {/* אזור הגרף – עטוף ב־ref לצילום */}
//       <div ref={chartRef}>
//         <ChartDisplay type={type} data={data} rtl={rtl} />
//       </div>
//     </div>
//   );
// };


// import React, { useRef } from 'react';
// import { Button } from './Button';
// import { ChartData, ChartDisplay } from './Chart';
// import { Table, TableColumn } from './Table'; // ודא שהנתיב נכון
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { utils, writeFile } from 'xlsx';

// // פרופסים המורחבים של הקומפוננטה, כולל תמיכה בגרף או טבלה
// export interface ReportChartProps<T = any> {
//   title: string; // כותרת שמופיעה מעל התצוגה
//   variant: 'chart' | 'table'; // האם להציג גרף או טבלה
//   chartType?: 'line' | 'bar' | 'pie'; // סוג הגרף אם נבחר variant = chart
//   data: T[]; // הנתונים – יכולים להיות גם גרף וגם טבלה
//   columns?: TableColumn<T>[]; // עמודות במקרה של טבלה
//   rtl?: boolean; // תמיכה בכיוון מימין לשמאל
//   color?: string; // צבע הגרף
// }

// /**
//  * קומפוננטה אחודה להצגת דוח מסוג גרף או טבלה כולל אפשרויות ייצוא ל־PDF ו־Excel
//  * @param props פרופסים של תצוגה (title, data וכו')
//  */
// export const ReportChart = <T extends Record<string, any>>({
//   title,
//   variant,
//   chartType = 'bar',
//   data,
//   columns = [],
//   rtl = true,
//   color = '#00BFFF',
// }: ReportChartProps<T>) => {
//   const ref = useRef<HTMLDivElement>(null);

//   // ייצוא ל־Excel (מתאים גם לגרפים וגם לטבלאות)
//   const exportCSV = () => {
//     const worksheet = utils.json_to_sheet(data);
//     const workbook = utils.book_new();
//     utils.book_append_sheet(workbook, worksheet, 'Report');
//     writeFile(workbook, `${title}.xlsx`);
//   };

//   // ייצוא ל־PDF באמצעות צילום רכיב התצוגה
//   const exportPDF = async () => {
//     if (!ref.current) return;
//     const canvas = await html2canvas(ref.current);
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF({
//       orientation: 'landscape',
//       unit: 'px',
//       format: [canvas.width, canvas.height],
//     });
//     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
//     pdf.save(`${title}.pdf`);
//   };

//   return (
//     <>
//       {/* כותרת הדוח */}
//       <div className="flex justify-between items-center mb-2" dir={rtl ? 'rtl' : 'ltr'}>
//         <h3 className="text-lg font-bold">{title}</h3>
//         <div className="flex gap-2">
//           <Button onClick={exportCSV} className="bg-blue-500 text-white px-2 py-1 rounded">CSV</Button>
//           <Button onClick={exportPDF} className="bg-green-500 text-white px-2 py-1 rounded">PDF</Button>
//         </div>
//       </div>

//       {/* אזור התצוגה (גרף או טבלה) */}
//       <div ref={ref}>
//         {variant === 'chart' ? (
//           <ChartDisplay
//             type={chartType}
//             // data={data as ChartData[]}
//             data={data.map((item: any) => ({
//               label: item.label ?? '',
//               value: item.value ?? 0
//             }))}
//             rtl={rtl}
//             color={color}
//             title="" // כותרת כבר מוצגת למעלה
//           />
//         ) : (
//           <Table
//             columns={columns}
//             data={data}
//             dir={rtl ? 'rtl' : 'ltr'}
//           />
//         )}
//       </div>
//     </>
//   );
// };


// import React, { useRef } from 'react';
// import { Button } from './Button';
// import { ChartData, ChartDisplay } from './Chart';
// import { Table, TableColumn } from './Table';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { utils, writeFile } from 'xlsx';

// // טיפוס חדש מאוחד ל־data
// type ReportChartData = ChartData | Record<string, any>;

// /**
//  * פרופסים המורחבים של הקומפוננטה, כולל תמיכה בגרף או טבלה
//  */
// export interface ReportChartProps {
//   title: string;           // כותרת הדוח
//   variant: 'chart' | 'table'; // האם להציג גרף או טבלה
//   chartType?: 'line' | 'bar' | 'pie'; // סוג הגרף, רק אם בחרנו 'chart'
//   data: ReportChartData[]; // הנתונים לדוח (כולל גרפים ונתונים לטבלה)
//   columns?: TableColumn<any>[]; // רק אם מדובר בטבלה (לא חובה)
//   rtl?: boolean; // האם להציג כיוון ימין-שמאל
//   color?: string; // צבע ברירת מחדל לגרף
// }

// /**
//  * קומפוננטה אחודה להצגת דוח מסוג גרף או טבלה כולל ייצוא ל־PDF ו־Excel
//  */
// export const ReportChart = ({
//   title,
//   variant,
//   chartType = 'bar', // ברירת מחדל לגרף עמודות
//   data,
//   columns = [], // ברירת מחדל - טבלה ריקה
//   rtl = true, // ברירת מחדל כיוון ימין-שמאל
//   color = '#00BFFF', // ברירת מחדל לצבע גרף
// }: ReportChartProps) => {
//   const ref = useRef<HTMLDivElement>(null); // יצירת רפרנס ל־div להצגת התמונה בעת ייצוא ל־PDF

//   // פונקציה לייצוא הנתונים כקובץ CSV
//   const exportCSV = () => {
//     const worksheet = utils.json_to_sheet(data); // המרת הנתונים לגיליון Excel
//     const workbook = utils.book_new(); // יצירת ספר עבודה חדש
//     utils.book_append_sheet(workbook, worksheet, 'Report'); // הוספת גיליון לספר העבודה
//     writeFile(workbook, `${title}.xlsx`); // שמירת הקובץ עם שם הדוח
//   };

//   // פונקציה לייצוא הנתונים כקובץ PDF
//   const exportPDF = async () => {
//     if (!ref.current) return; // אם אין רפרנס ל־div, אין מה לייצא
//     const canvas = await html2canvas(ref.current); // המרת התוכן בתמונה בעזרת html2canvas
//     const imgData = canvas.toDataURL('image/png'); // המרת התמונה לפורמט PNG
//     const pdf = new jsPDF({
//       orientation: 'landscape', // כיוון הדף (נוף)
//       unit: 'px', // יחידות פיקסלים
//       format: [canvas.width, canvas.height], // גודל הדף לפי גודל התמונה
//     });
//     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // הוספת התמונה ל־PDF
//     pdf.save(`${title}.pdf`); // שמירת הקובץ כ־PDF עם שם הדוח
//   };

//   return (
//     <>
//       {/* כותרת הדוח וכפתורי ייצוא */}
//       <div className="flex justify-between items-center mb-2" dir={rtl ? 'rtl' : 'ltr'}>
//         <h3 className="text-lg font-bold">{title}</h3> {/* הצגת כותרת הדוח */}
//         <div className="flex gap-2">
//           <Button onClick={exportCSV} className="bg-blue-500 text-white px-2 py-1 rounded">
//             CSV {/* כפתור ייצוא ל־CSV */}
//           </Button>
//           <Button onClick={exportPDF} className="bg-green-500 text-white px-2 py-1 rounded">
//             PDF {/* כפתור ייצוא ל־PDF */}
//           </Button>
//         </div>
//       </div>

//       {/* תוכן - גרף או טבלה */}
//       <div ref={ref}> {/* הפניה לתוכן כדי שנוכל לייצא אותו בתמונה */}
//         {variant === 'chart' ? ( 
//           <ChartDisplay
//             type={chartType} // סוג הגרף (קו, עמודות, עוגה)
//             data={data as ChartData[]} // הנתונים המיועדים לגרף
//             rtl={rtl} // כיוון ימין-שמאל
//             color={color} // צבע ברירת מחדל לגרף
//             title="" // אין צורך בכותרת לגרף
//           />
//         ) : (
//           <Table
//             columns={columns} // עמודות הטבלה
//             data={data as Record<string, any>[]} // הנתונים עבור הטבלה
//             dir={rtl ? 'rtl' : 'ltr'} // כיוון ימין-שמאל או שמאל-ימין
//           />
//         )}
//       </div>
//     </>
//   );
// };


// import React, { useRef } from 'react';
// import { Button } from './Button';
// import html2canvas from 'html2canvas'; // ספרייה להמרת DOM לתמונה
// import jsPDF from 'jspdf'; // ספרייה ליצירת PDF
// import { utils, writeFile } from 'xlsx'; // ספרייה לעבודה עם Excel

// /**
//  * פרופסים של קומפוננטת עטיפה להצגת דוח
//  * - ניתן להכניס לתוכה כל תוכן (children)
//  * - ניתן לספק מערך נתונים לייצוא ל־Excel (לא חובה)
//  */
// interface ReportWrapperProps {
//   title: string; // כותרת הדוח
//   children: React.ReactNode; // תוכן חופשי: גרף, טבלה, טקסט, תמונה וכו'
//   rtl?: boolean; // האם הכיוון הוא ימין-לשמאל (ברירת מחדל: כן)
//   exportData?: Record<string, any>[]; // נתונים לייצוא לקובץ Excel (CSV)
// }

// /**
//  * קומפוננטה כללית לדוחות – מציגה כותרת, כפתורי ייצוא, ותוכן דינמי
//  */
// export const ReportWrapper = ({
//   title,
//   children,
//   rtl = true,
//   exportData,
// }: ReportWrapperProps) => {
//   // רפרנס לאלמנט שנרצה להמיר לתמונה בעת ייצוא PDF
//   const ref = useRef<HTMLDivElement>(null);

//   /**
//    * פונקציה לייצוא הנתונים כקובץ Excel (אם סופק exportData)
//    */
//   const exportCSV = () => {
//     if (!exportData) return; // אם אין נתונים, לא נבצע כלום
//     const worksheet = utils.json_to_sheet(exportData); // המרת הנתונים לגיליון Excel
//     const workbook = utils.book_new(); // יצירת ספר עבודה חדש
//     utils.book_append_sheet(workbook, worksheet, 'Report'); // הוספת הגיליון לספר
//     writeFile(workbook, `${title}.xlsx`); // שמירת הקובץ בשם הדוח
//   };

//   /**
//    * פונקציה לייצוא PDF – מצלמת את התוכן שבתוך ref ושומרת כ־PDF
//    */
//   const exportPDF = async () => {
//     if (!ref.current) return;
//     const canvas = await html2canvas(ref.current); // צילום האלמנט כתמונה
//     const imgData = canvas.toDataURL('image/png'); // המרת התמונה ל־base64
//     const pdf = new jsPDF({
//       orientation: 'landscape', // מצב נוף
//       unit: 'px',
//       format: [canvas.width, canvas.height], // גודל הדף לפי האלמנט
//     });
//     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // הוספת התמונה ל־PDF
//     pdf.save(`${title}.pdf`); // שמירת הקובץ
//   };

//   return (
//     <div className="mb-6">
//       {/* כותרת הדוח וכפתורי ייצוא */}
//       <div className="flex justify-between items-center mb-2" dir={rtl ? 'rtl' : 'ltr'}>
//         <h3 className="text-lg font-bold">{title}</h3>
//         <div className="flex gap-2">
//           {/* כפתור CSV יוצג רק אם יש exportData */}
//           {exportData && (
//             <Button onClick={exportCSV} className="bg-blue-500 text-white px-2 py-1 rounded">
//               CSV
//             </Button>
//           )}
//           {/* כפתור PDF – תמיד קיים */}
//           <Button onClick={exportPDF} className="bg-green-500 text-white px-2 py-1 rounded">
//             PDF
//           </Button>
//         </div>
//       </div>

//       {/* תוכן הדוח שמועבר כ־children */}
//       <div ref={ref}>
//         {children}
//       </div>
//     </div>
//   );
// };



// ייבוא React ורפרנס לתפיסת אלמנט מה-DOM
import React, { useRef } from 'react';
// ייבוא כפתור מעוצב מקומפוננטה פנימית
import { Button } from './Button';
// ייבוא ספרייה לצילום תוכן HTML לתמונה
import html2canvas from 'html2canvas'; // משמשת לצילום אזור DOM כ־canvas
// ייבוא ספרייה ליצירת קובצי PDF
import jsPDF from 'jspdf'; // מאפשרת יצירת PDF והוספת תוכן כ־Image
// ייבוא כלים לעבודה עם קבצי Excel (xlsx)
import { utils, writeFile } from 'xlsx'; // utils: המרת JSON ל־sheet, writeFile: שמירה לקובץ

/**
 * טיפוס עבור פרופסים של הקומפוננטה
 * - title: שם הדוח (משמש כשם לקובץ)
 * - exportData: מערך נתונים לייצוא לקובץ Excel
 * - refContent: רפרנס לאלמנט שנצלם לתוך PDF
 */
interface ExportButtonsProps {
  title?: string; // כותרת הדוח (לא חובה)
  exportData?: Record<string, any>[]; // מערך אובייקטים שמיועדים לייצוא כ־Excel
  refContent: React.RefObject<HTMLDivElement>; // רפרנס לתוכן שיומר לתמונה לצורך PDF
}

/**
 * קומפוננטת כפתורי ייצוא: מייצרת כפתורי ייצוא CSV + PDF
 */
export const ExportButtons = ({
  title,
  exportData,
  refContent,
}: ExportButtonsProps) => {
  // פונקציה לייצוא ל־Excel (CSV)
  const exportCSV = () => {
    if (!exportData) return; // אם אין נתונים – לא נבצע פעולה
    const worksheet = utils.json_to_sheet(exportData); // ממיר את הנתונים ל־sheet
    const workbook = utils.book_new(); // יוצר חוברת עבודה חדשה
    utils.book_append_sheet(workbook, worksheet, 'Report'); // מוסיף את הגיליון לחוברת
    writeFile(workbook, `${title}.xlsx`); // שומר את הקובץ בשם שמבוסס על כותרת הדוח
  };

  // פונקציה לייצוא PDF מתוך refContent
  const exportPDF = async () => {
    if (!refContent.current) return; // אם אין רפרנס תקף – יציאה
    const canvas = await html2canvas(refContent.current); // צילום האלמנט כתמונה
    const imgData = canvas.toDataURL('image/png'); // המרת התמונה לנתון base64 בפורמט PNG
    const pdf = new jsPDF({
      orientation: 'landscape', // מצב עמוד לרוחב
      unit: 'px', // יחידות מידה בפיקסלים
      format: [canvas.width, canvas.height], // גודל עמוד מותאם לגודל התמונה
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // הוספת התמונה כעמוד PDF
    pdf.save(`${title}.pdf`); // שמירת הקובץ בשם שמבוסס על כותרת הדוח
  };

  // JSX – החזרת רכיבי UI
  return (
    <div className="flex gap-2"> {/* עיטוף כפתורים עם מרווח בין כפתורים */}
      {exportData && ( // הצגת כפתור CSV רק אם יש נתונים לייצוא
        <Button
          onClick={exportCSV} // הפעלת ייצוא ל־Excel בלחיצה
          className="bg-blue-500 text-white px-2 py-1 rounded" // עיצוב Tailwind
        >
          CSV {/* טקסט הכפתור */}
        </Button>
      )}
      <Button
        onClick={exportPDF} // הפעלת ייצוא ל־PDF בלחיצה
        className="bg-green-500 text-white px-2 py-1 rounded" // עיצוב Tailwind
      >
        PDF {/* טקסט הכפתור */}
      </Button>
    </div>
  );
};
