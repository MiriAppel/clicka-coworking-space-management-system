import React, { useState, useEffect, useCallback } from 'react';
import WorkspacePricingForm from './WorkspacePricingForm';
import MeetingRoomPricingForm from './MeetingRoomPricingForm';
import LoungePricingForm from './LoungePricingForm';
import { WorkspaceType } from 'shared-types';
import Cookies from 'js-cookie';

import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import Swal from 'sweetalert2';

import { useForm, Controller, FormProvider } from 'react-hook-form';
import clsx from 'clsx';
import { useTheme } from '../../../../Common/Components/themeConfig';

interface Props {
  type: 'workspace' | 'meeting-room' | 'lounge';
}

interface FormInputs {
  workspaceType: WorkspaceType;
  effectiveDate: string;
}

const typeLabels: Record<Props['type'], string> = {
  workspace: 'סביבת עבודה',
  'meeting-room': 'חדרי ישיבות',
  lounge: "לאונג'",
};

const workspaceOptions = [
  { value: 'PRIVATE_ROOM', label: 'חדר פרטי' },
  { value: 'OPEN_SPACE', label: 'אופן ספייס' },
  { value: 'KLIKAH_CARD', label: 'כרטיס קליקה' },
];

const PricingSectionPage: React.FC<Props> = ({ type }) => {
  const [section, setSection] = useState<'current' | 'create' | 'edit' | 'history'>('current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<any>(null);
  const [historyPrices, setHistoryPrices] = useState<any[]>([]);
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState<string>('');
  const [selectedPriceData, setSelectedPriceData] = useState<any | null>(null);

  const methods = useForm<FormInputs>({
    defaultValues: {
      workspaceType: workspaceOptions[0].value as WorkspaceType,
      effectiveDate: '',
    },
  });

  const watchedEffectiveDate = methods.watch('effectiveDate');
  const watchedWorkspaceType = methods.watch('workspaceType');

  const fetchHistoryPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    let url = '';
    if (type === 'workspace') {
      url = `http://localhost:3001/api/pricing/workspace/history/${watchedWorkspaceType}`;
    } else if (type === 'meeting-room') {
      url = 'http://localhost:3001/api/pricing/meeting-room/history';
    } else if (type === 'lounge') {
      url = 'http://localhost:3001/api/pricing/lounge/history';
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

  const fetchCurrentPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    let url = '';
    if (type === 'workspace') {
      url = `http://localhost:3001/api/pricing/workspace/current/${watchedWorkspaceType}`;
    } else if (type === 'meeting-room') {
      url = 'http://localhost:3001/api/pricing/meeting-room/current';
    } else if (type === 'lounge') {
      url = 'http://localhost:3001/api/pricing/lounge/current';
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
      const foundPrice = historyPrices.find(
        (p: any) => p.effectiveDate?.slice(0, 10) === selectedEffectiveDate
      );
      setSelectedPriceData(foundPrice || null);
    } else {
      setSelectedPriceData(null);
    }
  }, [selectedEffectiveDate, historyPrices]);

  const handleDelete = async () => {
    if (!selectedPriceData || !selectedPriceData.id) {
      Swal.fire('שגיאה', 'יש לבחור תאריך תוקף קיים למחיקה.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'האם אתה בטוח?',
      text: `האם אתה בטוח שברצונך למחוק את תמחור מיום ${selectedPriceData.effectiveDate?.slice(
        0,
        10
      )}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'כן, מחק!',
      cancelButtonText: 'ביטול',
    });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);
    setError(null);
    let url = '';

    const recordIdToDelete = selectedPriceData.id;

    if (type === 'workspace') {
      // *** השינוי כאן: הסרת watchedWorkspaceType מה-URL ***
      url = `http://localhost:3001/api/pricing/workspace/${recordIdToDelete}`;
    } else if (type === 'meeting-room') {
      url = `http://localhost:3001/api/pricing/meeting-room/${recordIdToDelete}`;
    } else if (type === 'lounge') {
      url = `http://localhost:3001/api/pricing/lounge/${recordIdToDelete}`;
    } else {
      Swal.fire('שגיאה', 'שגיאה: סוג מחיר לא נתמך למחיקה.', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        let errorData = null;
        try {
          // *** שיפור בטיפול בשגיאות: נסה לפרסר JSON, אם נכשל - אל תזרוק שגיאה
          errorData = await response.json();
        } catch (jsonError) {
          console.warn('Failed to parse error response as JSON:', jsonError);
          // אם לא הצלחנו לפרסר JSON, נשתמש בהודעה גנרית
          throw new Error(`שגיאה במחיקת התמחור: ${response.status} ${response.statusText}`);
        }
        // אם הצלחנו לפרסר JSON, נשתמש בהודעה ממנו
        throw new Error(errorData?.message || 'שגיאה במחיקת התמחור');
      }

      Swal.fire('נמחק!', 'התמחור נמחק בהצלחה!', 'success');

      setHistoryPrices((prevPrices) =>
        prevPrices.filter((p) => p.id !== selectedPriceData.id)
      );

      if (currentPrice && currentPrice.id === selectedPriceData.id) {
        setCurrentPrice(null);
      }

      methods.setValue('effectiveDate', '');
      setSelectedEffectiveDate('');
      setSelectedPriceData(null);

      // רענן את הנתונים לאחר מחיקה
      await fetchHistoryPrices();
      await fetchCurrentPrice();

      setSection('history'); // חזור להיסטוריה לאחר מחיקה מוצלחת
    } catch (e: any) {
      setError(e.message);
      Swal.fire('שגיאה', e.message, 'error');
      console.error('שגיאה במחיקה:', e);
    } finally {
      setLoading(false);
    }
  };

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
            <p>
              <strong>מחיר שנה 1:</strong> {currentPrice.year1Price} ₪
            </p>
            <p>
              <strong>מחיר שנה 2:</strong> {currentPrice.year2Price} ₪
            </p>
            <p>
              <strong>מחיר שנה 3:</strong> {currentPrice.year3Price} ₪
            </p>
            <p>
              <strong>מחיר שנה 4:</strong> {currentPrice.year4Price} ₪
            </p>
          </>
        )}
        {type === 'meeting-room' && (
          <>
            <p>
              <strong>מחיר לשעה:</strong> {currentPrice.hourlyRate} ₪
            </p>
            <p>
              <strong>מחיר לשעה (הנחה):</strong> {currentPrice.discountedHourlyRate}{' '}
              ₪
            </p>
            <p>
              <strong>שעות חינם בכרטיס קליקה:</strong>{' '}
              {currentPrice.freeHoursKlikahCard}
            </p>
          </>
        )}
        {type === 'lounge' && (
          <>
            <p>
              <strong>מחיר ערב:</strong> {currentPrice.eveningRate} ₪
            </p>
            <p>
              <strong>מחיר ערב (חבר):</strong> {currentPrice.memberDiscountRate * 100}%
            </p>{' '}
            {/* תצוגה באחוזים */}
          </>
        )}
        <p>
          <strong>תאריך תחילה:</strong> {currentPrice.effectiveDate?.slice(0, 10)}
        </p>
      </div>
    );
  };

  const renderHistory = () => {
    if (loading) return <div>טוען היסטוריה...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!historyPrices || historyPrices.length === 0) return <div>לא נמצאה היסטוריה.</div>;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme } = useTheme();
    const effectiveDir = theme.direction;

    let headers: string[] = ['תאריך תחילה'];
    if (type === 'workspace') {
      headers.push('שנה 1', 'שנה 2', 'שנה 3', 'שנה 4');
    } else if (type === 'meeting-room') {
      headers.push('מחיר לשעה', 'מחיר לשעה (הנחה)', 'שעות חינם בכרטיס קליקה');
    } else if (type === 'lounge') {
      headers.push('מחיר ערב', 'הנחה לחברים (%)'); // כותרת עמודה לא משתנה
    }

    return (
      <div>
        <h3 className="font-bold mb-2 text-lg">
          היסטוריית תמחור {typeLabels[type]}:
        </h3>
        <div
          dir={effectiveDir}
          className={clsx('overflow-x-auto')}
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
                    className={clsx(
                      'border px-4 py-2 font-semibold',
                      idx > 1 ? 'hidden md:table-cell' : ''
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyPrices.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
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
                      {/* *** השינוי כאן: הכפלה ב-100 והוספת % *** */}
                      <td className="border px-4 py-2">{row.memberDiscountRate * 100}%</td>
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

  const isAdmin = ['ADMIN', 'SYSTEM_ADMIN', 'MANAGER'].includes(
    Cookies.get('role') || ''
  );
  const workspaceTypeEnum: WorkspaceType = Object.values(WorkspaceType).includes(
    watchedWorkspaceType as WorkspaceType
  )
    ? (watchedWorkspaceType as WorkspaceType)
    : WorkspaceType.PRIVATE_ROOM;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ניהול תמחור: {typeLabels[type]}
      </h2>

      <FormProvider {...methods}>
        {type === 'workspace' && (
          <div className="mb-6 flex items-center gap-3 bg-gray-50 p-3 rounded-md shadow-sm">
            <label htmlFor="workspaceType" className="font-semibold text-gray-700">
              סוג סביבת עבודה:
            </label>
            <Controller
              name="workspaceType"
              control={methods.control}
              render={({ field }) => (
                <SelectField {...field} options={workspaceOptions} label="" />
              )}
            />
          </div>
        )}

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <Button
            variant={section === 'current' ? 'primary' : 'secondary'}
            onClick={() => setSection('current')}
          >
            מחיר נוכחי
          </Button>
          <Button
            variant={section === 'create' ? 'primary' : 'secondary'}
            onClick={() => setSection('create')}
          >
            יצירת מחיר חדש
          </Button>
          <Button
            variant={section === 'edit' ? 'primary' : 'secondary'}
            onClick={() => setSection('edit')}
          >
            עדכון/מחיקת מחיר
          </Button>
          <Button
            variant={section === 'history' ? 'primary' : 'secondary'}
            onClick={() => setSection('history')}
          >
            היסטוריית מחירים
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[300px] flex flex-col justify-center items-center">
          {loading && <div className="text-blue-600 text-lg">טוען נתונים...</div>}
          {error && <div className="text-red-600 text-lg">{error}</div>}

          {!loading && !error && (
            <>
              {section === 'current' && renderCurrentPrice()}

              {section === 'create' && isAdmin && (
                <>
                  <h3 className="font-bold mb-4 text-lg text-gray-700">
                    יצירת מחיר חדש:
                  </h3>
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
              )}
              {section === 'create' && !isAdmin && (
                <div className="text-red-500 font-bold text-center">
                  רק מנהל יכול ליצור תמחור חדש.
                </div>
              )}

              {section === 'edit' && isAdmin && (
                <>
                  <div className="mb-4 flex items-center gap-2 bg-gray-100 p-3 rounded-md shadow-sm">
                    <label htmlFor="effectiveDate" className="font-bold text-gray-700">
                      בחר תאריך לתחילת תוקף (עדכון/מחיקה):
                    </label>
                    <Controller
                      name="effectiveDate"
                      control={methods.control}
                      render={({ field }) => (
                        <InputField {...field} type="date" label="תאריך תוקף" />
                      )}
                    />
                    <Button
                      variant="accent"
                      onClick={handleDelete}
                      disabled={!selectedEffectiveDate || !selectedPriceData || loading}
                    >
                      {loading ? 'מוחק...' : 'מחק מחיר'}
                    </Button>
                  </div>

                  {selectedEffectiveDate && selectedPriceData && (
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
                  )}
                  {selectedEffectiveDate && !selectedPriceData && !loading && !error && (
                    <div className="text-yellow-600 font-semibold text-center mt-4">
                      לא נמצאו נתוני תמחור לתאריך זה. אנא ודא שהתאריך נכון.
                    </div>
                  )}
                </>
              )}
              {section === 'edit' && !isAdmin && (
                <div className="text-red-500 font-bold text-center">
                  רק מנהל יכול לעדכן או למחוק תמחור.
                </div>
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