import React, { useState } from 'react';
import { WorkspaceType } from 'shared-types';
import LoungePricingForm from './LoungePricingForm';
import MeetingRoomPricingForm from './MeetingRoomPricingForm';
import WorkspacePricingForm from './WorkspacePricingForm';

// ערכי ה-WorkspaceType כפי שמוגדרים ב-enum
const workspaceTypes = [
  { value: WorkspaceType.PRIVATE_ROOM, label: 'חדר פרטי' },
  { value: WorkspaceType.OPEN_SPACE, label: 'אופן ספייס' },
  { value: WorkspaceType.KLIKAH_CARD, label: 'כרטיס קליקה' },
];

const PricingConfigurationPage = () => {
  const [tab, setTab] = useState<'lounge' | 'meeting' | 'workspace'>('lounge');
  // סטייט לבחירת סוג סביבת עבודה (רק ל-workspace)
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(workspaceTypes[0].value);

  return (
    <div>
      <div className="flex space-x-2 mb-4 rtl:space-x-reverse">
        <button
          className={`px-4 py-2 rounded ${tab === 'lounge' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('lounge')}
        >
          לאונג'
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'meeting' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('meeting')}
        >
          חדרי ישיבות
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'workspace' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('workspace')}
        >
          סביבת עבודה
        </button>
      </div>
      {/* בחירת סוג סביבת עבודה רק ב-workspace */}
      {tab === 'workspace' && (
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="workspaceType" className="font-bold">סוג סביבת עבודה:</label>
          <select
            id="workspaceType"
            value={workspaceType}
            onChange={e => setWorkspaceType(e.target.value as WorkspaceType)}
            className="border rounded px-2 py-1"
          >
            {workspaceTypes.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        {tab === 'lounge' && <LoungePricingForm />}
        {tab === 'meeting' && <MeetingRoomPricingForm />}
        {tab === 'workspace' && <WorkspacePricingForm workspaceType={workspaceType} />}
      </div>
    </div>
  );
};

export default PricingConfigurationPage;
