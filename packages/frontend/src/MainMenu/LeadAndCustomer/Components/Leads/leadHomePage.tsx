import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { LeadStatus, LeadSource, Lead } from "shared-types";

interface ValuesToTable {
  id: string;
  name: string;
  status: LeadStatus;
}

export const LeadHomePage = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "אברהם ישראלי",
      phone: "0501234567",
      email: "a567@gmail.com",
      idNumber: "123456789",
      status: LeadStatus.LOST,
      updatedAt: "2023-01-10T00:00:00Z",
      businessType: "עסק קטן",
      interestedIn: [],
      source: LeadSource.EVENT,
      interactions: [],
      createdAt: "2022-12-01T00:00:00Z"
    },
    {
      id: "2",
      name: "מיכל כהן",
      phone: "0527654321",
      email: "michal@example.com",
      idNumber: "111111111",
      status: LeadStatus.INTERESTED,
      updatedAt: "2023-02-15T00:00:00Z",
      businessType: "עסק בינוני",
      interestedIn: [],
      source: LeadSource.WEBSITE,
      interactions: [],
      createdAt: "2022-11-10T00:00:00Z"
    }
  ]);

  const valuesToTable: ValuesToTable[] = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    status: lead.status,
  }));

  const columns: TableColumn<ValuesToTable>[] = [
    { header: "שם", accessor: "name" },
    { header: "סטטוס", accessor: "status" },
  ];

  const deleteLead = (val: ValuesToTable) => {
    const newLeads = leads.filter((lead) => lead.id !== val.id);
    setLeads(newLeads);
  };

  const updateLead = (val: ValuesToTable) => {
    // עתידית: כאן נוכל להוסיף פתיחת טופס עריכה
  };

  return (
    <div className="p-6 text-right rtl">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">מתעניינים</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-start">
        <Button variant="primary" size="sm" onClick={() => navigate("intersections")}>
          אינטראקציות של מתעניינים
        </Button>
        <Button variant="primary" size="sm" onClick={() => navigate("interestedCustomerRegistration")}>
          הוספת מתעניין חדש
        </Button>
      </div>

      {/* טבלת מתעניינים */}
      <Table<ValuesToTable>
        data={valuesToTable}
        columns={columns}
        onDelete={deleteLead}
        onUpdate={updateLead}
        renderActions={(row) => (
          <Button
            onClick={() =>
              navigate("interestedCustomerRegistration", {
                state: { data: leads.find((lead) => lead.id === row.id) },
              })
            }
            variant="primary"
            size="sm"
          >
            לטופס רישום ללקוח
          </Button>
        )}
      />
    </div>
  );
};
