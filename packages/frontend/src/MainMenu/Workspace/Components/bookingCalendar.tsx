import React, { useEffect } from 'react';
import { BookingStatus, UpdateBookingRequest  } from 'shared-types';

// ...existing code...
import FullCalendar from '@fullcalendar/react';
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
 // EventResizeDoneArg,
} from '@fullcalendar/core';
// ...existing code...
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import heLocale from '@fullcalendar/core/locales/he';
import '../Css/bookingCalendar.css';
import { useBookingCalendarStore } from '../../../Stores/Workspace/bookingCalendarStore';

interface BookingCalendarProps {
  roomId: string;
  roomName: string;
  roomType?: string;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  roomId,
  roomName,
  roomType = "MEETING_ROOM"
}) => {
  const {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking
  } = useBookingCalendarStore();

  useEffect(() => {
    if (roomId) {
      fetchBookings({ roomId });
    }
  }, [roomId, fetchBookings]);

  const roomBookings = bookings.filter((booking: any) => booking.roomId === roomId);

  const events = roomBookings.map((booking: any) => ({
    id: booking.id,
    title: booking.customerName || booking.externalUserName || 'הזמנה',
    start: booking.startTime,
    end: booking.endTime,
    className: `booking-status-${booking.status.toLowerCase()}`,
    extendedProps: booking
  }));

  const handleSelect = async (selectInfo: DateSelectArg) => {
    const customerName = prompt(`הזמנה חדשה עבור ${roomName}:\nשם הלקוח:`);
    if (!customerName) return;

    const newBooking = {
      roomId: roomId,
      customerName,
      startTime: selectInfo.startStr,
      endTime: selectInfo.endStr,
      notes: `הזמנה עבור ${roomName}`
    };

    try {
      await createBooking(newBooking);
      selectInfo.view.calendar.unselect();
    } catch (error) {
      alert('שגיאה ביצירת ההזמנה');
    }
  };

  const handleEventChange = async (changeInfo: EventDropArg) => {
    const { id } = changeInfo.event;
    const updatedBooking = {
      startTime: changeInfo.event.startStr,
      endTime: changeInfo.event.endStr
    };
    try {
      await updateBooking(id, updatedBooking);
    } catch (error) {
      alert('שגיאה בעדכון ההזמנה');
    }
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    const booking = clickInfo.event.extendedProps;
    
    const action = window.prompt(`פעולות עבור הזמנה של ${booking.customerName || booking.externalUserName}:
    
1 - עדכון מהיר (זמנים + הערות)
2 - שינוי סטטוס  
3 - מחיקת הזמנה
4 - ביטול`);
    
    switch(action) {
      case '1':
        await handleAdvancedEdit(booking);
        break;
      case '2':
        await showStatusMenu(booking);
        break;
      case '3':
        if (window.confirm(`האם למחוק את ההזמנה של ${booking.customerName || booking.externalUserName}?`)) {
          await deleteBooking(clickInfo.event.id);
        }
        break;
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    const statusLabels = {
      [BookingStatus.PENDING]: 'ממתין לאישור',
      [BookingStatus.APPROVED]: 'מאושר',
      [BookingStatus.REJECTED]: 'נדחה', 
      [BookingStatus.CANCELED]: 'בוטל',
      [BookingStatus.COMPLETED]: 'הושלם'
    };

    const hebrewStatus = statusLabels[newStatus];
    
    if (window.confirm(`האם לשנות סטטוס ההזמנה ל"${hebrewStatus}"?`)) {
      try {
        await updateBooking(bookingId, { status: newStatus });
      } catch (error) {
        alert('שגיאה בעדכון סטטוס');
      }
    }
  };

  const showStatusMenu = async (booking: any) => {
    const statusChoice = window.prompt(`בחר סטטוס חדש:
1 - ממתין לאישור (PENDING)
2 - מאושר (APPROVED)  
3 - נדחה (REJECTED)
4 - בוטל (CANCELED)
5 - הושלם (COMPLETED)`);

    const statusMap = {
      '1': BookingStatus.PENDING,
      '2': BookingStatus.APPROVED,
      '3': BookingStatus.REJECTED,
      '4': BookingStatus.CANCELED,
      '5': BookingStatus.COMPLETED
    };

    const newStatus = statusMap[statusChoice as keyof typeof statusMap];
    if (newStatus) {
      await handleStatusChange(booking.id, newStatus);
    }
  };

  const handleEditBooking = async (booking: any) => {
    // יצירת פורם דינמי לעדכון
    const newStartTime = prompt('זמן התחלה (YYYY-MM-DDTHH:MM):', booking.startTime?.slice(0, 16));
    if (!newStartTime) return;
    
    const newEndTime = prompt('זמן סיום (YYYY-MM-DDTHH:MM):', booking.endTime?.slice(0, 16));
    if (!newEndTime) return;
    
    const newNotes = prompt('הערות:', booking.notes || '');
    
    // יצירת אובייקט עדכון לפי הטייפס
    const updateData: UpdateBookingRequest = {
      startTime: newStartTime,
      endTime: newEndTime,
      notes: newNotes || undefined
    };
    
    try {
      await updateBooking(booking.id, updateData);
      alert('ההזמנה עודכנה בהצלחה!');
    } catch (error) {
      alert('שגיאה בעדכון ההזמנה');
      console.error('Update error:', error);
    }
  };

  const handleAdvancedEdit = async (booking: any) => {
    const formData = {
      startTime: booking.startTime?.slice(0, 16) || '',
      endTime: booking.endTime?.slice(0, 16) || '',
      notes: booking.notes || ''
    };
    
    // יצירת HTML פורם (או אפשר להשתמש ב-modal component)
    const newStartTime = prompt(`עדכון הזמנה עבור ${booking.customerName || booking.externalUserName}
    
זמן התחלה חדש:`, formData.startTime);
    
    if (newStartTime === null) return; // ביטול
    
    const newEndTime = prompt('זמן סיום חדש:', formData.endTime);
    if (newEndTime === null) return;
    
    const newNotes = prompt('הערות:', formData.notes);
    if (newNotes === null) return;
    
    // בדיקת תקינות זמנים
    const startDate = new Date(newStartTime);
    const endDate = new Date(newEndTime);
    
    if (startDate >= endDate) {
      alert('זמן התחלה חייב להיות לפני זמן הסיום');
      return;
    }
    
    if (startDate < new Date()) {
      if (!window.confirm('זמן ההתחלה בעבר. האם להמשיך?')) {
        return;
      }
    }
    
    const updateData: UpdateBookingRequest = {};
    
    // הוספת שדות רק אם השתנו
    if (newStartTime !== formData.startTime) {
      updateData.startTime = newStartTime;
    }
    
    if (newEndTime !== formData.endTime) {
      updateData.endTime = newEndTime;
    }
    
    if (newNotes !== formData.notes) {
      updateData.notes = newNotes;
    }
    
    // בדיקה אם יש משהו לעדכן
    if (Object.keys(updateData).length === 0) {
      alert('לא בוצעו שינויים');
      return;
    }
    
    try {
      await updateBooking(booking.id, updateData);
      alert('ההזמנה עודכנה בהצלחה!');
    } catch (error) {
      alert('שגיאה בעדכון ההזמנה');
      console.error('Update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">טוען הזמנות עבור {roomName}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl text-red-600">שגיאה בטעינת {roomName}: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-700 mb-2">
          📅 יומן {roomName}
        </h1>
        <p className="text-gray-600">
          ניהול הזמנות עבור {roomType === "MEETING_ROOM" ? "חדר ישיבות" : "לאונג'"} - {roomName}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          סה"כ הזמנות: {roomBookings.length} | ID חדר: {roomId}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={heLocale}
            direction="rtl"
            height="500px"
            slotMinTime="08:00"
            slotMaxTime="18:00"
            slotDuration="01:00"
            slotLabelInterval="01:00"
            snapDuration="00:30"
            allDaySlot={false}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            buttonText={{
              today: 'היום',
              month: 'חודש',
              week: 'שבוע',
              day: 'יום'
            }}
            events={events}
            selectMirror={true}
            selectable={true}
            selectOverlap={true}
            selectConstraint={{
              start: '08:00',
              end: '18:00'
            }}
            select={handleSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventChange}
            // eventResize={handleEventChange}
            editable={true}
          />
        </div>
      </div>
    </div>
  );
};