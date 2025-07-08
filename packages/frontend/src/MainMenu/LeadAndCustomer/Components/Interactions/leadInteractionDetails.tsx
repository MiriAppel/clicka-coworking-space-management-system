import React, { useState } from "react";
import { FaTrash, FaPen } from "react-icons/fa"; // ייבוא האייקונים
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { useNavigate } from "react-router-dom";
import { Lead } from "shared-types";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { set } from "react-hook-form";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// פונקציה להוספת אינטראקציה
export const addInteraction = async (lead: Lead) => {
  try {
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
};

export const LeadInteractionDetails = () => {
  const [showGraph, setShowGraph] = useState(false);
  const navigate = useNavigate();
  const selectedLead = useLeadsStore(state => state.selectedLead);
  const { handleDeleteLead, handleSelectLead, resetSelectedLead } = useLeadsStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<any>(null);

  // סוגי אינטראקציה
  const interactionTypes = ["Phone", "Email", "Meeting", "Other"];

  // פונקציה לעריכת אינטראקציה
  const editInteraction = (interactionId: string) => {
    const interactionToEdit = selectedLead?.interactions.find(
      (interaction) => interaction.id === interactionId
    );
    if (interactionToEdit) {
      setEditingInteraction(interactionToEdit);
      setIsEditModalOpen(true); // פותחים את הפופאפ
    }
  };

  // פונקציה לשליחת עדכון האינטראקציה
  const handleSaveInteraction = async () => {
    if (editingInteraction && selectedLead?.id) {
      try {
        const response = await fetch(`http://localhost:3001/api/leads/${selectedLead.id}/interactions/${editingInteraction.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingInteraction),
        });

        if (response.ok) {
          console.log("Interaction updated successfully");
          setIsEditModalOpen(false); // סגירת הפופאפ
          // עדכון הסטייט או רענון המידע
        } else {
          throw new Error("Failed to update interaction");
        }
      } catch (error) {
        console.error("Error updating interaction:", error);
      }
    }
  };

  // פונקציה למחיקת אינטראקציה
  const deleteInteraction = async (interactionId: string) => {
    if (!selectedLead?.id) {
      console.error("Selected lead is not defined");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/leads/${selectedLead.id}/interactions/${interactionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Interaction deleted successfully");
        // עדכון הסטייט או רענון המידע
      } else {
        throw new Error("Failed to delete interaction");
      }
    } catch (error) {
      console.error("Error deleting interaction:", error);
    }
  };

  return (
    <div className="bg-blue-50 mt-2 p-4 rounded-lg border border-blue-200">
      <div className="text-sm text-gray-700 mb-2">
        <div>
          {selectedLead && selectedLead.interactions?.length > 0 ? (
            <div>
              <p className="font-semibold">
                ל{selectedLead.name} יש {selectedLead.interactions.length} אינטראקציות
              </p>
            </div>
          ) : (
            <p>ל{selectedLead?.name} אין אינטראקציות</p>
          )}

          <div className="flex flex-wrap gap-4 mt-4">
            {selectedLead?.interactions?.map((interaction) => (
              <div key={interaction.id} className="p-4 border rounded-lg shadow-md bg-white w-64">
                <p className="font-semibold">סוג אינטראקציה: {interaction.type}</p>
                <p>אימייל משתמש: {interaction.userEmail}</p>
                <p>תאריך עדכון: {new Date(interaction.updatedAt).toLocaleDateString()}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => interaction.id && deleteInteraction(interaction.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      interaction.id && editInteraction(interaction.id)
                    }}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FaPen />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* פופאפ לעריכת אינטראקציה */}
      {isEditModalOpen && editingInteraction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">עריכת אינטראקציה</h2>

            {/* שדה סוג אינטראקציה */}
            <label className="block mb-2">סוג אינטראקציה:</label>
            <select
              value={editingInteraction.type}
              onChange={(e) => setEditingInteraction({ ...editingInteraction, type: e.target.value })}
              className="mb-4 p-2 border w-full"
            >
              {interactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* שדה אימייל משתמש */}
            <label className="block mb-2">אימייל משתמש:</label>
            <input
              type="email"
              value={editingInteraction.userEmail}
              onChange={(e) => setEditingInteraction({ ...editingInteraction, userEmail: e.target.value })}
              className="mb-4 p-2 border w-full"
            />

            {/* שדה תאריך */}
            <label className="block mb-2">תאריך:</label>
            <input
              type="date"
              value={editingInteraction.updatedAt?.split('T')[0]} // המרת התאריך לפורמט הנכון
              onChange={(e) => setEditingInteraction({ ...editingInteraction, updatedAt: e.target.value })}
              className="mb-4 p-2 border w-full"
            />

            {/* כפתור שמירה */}
            <button onClick={handleSaveInteraction} className="bg-blue-500 text-white p-2 rounded-lg">
              שמור
            </button>
            {/* כפתור סגירה */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-500 text-white p-2 rounded-lg ml-2"
            >
              סגור
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            navigate("/leadAndCustomer/leads/interestedCustomerRegistration", {
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
          onClick={async () => {
            await resetSelectedLead();
            console.log(selectedLead);
          }}
        >
          סגור
        </Button>
      </div>
    </div>
  );
};

export default LeadInteractionDetails;
