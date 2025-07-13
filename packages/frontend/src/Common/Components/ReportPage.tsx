import React, { useEffect, useRef, useState } from 'react';
import { ChartDisplay, ChartData } from '../Components/BaseComponents/Graph';
import { ExportButtons } from '../Components/BaseComponents/exportButtons';
import { Button } from '../Components/BaseComponents/Button';
// import {formatNumberIL } 

import { useLeadsStore } from '../../Stores/LeadAndCustomer/leadsStore';


export const ReportPage = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  //עושים רפרנס לדיו שאחרי זה יעזור לי לייצא לPDF 
  const [initialData, setInitialData] = useState<ChartData[]>([]);
  const [dynamicDrillData, setDynamicDrillData] = useState<Record<string, ChartData[]>>({});
  const selectedLead = useLeadsStore(state => state.selectedLead);
  
  useEffect(()=>{
    // setInitialData(chartData)
  },[])
  // האובייקטים האולו לא מחייבים שיהיו כך. אפשר להביא מה שכל אחד צריך מהAPI 
  // ✅ Estados
  const [data, setData] = useState<ChartData[]>(initialData);
  //מאחסן מה שהולכים לראות בגרף GROUP A או GROUP B 
  const [isDrillDown, setIsDrillDown] = useState(false);
  //אם אנחנו רואים את הנתונים עושה TRUE אם לא עושה FALSE 
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  // שומר פה איזה קבוצה נבחרה ונשמרה 
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  // 👆 מוסיף מצב שמייצג את סוג הגרף לבחירה
  const [groupBy, setGroupBy] = useState<'month' | 'quarter' | 'year'>('month');
  //בחירה איך שאני רוצה שהדברי =ם יהיו
  const [startDate, setStartDate] = useState<string>(''); // FORMAT: yyyy-mm-dd
  // משתנה שמאפשר אפשרות של בחירה בתאריכים-תאריך תחילה ותאריך סוף 
  const [endDate, setEndDate] = useState<string>('');

  // מסדר את הלחיצה בגרפים 
  const handleBarClick = (label: string) => {
    // const label = event?.activeLabel;
    // שם של מה שלחצנו 
    if (!label) return;

    const detailData = dynamicDrillData[label];
    if (detailData) {
      setData(detailData);
      setSelectedLabel(label);
      setIsDrillDown(true);
    } else {
      alert(`There are not data to  "${label}"`);
    }
    //אם יש תנונים למה שבחרתי אז הור מביא לי אותם ואם אין את הנתונים אז קופץ לי ALERT 
  };

  const goBack = () => {
    setData(initialData);
    setIsDrillDown(false);
    setSelectedLabel(null);
  };
  //חוזר לגרך ההתחלתי 
  function groupDataBy(data: ChartData[], groupBy: 'month' | 'quarter' | 'year'): ChartData[] {
    const groups: Record<string, number> = {};
    //זה כמו מילון לדוגמא : { "2024-01": 100, "2024-02": 230 }.
    data.forEach(item => {
      const date = new Date(item.date); //אמחנו מחליפים את התאריך לאובייקט DATE
      let key = '';
      //אנחנו עושים נתון שבו נשמור את הנתונים של של הקבוצה הנדרשת 

      switch (groupBy) {
        case 'month':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          //אנחנו מייצרים את הKEY הזה תלוי לפי הבחירה שאנחנו רוצים אם זה לפי יום חודש או שנה ומכניסים את זה לתוך
          //לחודש עושים את השנה+0 כשי שיצא יותר מסודר 
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()} Q${quarter}`;
          break;
        //לכל טרימסטר אנחנו עושים את זה לפפי קווארטרים עם הנובחה הספציפית שלהם 
        case 'year':
          key = `${date.getFullYear()}`;
          break;
      }

      groups[key] = (groups[key] || 0) + item.value;
      //אם הKEY קיימת אז רק מוסיפים את הVALUE ואם היא לר קיימת אז מאתחלים אותה לאפס ואז מוסיפים 
    });

    return Object.entries(groups).map(([label, value]) => ({
      label,
      value,
      date: label
    }));
    //ואז כבר מתי שיש לנו את מה שאנחנו רוצים לפי מה שבחרנו אנו רותים לשנות את זה לאובייקט עם תבנית של יום חודש שנה 
  }
  function filterByDateRange(data: ChartData[], start: string, end: string): ChartData[] {
    if (!start && !end) return data;

    return data.filter(item => {
      const itemDate = new Date(item.date);
      const startD = start ? new Date(start) : null;
      const endD = end ? new Date(end) : null;

      return (!startD || itemDate >= startD) && (!endD || itemDate <= endD);
    });
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isDrillDown ? `Details of "${selectedLabel}"` : 'General Report'}
      </h1>
      {/* ⬇️ Select to change the graph type */}
      <div className="mb-4">
        {/* מאפשר לבחור בין שלושה סוגים של גרפים */}
        <label htmlFor="chartType" className="mr-2 font-semibold">Chart Type:</label>
        <select
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
          className="border p-1 rounded"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="groupBy" className="mr-2 font-semibold">Group by:</label>
        <select
          id="groupBy"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as 'month' | 'quarter' | 'year')}
          className="border p-1 rounded"
        >
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="mb-5">
        <label className="mr-2 font-semibold">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-1 rounded mr-4"
        />

        <label className="mr-2 font-semibold">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      {/* Export Buttons */}
      <ExportButtons
        title={isDrillDown ? `Details${selectedLabel}` : 'General Report'}
        exportData={data}
        refContent={chartRef}
      />

      {/* מה שיש בתוך הגרף*/}
      <div
        ref={chartRef}
        role="img"
        aria-label={isDrillDown ? `Graph details ${selectedLabel}` : 'Graph Report'}
        className="bg-white mt-4 p-4 shadow rounded"
      >
        <ChartDisplay
          type={chartType} // 👈 כאן אנחנו שולחים את סוג הגרף שנבחר
          data={
            isDrillDown
              ? groupDataBy(filterByDateRange(data, startDate, endDate), groupBy)
              : filterByDateRange(data, startDate, endDate)
          }
          rtl={false}
          onClickLabel={handleBarClick}
        />
      </div>

      {/* Instruction and Bach Button */}
      {!isDrillDown && (
        <p className="text-sm text-gray-500 mt-2">
          Click on a bar to see details
        </p>
      )}
      {isDrillDown && (
        <Button
          onClick={goBack}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
        >
          ← Back to summary
        </Button>
      )}
    </div>
  );
};
