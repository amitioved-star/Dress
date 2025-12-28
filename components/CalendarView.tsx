
import React, { useState } from 'react';
import { Dress, Rental } from '../types';
// Added ShoppingBag to fix the missing import error
import { ChevronRight, ChevronLeft, Plus, CheckCircle2, Clock, ShoppingBag } from 'lucide-react';

interface CalendarViewProps {
  rentals: Rental[];
  dresses: Dress[];
  onAddRental: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ rentals, dresses, onAddRental }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('he-IL', { month: 'long' });

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i);

  const getRentalsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return rentals.filter(r => r.date === dateStr);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 pb-24 md:pt-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-800">יומן השכרות</h1>
          <p className="text-stone-500">נהלי את ההזמנות שלך בצורה חכמה</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-stone-200 rounded-full"><ChevronRight size={20} /></button>
          <span className="text-lg font-bold min-w-[120px] text-center">{monthName} {year}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-stone-200 rounded-full"><ChevronLeft size={20} /></button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        <div className="grid grid-cols-7 border-b border-stone-100">
          {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => (
            <div key={d} className="py-4 text-center text-xs font-bold text-stone-400 uppercase tracking-wider">{d}'</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="h-24 md:h-32 border-b border-l border-stone-50 bg-stone-50/30" />
          ))}
          {days.map(day => {
            const dayRentals = getRentalsForDate(day);
            return (
              <div key={day} className="h-24 md:h-32 border-b border-l border-stone-100 p-1 md:p-2 group hover:bg-rose-50/30 transition-colors">
                <span className="text-sm font-semibold text-stone-400 group-hover:text-rose-500">{day}</span>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                  {dayRentals.map(rental => {
                    const dress = dresses.find(d => d.id === rental.dressId);
                    return (
                      <div key={rental.id} className={`text-[10px] md:text-xs p-1 rounded truncate flex items-center gap-1 ${
                        rental.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rental.status === 'Confirmed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {dress?.name || 'שמלה'} - {rental.customerName}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-8 bg-rose-500 rounded-full"></div>
            השכרות קרובות
          </h2>
          <div className="space-y-4">
            {rentals.slice(0, 3).map(rental => {
              const dress = dresses.find(d => d.id === rental.dressId);
              return (
                <div key={rental.id} className="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl transition-colors border border-transparent hover:border-stone-100">
                  <div className="w-12 h-12 rounded-lg bg-stone-200 overflow-hidden">
                    <img src={dress?.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-800">{dress?.name}</p>
                    <p className="text-xs text-stone-500">{rental.customerName} • {rental.date}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    rental.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {rental.status === 'Confirmed' ? 'מאושר' : 'ממתין'}
                  </span>
                </div>
              );
            })}
            {rentals.length === 0 && <p className="text-stone-400 text-center py-4 italic">אין השכרות רשומות כרגע</p>}
          </div>
        </div>
        
        <div className="bg-rose-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">זמן לחדש את המלאי?</h2>
            <p className="text-rose-100 mb-6">הוסיפי שמלות חדשות לקטלוג שלך והגדילי את ההכנסות של העסק.</p>
            <button 
              onClick={onAddRental}
              className="bg-white text-rose-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-xl transition-all w-fit"
            >
              <Plus size={20} />
              הוספת השכרה חדשה
            </button>
          </div>
          <ShoppingBag className="absolute -bottom-6 -left-6 opacity-10 rotate-12" size={160} />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
