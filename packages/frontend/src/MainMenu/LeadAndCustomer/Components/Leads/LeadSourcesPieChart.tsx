
import React from 'react';
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { ChartDisplay, ChartData } from '../../../../Common/Components/BaseComponents/Graph';
const LeadSourcesPieChart = () => {
  const { leads } = useLeadsStore(); // קבלת הלידים מהחנויות

  // הגדרת טיפוס עבור sourceCounts
  const sourceCounts: { [key: string]: number } = leads.reduce((acc: { [key: string]: number }, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const totalCount = leads.length; // סך הלידים
  const data: ChartData[] = Object.entries(sourceCounts).map(([source, count]) => ({
    label: source,
    value: totalCount > 0 ? (count / totalCount) * 100 : 0, // חישוב אחוז
  }));

  // מציאת המקור עם מספר המתעניינים הגבוה ביותר
  const mostPopularSource = Object.entries(sourceCounts).reduce((prev, curr) => {
    return (curr[1] > prev[1]) ? curr : prev;
  }, ["", 0]);

return (
  <div style={{ textAlign: 'center' }}> {/* הוסף סגנון למרכז */}
    <h2 style={{ color: '#4A90E2', fontSize: '2em' }}>
      מקורות המתענינים
    </h2>
    <h6 style={{ color: '#4A90E2', fontSize: '1em' }}>
      כאן תוכלו לראות את מקורות המתענינים שלכם בצורה גרפית --- מכל מקור כמה אחוזים הגיעו
    </h6>

    <ChartDisplay type="pie" data={data} />
    <h6 style={{ color: '#4A90E2', fontSize: '1em' }}>
      המקור הכי מבוקש הוא: {mostPopularSource[0]} עם {mostPopularSource[1]} מתעניינים
    </h6>
  </div>
);

};

export default LeadSourcesPieChart;
