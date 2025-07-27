import React from 'react';
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { ChartDisplay, ChartData } from '../../../../Common/Components/BaseComponents/Graph';

const LeadSourcesPieChart = () => {
  const { leads } = useLeadsStore();
  
  const sourceCounts: { [key: string]: number } = leads.reduce((acc: { [key: string]: number }, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});
  
  const totalCount = leads.length;
  const data: ChartData[] = Object.entries(sourceCounts).map(([source, count]) => ({
    label: source,
    value: totalCount > 0 ? (count / totalCount) * 100 : 0,
  }));
  
  const mostPopularSource = Object.entries(sourceCounts).reduce((prev, curr) => {
    return (curr[1] > prev[1]) ? curr : prev;
  }, ["", 0]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    textAlign: 'center' as const
  };

  const titleStyle: React.CSSProperties = {
    color: '#2c3e50',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    marginBottom: '2rem',
    lineHeight: '1.6'
  };

  const chartContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '3rem',
    margin: '2rem 0',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid #e1e8ed'
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginTop: '2rem'
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    minWidth: '200px',
    boxShadow: '0 10px 20px rgba(52, 152, 219, 0.3)'
  };

  const highlightStyle: React.CSSProperties = {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    margin: '2rem auto',
    maxWidth: '400px',
    boxShadow: '0 10px 20px rgba(231, 76, 60, 0.3)'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>
          📊 מקורות המתעניינים
        </h1>
        
        <p style={subtitleStyle}>
          כאן תוכלו לראות את התפלגות מקורות המתעניינים שלכם בצורה ויזואלית וברורה
        </p>
        
        <div style={chartContainerStyle}>
          <ChartDisplay type="pie" data={data} />
        </div>
        
        <div style={statsStyle}>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{totalCount}</h3>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>סה"כ מתעניינים</p>
          </div>
          
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{Object.keys(sourceCounts).length}</h3>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>מקורות שונים</p>
          </div>
        </div>
        
        {mostPopularSource[0] && (
          <div style={highlightStyle}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>🏆 המקור המוביל</h3>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              {mostPopularSource[0]} - {mostPopularSource[1]} מתעניינים
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', opacity: 0.9 }}>
              ({((mostPopularSource[1] / totalCount) * 100).toFixed(1)}% מסך המתעניינים)
            </p>
          </div>
        )}
        
        {totalCount === 0 && (
          <div style={{ ...highlightStyle, backgroundColor: '#95a5a6' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>📭 אין נתונים</h3>
            <p style={{ margin: 0 }}>עדיין לא נוספו מתעניינים למערכת</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSourcesPieChart;