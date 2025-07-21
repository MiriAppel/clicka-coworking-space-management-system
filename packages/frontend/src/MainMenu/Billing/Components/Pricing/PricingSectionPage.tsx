import React, { useState, useEffect, useCallback } from 'react';
import WorkspacePricingForm from './WorkspacePricingForm';
import MeetingRoomPricingForm from './MeetingRoomPricingForm';
import LoungePricingForm from './LoungePricingForm';
import { WorkspaceType } from 'shared-types';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import Swal from 'sweetalert2';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import clsx from 'clsx';
import { useTheme } from '../../../../Common/Components/themeConfig';
import { useAuthStore } from '../../../../Stores/CoreAndIntegration/useAuthStore';

interface Props {
  type: 'workspace' | 'meeting-room' | 'lounge';
}

interface FormInputs {
  workspaceType: WorkspaceType;
  effectiveDate: string;
}

type PriceRecord = {
  id: string;
  effectiveDate: string;
  year1Price?: number;
  year2Price?: number;
  year3Price?: number;
  year4Price?: number;
  hourlyRate?: number;
  discountedHourlyRate?: number;
  freeHoursKlikahCard?: number;
  eveningRate?: number;
  memberDiscountRate?: number;
};

const typeLabels: Record<Props['type'], string> = {
  workspace: 'סביבת עבודה',
  'meeting-room': 'חדרי ישיבות',
  lounge: "לאונג'",
};

const workspaceOptions = [
  { value: WorkspaceType.PRIVATE_ROOM, label: 'חדר פרטי' },
  { value: WorkspaceType.OPEN_SPACE, label: 'אופן ספייס' },
  { value: WorkspaceType.KLIKAH_CARD, label: 'כרטיס קליקה' },
];

const PricingSectionPage: React.FC<Props> = ({ type }) => {
  const [section, setSection] = useState<'current' | 'create' | 'edit' | 'history'>('current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<PriceRecord | null>(null);
  const [historyPrices, setHistoryPrices] = useState<PriceRecord[]>([]);
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState<string>('');
  const [selectedPriceData, setSelectedPriceData] = useState<PriceRecord | null>(null);

  const methods = useForm<FormInputs>({
    defaultValues: {
      workspaceType: workspaceOptions[0].value,
      effectiveDate: '',
    },
  });

  const watchedEffectiveDate = methods.watch('effectiveDate');
  const watchedWorkspaceType = methods.watch('workspaceType');

  const { user } = useAuthStore();
  const isAdmin = ['ADMIN', 'SYSTEM_ADMIN', 'MANAGER'].includes(user?.role || '');

  const { theme } = useTheme();

  // Fetch history prices
  const fetchHistoryPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    let url = '';
    switch (type) {
      case 'workspace':
        url = `http://localhost:3001/api/pricing/workspace/history/${watchedWorkspaceType}`;
        break;
      case 'meeting-room':
        url = 'http://localhost:3001/api/pricing/meeting-room/history';
        break;
      case 'lounge':
        url = 'http://localhost:3001/api/pricing/lounge/history';
        break;
    }

    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setHistoryPrices(data);
    } catch (e: any) {
      setError('שגיאה בטעינת היסטוריה: ' + e.message);
      Swal.fire('שגיאה', 'שגיאה בטעינת היסטוריה: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [type, watchedWorkspaceType]);

  // Fetch current price
  const fetchCurrentPrice = useCallback(async () => {
    setLoading(true);
    setError(null);

    let url = '';
    switch (type) {
      case 'workspace':
        url = `http://localhost:3001/api/pricing/workspace/current/${watchedWorkspaceType}`;
        break;
      case 'meeting-room':
        url = 'http://localhost:3001/api/pricing/meeting-room/current';
        break;
      case 'lounge':
        url = 'http://localhost:3001/api/pricing/lounge/current';
        break;
    }

    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 404) {
          setCurrentPrice(null);
          return;
        }
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setCurrentPrice(data);
    } catch (e: any) {
      setError('שגיאה בטעינת המחיר הנוכחי');
      Swal.fire('שגיאה', 'שגיאה בטעינת המחיר הנוכחי', 'error');
    } finally {
      setLoading(false);
    }
  }, [type, watchedWorkspaceType]);

  // Sync section to fetch data
  useEffect(() => {
    if (section === 'current') {
      fetchCurrentPrice();
    } else {
      setCurrentPrice(null);
    }
  }, [section, fetchCurrentPrice]);

  useEffect(() => {
    if (section === 'history' || section === 'edit') {
      fetchHistoryPrices();
      methods.setValue('effectiveDate', '');
      setSelectedEffectiveDate('');
      setSelectedPriceData(null);
    } else {
      setHistoryPrices([]);
    }
  }, [section, fetchHistoryPrices, methods]);

  useEffect(() => {
    setSelectedEffectiveDate(watchedEffectiveDate);
  }, [watchedEffectiveDate]);

  useEffect(() => {
    if (selectedEffectiveDate && historyPrices.length > 0) {
      const found = historyPrices.find(p => p.effectiveDate?.slice(0, 10) === selectedEffectiveDate);
      setSelectedPriceData(found || null);
    } else {
      setSelectedPriceData(null);
    }
  }, [selectedEffectiveDate, historyPrices]);

  // Handle delete price record
  const handleDelete = useCallback(async () => {
    if (!selectedPriceData?.id) {
      Swal.fire('שגיאה', 'יש לבחור תאריך תוקף קיים למחיקה.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'האם אתה בטוח?',
      text: `האם אתה בטוח שברצונך למחוק את תמחור מיום ${selectedPriceData.effectiveDate?.slice(0, 10)}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, מחק!',
      cancelButtonText: 'ביטול',
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError(null);

    let url = '';
    const id = selectedPriceData.id;

    switch (type) {
      case 'workspace':
        url = `http://localhost:3001/api/pricing/workspace/${id}`;
        break;
      case 'meeting-room':
        url = `http://localhost:3001/api/pricing/meeting-room/${id}`;
        break;
      case 'lounge':
        url = `http://localhost:3001/api/pricing/lounge/${id}`;
        break;
      default:
        Swal.fire('שגיאה', 'שגיאה: סוג מחיר לא נתמך למחיקה.', 'error');
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'שגיאה במחיקת התמחור');
      }

      Swal.fire('נמחק!', 'התמחור נמחק בהצלחה!', 'success');
      setHistoryPrices(prev => prev.filter(p => p.id !== id));
      if (currentPrice?.id === id) setCurrentPrice(null);

      methods.setValue('effectiveDate', '');
      setSelectedEffectiveDate('');
      setSelectedPriceData(null);

      await fetchHistoryPrices();
      await fetchCurrentPrice();

      setSection('history');
    } catch (error: any) {
      setError(error.message);
      Swal.fire('שגיאה', error.message, 'error');
      console.error('שגיאה במחיקה:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPriceData, type, currentPrice, fetchHistoryPrices, fetchCurrentPrice, methods]);

  // Render current price details
  const renderCurrentPrice = () => {
    if (loading) return <div>טוען מחיר נוכחי...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!currentPrice) return <div>לא נמצא מחיר נוכחי.</div>;

    return (
      <div className="bg-white p-4 rounded-md shadow">
        <h4 className="font-semibold text-lg mb-2">
          פרטי מחיר נוכחי - {typeLabels[type]} (
          {watchedWorkspaceType.replace('_', ' ') || ''}):
        </h4>
        {type === 'workspace' && (
          <>
            <p><strong>מחיר שנה 1:</strong> {currentPrice.year1Price} ₪</p>
            <p><strong>מחיר שנה 2:</strong> {currentPrice.year2Price} ₪</p>
            <p><strong>מחיר שנה 3:</strong> {currentPrice.year3Price} ₪</p>
            <p><strong>מחיר שנה 4:</strong> {currentPrice.year4Price} ₪</p>
          </>
        )}
        {type === 'meeting-room' && (
          <>
            <p><strong>מחיר לשעה:</strong> {currentPrice.hourlyRate} ₪</p>
            <p><strong>מחיר לשעה (הנחה):</strong> {currentPrice.discountedHourlyRate} ₪</p>
            <p><strong>שעות חינם בכרטיס קליקה:</strong> {currentPrice.freeHoursKlikahCard}</p>
          </>
        )}
        {type === 'lounge' && (
          <>
            <p><strong>מחיר ערב:</strong> {currentPrice.eveningRate} ₪</p>
            <p><strong>הנחה לחברים:</strong> {currentPrice.memberDiscountRate! * 100}%</p>
          </>
        )}
        <p><strong>תאריך תחילה:</strong> {currentPrice.effectiveDate?.slice(0, 10)}</p>
      </div>
    );
  };

  // Render history table
  const renderHistory = () => {
    if (loading) return <div>טוען היסטוריה...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!historyPrices.length) return <div>לא נמצאה היסטוריה.</div>;

    const effectiveDir = theme.direction;
    const headers =
      type === 'workspace'
        ? ['תאריך תחילה', 'שנה 1', 'שנה 2', 'שנה 3', 'שנה 4']
        : type === 'meeting-room'
        ? ['תאריך תחילה', 'מחיר לשעה', 'מחיר לשעה (הנחה)', 'שעות חינם בכרטיס קליקה']
        : ['תאריך תחילה', 'מחיר ערב', 'הנחה לחברים (%)'];

    return (
      <div>
        <h3 className="font-bold mb-2 text-lg">היסטוריית תמחור {typeLabels[type]}:</h3>
        <div
          dir={effectiveDir}
          className="overflow-x-auto"
          role="region"
          aria-label="History Table Data"
        >
          <table
            className={clsx(
              'min-w-full table-auto border border-gray-300 rounded text-sm',
              effectiveDir === 'rtl' ? 'text-right' : 'text-left'
            )}
            style={{
              fontFamily:
                effectiveDir === 'rtl'
                  ? theme.typography.fontFamily.hebrew
                  : theme.typography.fontFamily.latin,
            }}
          >
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={clsx('border px-4 py-2 font-semibold', idx > 1 ? 'hidden md:table-cell' : '')}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyPrices.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{row.effectiveDate?.slice(0, 10)}</td>
                  {type === 'workspace' && (
                    <>
                      <td className="border px-4 py-2">{row.year1Price}</td>
                      <td className="border px-4 py-2">{row.year2Price}</td>
                      <td className="border px-4 py-2">{row.year3Price}</td>
                      <td className="border px-4 py-2">{row.year4Price}</td>
                    </>
                  )}
                  {type === 'meeting-room' && (
                    <>
                      <td className="border px-4 py-2">{row.hourlyRate}</td>
                      <td className="border px-4 py-2">{row.discountedHourlyRate}</td>
                      <td className="border px-4 py-2">{row.freeHoursKlikahCard}</td>
                    </>
                  )}
                  {type === 'lounge' && (
                    <>
                      <td className="border px-4 py-2">{row.eveningRate}</td>
                      <td className="border px-4 py-2">{(row.memberDiscountRate ?? 0) * 100}%</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Valid workspace type
  const workspaceTypeEnum: WorkspaceType = Object.values(WorkspaceType).includes(watchedWorkspaceType as WorkspaceType)
    ? (watchedWorkspaceType as WorkspaceType)
    : WorkspaceType.PRIVATE_ROOM;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ניהול תמחור: {typeLabels[type]}
      </h2>

      <FormProvider {...methods}>
        {/* Select workspace type only for workspace pricing */}
        {type === 'workspace' && (
          <div className="mb-6 flex items-center gap-3 bg-gray-50 p-3 rounded-md shadow-sm">
            <label htmlFor="workspaceType" className="font-semibold text-gray-700">
              סוג סביבת עבודה:
            </label>
            <Controller
              name="workspaceType"
              control={methods.control}
              render={({ field }) => <SelectField {...field} options={workspaceOptions} label="" />}
            />
          </div>
        )}

        {/* Section navigation buttons */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {(['current', 'create', 'edit', 'history'] as const).map((sec) => (
            <Button
              key={sec}
              variant={section === sec ? 'primary' : 'secondary'}
              onClick={() => setSection(sec)}
            >
              {{
                current: 'מחיר נוכחי',
                create: 'יצירת מחיר חדש',
                edit: 'עדכון/מחיקת מחיר',
                history: 'היסטוריית מחירים',
              }[sec]}
            </Button>
          ))}
        </div>

        {/* Main content area */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[300px] flex flex-col justify-center items-center">
          {loading && <div className="text-blue-600 text-lg">טוען נתונים...</div>}
          {error && <div className="text-red-600 text-lg">{error}</div>}

          {!loading && !error && (
            <>
              {section === 'current' && renderCurrentPrice()}

              {section === 'create' && (
                <>
                  {isAdmin ? (
                    <>
                      <h3 className="font-bold mb-4 text-lg text-gray-700">יצירת מחיר חדש:</h3>
                      {type === 'workspace' ? (
                        <WorkspacePricingForm
                          workspaceType={workspaceTypeEnum}
                          onSuccess={() => {
                            setSection('history');
                            fetchHistoryPrices();
                            fetchCurrentPrice();
                          }}
                        />
                      ) : type === 'meeting-room' ? (
                        <MeetingRoomPricingForm
                          onSuccess={() => {
                            setSection('history');
                            fetchHistoryPrices();
                            fetchCurrentPrice();
                          }}
                        />
                      ) : (
                        <LoungePricingForm
                          onSuccess={() => {
                            setSection('history');
                            fetchHistoryPrices();
                            fetchCurrentPrice();
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-red-500 font-bold text-center">
                      רק מנהל יכול ליצור תמחור חדש.
                    </div>
                  )}
                </>
              )}

              {section === 'edit' && (
                <>
                  {isAdmin ? (
                    <>
                      <div className="mb-4 flex items-center gap-2 bg-gray-100 p-3 rounded-md shadow-sm">
                        <label htmlFor="effectiveDate" className="font-bold text-gray-700">
                          בחר תאריך לתחילת תוקף (עדכון/מחיקה):
                        </label>
                        <Controller
                          name="effectiveDate"
                          control={methods.control}
                          render={({ field }) => <InputField {...field} type="date" label="תאריך תוקף" />}
                        />
                        <Button
                          variant="accent"
                          onClick={handleDelete}
                          disabled={!selectedEffectiveDate || !selectedPriceData || loading}
                        >
                          {loading ? 'מוחק...' : 'מחק מחיר'}
                        </Button>
                      </div>

                      {selectedEffectiveDate && selectedPriceData ? (
                        <>
                          <h3 className="font-bold mb-4 text-lg text-gray-700">
                            עריכת מחיר מתאריך {selectedEffectiveDate}:
                          </h3>
                          {type === 'workspace' ? (
                            <WorkspacePricingForm
                              workspaceType={workspaceTypeEnum}
                              initialData={selectedPriceData}
                              onSuccess={() => {
                                setSection('history');
                                fetchHistoryPrices();
                                fetchCurrentPrice();
                                methods.setValue('effectiveDate', '');
                                setSelectedPriceData(null);
                              }}
                            />
                          ) : type === 'meeting-room' ? (
                            <MeetingRoomPricingForm
                              initialData={selectedPriceData}
                              onSuccess={() => {
                                setSection('history');
                                fetchHistoryPrices();
                                fetchCurrentPrice();
                                methods.setValue('effectiveDate', '');
                                setSelectedPriceData(null);
                              }}
                            />
                          ) : (
                            <LoungePricingForm
                              initialData={selectedPriceData}
                              onSuccess={() => {
                                setSection('history');
                                fetchHistoryPrices();
                                fetchCurrentPrice();
                                methods.setValue('effectiveDate', '');
                                setSelectedPriceData(null);
                              }}
                            />
                          )}
                        </>
                      ) : (
                        !loading &&
                        !error && (
                          <div className="text-yellow-600 font-semibold text-center mt-4">
                            לא נמצאו נתוני תמחור לתאריך זה. אנא ודא שהתאריך נכון.
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <div className="text-red-500 font-bold text-center">
                      רק מנהל יכול לעדכן או למחוק תמחור.
                    </div>
                  )}
                </>
              )}

              {section === 'history' && renderHistory()}
            </>
          )}
        </div>
      </FormProvider>
    </div>
  );
};

export default PricingSectionPage;
