
import React from 'react';
import { Dress, Rental } from '../types';
import { TrendingUp, Users, CreditCard, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RevenueDashboardProps {
  rentals: Rental[];
  dresses: Dress[];
}

const RevenueDashboard: React.FC<RevenueDashboardProps> = ({ rentals, dresses }) => {
  // Helper to get dress by ID
  const getDress = (id: string) => dresses.find(d => d.id === id);

  // Statistics calculations
  const totalRevenue = rentals
    .filter(r => r.status === 'Confirmed')
    .reduce((sum, r) => sum + (getDress(r.dressId)?.price || 0), 0);

  const pendingRevenue = rentals
    .filter(r => r.status === 'Pending')
    .reduce((sum, r) => sum + (getDress(r.dressId)?.price || 0), 0);

  const totalRentals = rentals.length;
  const confirmedCount = rentals.filter(r => r.status === 'Confirmed').length;

  // Monthly breakdown (simple grouping)
  const monthlyData = rentals.reduce((acc: any, rental) => {
    const month = new Date(rental.date).toLocaleString('he-IL', { month: 'short' });
    if (!acc[month]) acc[month] = 0;
    if (rental.status === 'Confirmed') {
      acc[month] += getDress(rental.dressId)?.price || 0;
    }
    return acc;
  }, {});

  const months = Object.keys(monthlyData);
  const maxMonthValue = Math.max(...(Object.values(monthlyData) as number[]), 1000);

  // Top Dresses
  const dressRentalCounts = rentals.reduce((acc: any, r) => {
    acc[r.dressId] = (acc[r.dressId] || 0) + 1;
    return acc;
  }, {});

  const topDresses = Object.entries(dressRentalCounts)
    .map(([id, count]) => ({ dress: getDress(id), count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-stone-800">דוחות הכנסות</h1>
          <p className="text-stone-500">תמונת מצב פיננסית של העסק שלך</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-bold text-stone-600">נתונים בזמן אמת</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <TrendingUp className="absolute -right-4 -top-4 opacity-10" size={120} />
          <p className="text-stone-400 text-sm font-bold mb-1">סה"כ הכנסות (מאושר)</p>
          <p className="text-4xl font-black">₪{totalRevenue.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-bold">
            <ArrowUpRight size={14} />
            <span>12% מעל חודש שעבר</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <CreditCard className="text-rose-500 mb-4" size={24} />
          <p className="text-stone-400 text-sm font-bold mb-1">הכנסה בהמתנה</p>
          <p className="text-3xl font-black text-stone-800">₪{pendingRevenue.toLocaleString()}</p>
          <p className="text-stone-400 text-xs mt-2">{rentals.filter(r => r.status === 'Pending').length} עסקאות פתוחות</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <Users className="text-amber-500 mb-4" size={24} />
          <p className="text-stone-400 text-sm font-bold mb-1">לקוחות החודש</p>
          <p className="text-3xl font-black text-stone-800">{totalRentals}</p>
          <p className="text-stone-400 text-xs mt-2">שיעור המרה: {((confirmedCount / (totalRentals || 1)) * 100).toFixed(0)}%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <Award className="text-blue-500 mb-4" size={24} />
          <p className="text-stone-400 text-sm font-bold mb-1">ממוצע להשכרה</p>
          <p className="text-3xl font-black text-stone-800">₪{totalRentals > 0 ? (totalRevenue / (confirmedCount || 1)).toFixed(0) : 0}</p>
          <div className="mt-2 flex items-center gap-1 text-rose-500 text-xs font-bold">
            <ArrowDownRight size={14} />
            <span>3% מתחת ליעד</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-stone-800">מגמת הכנסות</h2>
            <select className="text-xs font-bold bg-stone-50 border-none rounded-lg p-2 focus:ring-0">
              <option>6 חודשים אחרונים</option>
              <option>שנה אחרונה</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {months.length > 0 ? months.map(month => (
              <div key={month} className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-xl transition-all duration-1000 ease-out hover:brightness-110"
                  style={{ height: `${(monthlyData[month] / maxMonthValue) * 100}%`, minHeight: '8px' }}
                ></div>
                <span className="text-xs font-bold text-stone-400">{month}</span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300 italic">
                אין מספיק נתונים להצגת גרף
              </div>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <h2 className="text-xl font-black text-stone-800 mb-6">השמלות הכי רווחיות</h2>
          <div className="space-y-6">
            {topDresses.length > 0 ? topDresses.map(({ dress, count }, idx) => (
              <div key={dress?.id} className="flex items-center gap-4">
                <div className="relative">
                  <img src={dress?.image} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-stone-800 text-sm">{dress?.name}</p>
                  <p className="text-stone-400 text-xs">{count} השכרות החודש</p>
                </div>
                <p className="font-black text-rose-600">₪{(count * (dress?.price || 0)).toLocaleString()}</p>
              </div>
            )) : (
              <p className="text-stone-300 italic text-center py-8">טרם נרשמו השכרות</p>
            )}
          </div>
          <button className="w-full mt-8 py-3 bg-stone-50 text-stone-600 rounded-xl font-bold text-sm hover:bg-stone-100 transition-colors">
            צפייה בדוח מלא
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-bold text-stone-800">עסקאות אחרונות</h2>
          <button className="text-rose-600 text-sm font-bold">ייצוא ל-Excel</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4">תאריך</th>
                <th className="px-6 py-4">לקוחה</th>
                <th className="px-6 py-4">שמלה</th>
                <th className="px-6 py-4">סטטוס</th>
                <th className="px-6 py-4">סכום</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rentals.slice(0, 5).map(rental => {
                const dress = getDress(rental.dressId);
                return (
                  <tr key={rental.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-stone-600">{rental.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-stone-800">{rental.customerName}</td>
                    <td className="px-6 py-4 text-sm text-stone-500">{dress?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                        rental.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rental.status === 'Confirmed' ? 'שולם' : 'ממתין'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-stone-800">₪{dress?.price}</td>
                  </tr>
                );
              })}
              {rentals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-400 italic">אין עסקאות להצגה</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
