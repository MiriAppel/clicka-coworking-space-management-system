import { FaPhone, FaEnvelope, FaUsers, FaQuestion } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { FaTrash, FaPen } from "react-icons/fa"; // ייבוא האייקונים
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { InteractionType, Lead, LeadInteraction } from "shared-types";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";

const getInteractionIcon = (type: InteractionType) => {
  switch (type) {
    case InteractionType.PHONE:
      return <FaPhone className="text-blue-500" />;
    case InteractionType.EMAIL:
      return <FaEnvelope className="text-green-500" />;
    case InteractionType.MEETING:
      return <FaUsers className="text-purple-500" />;
    default:
      return <FaQuestion className="text-gray-400" />;
  }
};

export const LeadInteractionDetails = () => {
  const navigate = useNavigate();
  const selectedLead = useLeadsStore(state => state.selectedLead);
  const { handleDeleteInteraction, handleSelectLead, resetSelectedLead } = useLeadsStore();
  const location = useLocation();
  const isEditModalOpen = useLeadsStore(state => state.isEditModalOpen);
  const setIsEditModalOpen = useLeadsStore(state => state.setIsEditModalOpen);
  const editingInteraction = useLeadsStore(state => state.editingInteraction);
  const setEditingInteraction = useLeadsStore(state => state.setEditingInteraction);
  // סוגי אינטראקציה
  const interactionTypes = ["Phone", "Email", "Meeting", "Other"];

  const showGraphForId = useLeadsStore(state => state.showGraphForId);
  const setShowGraphForId = useLeadsStore(state => state.setShowGraphForId);
  const showGraph = selectedLead?.id === showGraphForId;

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingInteraction(null);
  };
  // פונקציה לשליחת עדכון האינטראקציה
  const handleSaveInteraction = async () => {
    if (editingInteraction && selectedLead?.id) {
      try {
        const response = await fetch(`http://localhost:3001/api/interaction/${editingInteraction.id}`, {
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

  const deleteInteraction = async (interactionId: string) => {
    await handleDeleteInteraction(interactionId);
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
            {
              showGraph ? (
                <div className="mt-4" >
                  {/* הגרף כאן */}
                </div>
              ) : selectedLead?.interactions?.map((interaction) => {
                console.log(interaction); // הוספת השורה כאן
                return (
                  <div key={interaction.id} className="p-4 border rounded-lg shadow-md bg-white w-64">
                    <div className="flex items-center gap-2 font-semibold">
                      <span>סוג אינטראקציה:</span> {getInteractionIcon(interaction.type)} {interaction.type.toLocaleLowerCase()}
                    </div>
                    <p className="font-semibold">אימייל משתמש: {interaction.userEmail}</p>
                    <p className="font-semibold">תאריך עדכון: {new Date(interaction.updatedAt).toLocaleDateString()}</p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => interaction.id && deleteInteraction(interaction.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={async e => {
                          e.stopPropagation();
                          await setIsEditModalOpen(true); // פותח את הפופאפ
                          await setEditingInteraction({ ...interaction }); // עותק חדש של האינטראקציה
                          console.log(editingInteraction);

                        }}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <FaPen />
                      </button>
                    </div>

                  </div>
                );
              })}

          </div>
        </div>

        {/* פופאפ לעריכת אינטראקציה */}
        {isEditModalOpen && editingInteraction && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-blue-200">
              {/* כפתור סגירה עגול בפינה */}
              <button
                onClick={closeEditModal}
                className="absolute top-4 left-4 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full w-9 h-9 flex items-center justify-center shadow transition"
                aria-label="סגור"
                type="button"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">עריכת אינטראקציה</h2>
              {/* שדות הטופס */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSaveInteraction();
                }}
              >
                {/* סוג אינטראקציה */}
                <label className="block mb-2 font-semibold text-blue-700">סוג אינטראקציה:</label>
                <select
                  value={editingInteraction.type}
                  onChange={e => setEditingInteraction({ ...editingInteraction, type: e.target.value as InteractionType })}
                  className="mb-4 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {interactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {/* אימייל משתמש */}
                <label className="block mb-2 font-semibold text-blue-700">אימייל משתמש:</label>
                <input
                  type="email"
                  value={editingInteraction.userEmail}
                  onChange={e => setEditingInteraction({ ...editingInteraction, userEmail: e.target.value })}
                  className="mb-4 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                {/* תאריך */}
                <label className="block mb-2 font-semibold text-blue-700">תאריך:</label>
                <input
                  type="date"
                  value={editingInteraction.updatedAt?.split('T')[0]}
                  onChange={e => setEditingInteraction({ ...editingInteraction, updatedAt: e.target.value })}
                  className="mb-6 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                <div className="flex justify-end gap-2 mt-8">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
                  >
                    סגור
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    שמור
                  </button>
                </div>
              </form>
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
            onClick={() => {
              console.log(selectedLead);

              handleSelectLead(selectedLead?.id!)
              navigate(`${selectedLead!.id}/addInteraction`)
            }}
          >
            הוספת אינטראקציה
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={() => {
              if (!selectedLead?.id) return;
              setShowGraphForId(showGraph ? null : selectedLead.id);
            }}
          >
            {showGraph ? "הצג רשימת אינטראקציות" : "הצג גרף אינטראקציות"}
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
    </div >
  );
}

export default LeadInteractionDetails;

