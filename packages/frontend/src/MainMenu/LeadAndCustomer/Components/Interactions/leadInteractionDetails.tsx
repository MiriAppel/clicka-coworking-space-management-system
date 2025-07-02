// import React, { useState } from "react";
// import { Button } from "../../../../Common/Components/BaseComponents/Button";
// import { useNavigate } from "react-router-dom";
// import { LeadStatus, LeadSource, Lead, AddLeadInteractionRequest } from "shared-types";
// import { InteractionForm } from "./interactionForm";
import React, { useState } from "react";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { useNavigate } from "react-router-dom";
import { LeadStatus, LeadSource, Lead, AddLeadInteractionRequest } from "shared-types";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";

export const addInteraction = async (lead:Lead) => {
    try {
        console.log();
        
        const response = await fetch(`http://localhost:3001/api/leads/${lead.id}/addInteraction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lead.interactions[lead.interactions.length-1]),
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
  const navigate = useNavigate();
  const {
      selectedLead,
      handleDeleteLead
    } = useLeadsStore();
  return (
    <div className="bg-blue-50 mt-2 p-4 rounded-lg border border-blue-200">
      <div className="text-sm text-gray-700 mb-2">
<div>
  {selectedLead!.interactions?.length > 0 && <div>אינטראקציות של המתעניין: </div>}
  <div>
    {selectedLead!.interactions?.map((interaction, index) => (
      <div key={index}>
        <p>סוג אינטראקציה: {interaction.type}</p>
        <p>אימייל משתמש: {interaction.userEmail}</p>
        <p>תאריך עדכון: {new Date(interaction.updatedAt).toLocaleDateString()}</p>
      </div>
    ))}
  </div>
</div>
        {/* <div>ת"ז: {lead.idNumber}</div> */}
        {/* <div>תאריך יצירה: {new Date(lead.createdAt).toLocaleDateString()}</div> */}
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
          variant="accent"
          size="sm"
          onClick={() => navigate(`${selectedLead!.id}/addInteraction`)}
        >
          הוספת אינטראקציה
        </Button>
        <Button
          variant="accent"
          size="sm"
          onClick={() => handleDeleteLead(selectedLead!.id!)}
        >
          מחיקה
        </Button>
      </div>
    </div>
  );
};









