import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import heLocale from '@fullcalendar/core/locales/he'
import '../Css/bookingCalendar.css'
import { useBookingCalendarStore } from '../../../Stores/Workspace/bookingCalendarStore'

/**
 * קומפוננטת יומן חדרים.
 * מציגה יומן הזמנות עבור חדר מסוים, עם אפשרות להוספה, עריכה ומחיקה של אירועים.
 * 
 * Props:
 * - roomId: מזהה החדר
 * - roomName: שם החדר
 * - roomType: סוג החדר (ברירת מחדל: "MEETING_ROOM")
 */
export const BookingCalendar = ({
    roomId,
    roomName,
    roomType = "MEETING_ROOM"
}) => {
    // שליפת state ופונקציות מה-store
    const {
        bookings,
        loading,
        error,
        fetchBookings,
        createBooking,
        updateBooking,
        deleteBooking
    } = useBookingCalendarStore()

    /**
     * טוען את ההזמנות של החדר הנוכחי בכל שינוי roomId.
     */
    useEffect(() => {
        if (roomId) {
            fetchBookings({ roomId })
        }
    }, [roomId, fetchBookings])

    // סינון ההזמנות לחדר הנוכחי בלבד
    const roomBookings = bookings.filter(booking => booking.roomId === roomId)

    // המרת ההזמנות לפורמט אירועים של FullCalendar
    const events = roomBookings.map(booking => ({
        id: booking.id,
        title: booking.customerName || booking.externalUserName || 'הזמנה',
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: booking.status === 'APPROVED' ? '#10B981' : '#F59E0B',
        borderColor: booking.status === 'APPROVED' ? '#059669' : '#D97706',
        extendedProps: booking
    }))

    /**
     * הוספת הזמנה חדשה ע"י בחירת טווח ביומן.
     * פותח prompt לקבלת שם לקוח, ויוצר הזמנה חדשה ב-store.
     */
    const handleSelect = async (selectInfo) => {
        const customerName = prompt(`הזמנה חדשה עבור ${roomName}:\nשם הלקוח:`)
        if (!customerName) return

        const newBooking = {
            roomId: roomId,
            customerName,
            startTime: selectInfo.startStr,
            endTime: selectInfo.endStr,
            notes: `הזמנה עבור ${roomName}`
        }

        try {
            await createBooking(newBooking)
            selectInfo.view.calendar.unselect()
        } catch (error) {
            alert('שגיאה ביצירת ההזמנה')
        }
    }

    /**
     * עריכת הזמנה קיימת (גרירה/שינוי אורך אירוע).
     * מעדכן את ההזמנה ב-store.
     */
    const handleEventChange = async (changeInfo) => {
        const { id } = changeInfo.event
        const updatedBooking = {
            startTime: changeInfo.event.startStr,
            endTime: changeInfo.event.endStr
        }
        try {
            await updateBooking(id, updatedBooking)
        } catch (error) {
            alert('שגיאה בעדכון ההזמנה')
        }
    }

    /**
     * מחיקת הזמנה קיימת בלחיצה על אירוע.
     * שואל לאישור ומוחק מה-store.
     */
    const handleEventClick = async (clickInfo) => {
        if (window.confirm(`האם למחוק את ההזמנה ב${roomName}?`)) {
            try {
                await deleteBooking(clickInfo.event.id)
            } catch (error) {
                alert('שגיאה במחיקת ההזמנה')
            }
        }
    }

    // תצוגת טעינה
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-xl text-gray-600">טוען הזמנות עבור {roomName}...</div>
            </div>
        )
    }

    // תצוגת שגיאה
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-xl text-red-600">שגיאה בטעינת {roomName}: {error}</div>
            </div>
        )
    }

    // תצוגת היומן
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

                        selectColor="#A7F3D0"
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
                        eventResize={handleEventChange}
                        editable={true}
                    />
                </div>
            </div>

            <style jsx global>{`
                .fc .fc-timegrid-slot {
                    height: 60px !important
                }
            `}</style>
        </div>
    )
}