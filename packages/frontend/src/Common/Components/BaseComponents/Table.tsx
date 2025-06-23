import React from "react";
import clsx from "clsx";
import { useTheme } from "../themeConfig";


export interface BaseComponentProps {
  className?: string;
  dir?: 'rtl' | 'ltr';
  'data-testid'?: string;
  children?: React.ReactNode;
}

export interface TableColumn<T> {
  header: string;//הכותרת של העמודות של הטבלה 
  accessor: keyof T;// כל מה שיש בתוך הטבלה וזה מסוג גנרי כדי שנוכל להכניס מה שרוצים מכל טיפוס שהוא
}

export interface TableProps<T> extends BaseComponentProps {
  columns: TableColumn<T>[]; //מקבלת ARR לבניית השורות 
  data: T[];//ARR עם כל מה שיש בתוך הטבלה 
}


export const Table = <T extends Record<string, any>>({
  columns,
  data,
  className,
  dir,
  "data-testid": testId,
}: TableProps<T>) => {
  const theme = useTheme();
  const effectiveDir = dir || theme.direction;

  return (
    <div dir={effectiveDir} data-testid={testId} className={clsx("overflow-x-auto", className)} role="region"               // <-- Agregado para accesibilidad: define una región del documento.
  aria-label="Table data" >  
    {/* //בודק את הכיוון את הבדיקות ואת הרספונסיביות  */}
      <table
        className={clsx(
          "min-w-full table-auto border border-gray-300 rounded text-sm",
          effectiveDir === "rtl" ? "text-right" : "text-left"
        )}
        style={{
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
      >
        <thead className="bg-gray-100">
          <tr>
            {/* //col=כל עמודה idx=האינדקס של כל עמודה  */}
            {columns.map((col, idx) => (
                // הוא משתמש בMAP כדי שנוכל לגשת לכל אלמנט עם האינדקסים אנחנו יודעים איפה הם נמצאים 
              <th key={idx} 
              scope="col" //מגדיר את זה בראש הטבלה 
               className={clsx(
            "border px-4 py-2 font-semibold",
            idx > 1 ? "hidden md:table-cell" : ""
          )}>
            {/* //מגדירים לכל אאינדקסים KEY מיוחד כדי שנדע על איזה אלמנט אנחנו מדברים  */}
                {col.header} 
                {/* //כל COL.HEADER זה TH אחד  */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => ( 
            <tr key={rowIdx} className="hover:bg-gray-50">
              {columns.map((col, colIdx) => (
                //בכל שורה מכניס לי את כל העמודות 
                <td key={colIdx} className={clsx(
              "border px-4 py-2 align-top",
              colIdx > 1 ? "hidden md:table-cell" : ""
            )}>
                  {row[col.accessor]}
                  {/* //ניגש לכל מה שכתוב בעמודות לדוג אם ACCESOR=NAME אז מדפיס לי ROW[NAME] */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
