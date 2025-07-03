// import React, { useState } from "react";
// import { Button } from "../../../../Common/Components/BaseComponents/Button";
// import { useNavigate } from "react-router-dom";
// import { LeadStatus, LeadSource, Lead, AddLeadInteractionRequest } from "shared-types";
// import { InteractionForm } from "./interactionForm";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { useNavigate } from "react-router-dom";
import { LeadStatus, LeadSource, Lead, AddLeadInteractionRequest } from "shared-types";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { set } from "react-hook-form";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const addInteraction = async (lead: Lead) => {
  try {
    console.log();

    const response = await fetch(`http://localhost:3001/api/leads/${lead.id}/addInteraction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead.interactions[lead.interactions.length - 1]),
    });

    if (!response.ok) {
      throw new Error("Failed to add interaction");
    }

    return await response;
  } catch (error) {
    console.error("Error adding interaction:", error);
    throw error;
  }
}
// // קומפוננטת בן – נפתחת בלחיצה
// export const LeadInteractionDetails = ({ lead, onDelete }: { lead: Lead, onDelete: () => void }) => {
//     const [showInteractionForm, setShowInteractionForm] = useState(false);


//     return (
//         <div className="bg-blue-50 mt-2 p-4 rounded-lg border border-blue-200">
//             <div className="text-sm text-gray-700 mb-2">
//                 <div>טלפון: {lead.phone}</div>
//                 <div>אימייל: {lead.email}</div>
//                 <div>ת"ז: {lead.idNumber}</div>
//                 <div>תאריך יצירה: {new Date(lead.createdAt).toLocaleDateString()}</div>
//             </div>
//             <div className="flex gap-2">
//                 <Button
//                     variant="accent"
//                     size="sm"
//                     onClick={() => alert("עדכון בעתיד")}
//                 >
//                     עדכון
//                 </Button>
//                 <Button
//                     variant="accent"
//                     size="sm"
//                     onClick={() => setShowInteractionForm(true)}
//                 >
//                     להוספת אינטרקציה
//                 </Button>
//             </div>
//             <div className="mt-4">
//           <InteractionForm
//             onSubmit={async (_leadId, interaction) => {
//               await addInteraction(lead.id!, interaction);
//               setShowInteractionForm(false);
//               // אפשר להוסיף כאן רענון נתונים או הודעה למשתמש
//             }}
//             onCancel={() => setShowInteractionForm(false)}
//           />
//         </div>
//         </div>
//     );
// };
// קומפוננטת בן – נפתחת בלחיצה

export const LeadInteractionDetails = () => {
  const [showGraph, setShowGraph] = useState(false);
  const navigate = useNavigate();
  const { selectedLead, handleSelectLead } = useLeadsStore();

  // אם מתחלף ליד - נאתחל את התצוגה לגרף=false
  useEffect(() => {
    setShowGraph(false);
  }, [selectedLead?.id]);

  if (!selectedLead) return null;

  return (
    <div className="bg-blue-50 mt-2 p-4 rounded-lg border border-blue-200">
      {!showGraph ? (
        <>
          <div className="text-sm text-gray-700 mb-2">
            {selectedLead.interactions?.length > 0 && <div>אינטראקציות של המתעניין:</div>}
            {selectedLead.interactions?.map((interaction, index) => (
              <div key={index}>
                <p>סוג אינטראקציה: {interaction.type}</p>
                <p>אימייל משתמש: {interaction.userEmail}</p>
                <p>תאריך עדכון: {new Date(interaction.updatedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                navigate("interestedCustomerRegistration", {
                  state: { data: selectedLead },
                })
              }
            >
              לטופס רישום ללקוח
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`${selectedLead.id}/addInteraction`)}
            >
              הוספת אינטראקציה
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowGraph(true)}
            >
              הצגה בגרף
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSelectLead(null)}
            >
              סגור
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-end mb-2">
            <Button variant="secondary" size="sm" onClick={() => setShowGraph(false)}>
              ← חזור לפרטים
            </Button>
          </div>
          <h3 className="text-lg font-bold mb-2">גרף אינטראקציות לפי תאריך</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={selectedLead.interactions.map((i) => ({
                date: new Date(i.date).toLocaleDateString(),
                type: i.type,
                count: 1,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="כמות אינטראקציות" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};
