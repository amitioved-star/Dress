
import React, { useState, useEffect } from 'react';
import { Dress, Rental, View } from './types';
import Navbar from './components/Navbar';
import DressCard from './components/DressCard';
import CalendarView from './components/CalendarView';
import RevenueDashboard from './components/RevenueDashboard';
import { Plus, Search, Sparkles, Filter, PackagePlus, ArrowLeft, Camera, Loader2, Phone, User, Calendar as CalendarIcon, Tag, Coins, Edit3, Image as ImageIcon } from 'lucide-react';
import { generateDressDescription } from './services/geminiService';

const INITIAL_DRESSES: Dress[] = [
  {
    id: '1',
    name: 'שמלת אמרלד מלכותית',
    price: 450,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    size: '38-40',
    color: 'Green',
    description: 'שמלת ערב מרהיבה ממשי סאטן בצבע ירוק בקבוק עמוק, גזרה מחמיאה עם שסע עדין.',
    category: 'Evening'
  },
  {
    id: '2',
    name: 'כלה אורבנית קלאסית',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=800',
    size: '36',
    color: 'White',
    description: 'שמלת כלה נקייה ומודרנית, מושלמת לאירוע צהריים או כמתנה שנייה.',
    category: 'Wedding'
  },
  {
    id: '3',
    name: 'זהב מנצנץ',
    price: 350,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
    size: 'M',
    color: 'Gold',
    description: 'שמלת פאייטים מוזהבת שתהפוך אותך למסמר הערב בכל מסיבה.',
    category: 'Party'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [dresses, setDresses] = useState<Dress[]>(INITIAL_DRESSES);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isAddingDress, setIsAddingDress] = useState(false);
  const [editingDressId, setEditingDressId] = useState<string | null>(null);
  const [isAddingRental, setIsAddingRental] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Site Settings
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1600');

  // New/Edit Dress State
  const [dressFormData, setDressFormData] = useState<Partial<Dress>>({
    name: '',
    price: 0,
    color: 'Black',
    size: 'S',
    category: 'Evening',
    description: '',
    image: ''
  });

  // New Rental State
  const [newRental, setNewRental] = useState<Partial<Rental>>({
    customerName: '',
    customerPhone: '',
    date: new Date().toISOString().split('T')[0],
    dressId: '',
    status: 'Pending'
  });

  const openAddDress = () => {
    setEditingDressId(null);
    setDressFormData({
      name: '',
      price: 0,
      color: 'Black',
      size: 'S',
      category: 'Evening',
      description: '',
      image: 'https://picsum.photos/seed/' + Math.random() + '/800/1200'
    });
    setIsAddingDress(true);
  };

  const openEditDress = (dress: Dress) => {
    setEditingDressId(dress.id);
    setDressFormData({ ...dress });
    setIsAddingDress(true);
  };

  const handleSaveDress = async () => {
    if (dressFormData.name && dressFormData.price) {
      if (editingDressId) {
        // Update existing
        setDresses(dresses.map(d => d.id === editingDressId ? { ...d, ...dressFormData } as Dress : d));
      } else {
        // Add new
        const dressToAdd: Dress = {
          ...dressFormData as Dress,
          id: Math.random().toString(36).substr(2, 9)
        };
        setDresses([dressToAdd, ...dresses]);
      }
      setIsAddingDress(false);
      setEditingDressId(null);
    }
  };

  const handleAddRental = () => {
    if (newRental.customerName && newRental.dressId && newRental.date) {
      const rentalToAdd: Rental = {
        ...newRental as Rental,
        id: Math.random().toString(36).substr(2, 9),
        status: 'Confirmed'
      };
      setRentals([rentalToAdd, ...rentals]);
      setIsAddingRental(false);
      setNewRental({
        customerName: '',
        customerPhone: '',
        date: new Date().toISOString().split('T')[0],
        dressId: '',
        status: 'Pending'
      });
    }
  };

  const generateAIdescription = async () => {
    if (!dressFormData.name || !dressFormData.color || !dressFormData.category) return;
    setIsGeneratingDesc(true);
    const desc = await generateDressDescription(dressFormData.name, dressFormData.color, dressFormData.category);
    setDressFormData({ ...dressFormData, description: desc });
    setIsGeneratingDesc(false);
  };

  const filteredDresses = dresses.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16">
      <Navbar currentView={view} setView={setView} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <section className="relative h-[500px] rounded-3xl overflow-hidden flex items-center justify-center text-center p-8 bg-stone-900">
              <img 
                src={heroImage} 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Luxury dresses"
              />
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  השמלה המושלמת <br/><span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">לאירוע הבא שלך</span>
                </h1>
                <p className="text-stone-200 text-lg mb-8">
                  קטלוג השכרה יוקרתי ומנוהל היטב. מצאו את המראה המושלם בקלות.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button onClick={() => setView('catalog')} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-900/20 transition-all transform hover:scale-105">
                    לצפייה בקטלוג
                  </button>
                  <button onClick={() => setView('dashboard')} className="bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all">
                    דוחות הכנסות
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-stone-800">המבוקשות ביותר</h2>
                <button onClick={() => setView('catalog')} className="text-rose-600 font-bold hover:underline">כל השמלות ←</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {dresses.slice(0, 3).map(dress => (
                  <DressCard key={dress.id} dress={dress} onRent={() => { setView('calendar'); setIsAddingRental(true); setNewRental({...newRental, dressId: dress.id}); }} />
                ))}
              </div>
            </section>

            <section className="bg-rose-50 rounded-3xl p-12 flex flex-col md:flex-row items-center gap-12 border border-rose-100">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={14} />
                  בינה מלאכותית
                </div>
                <h2 className="text-3xl font-black text-stone-800">ניהול עסק חכם יותר</h2>
                <p className="text-stone-600 text-lg">השתמשי בכלי ה-AI שלנו ליצירת תיאורים שיווקיים מושלמים לכל שמלה חדשה. נהלי את היומן וההזמנות במקום אחד.</p>
                <ul className="space-y-3">
                  {['מעקב אחר זמינות', 'קטלוג דיגיטלי מרשים', 'ניהול לקוחות והזמנות'].map(feat => (
                    <li key={feat} className="flex items-center gap-3 font-bold text-stone-700">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/3 aspect-square bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-stone-100 transform rotate-3">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-stone-100 rounded-full animate-pulse" />
                  <div className="h-24 w-full bg-stone-50 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-rose-200" size={48} />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-stone-100 rounded-full" />
                    <div className="h-3 w-5/6 bg-stone-100 rounded-full" />
                    <div className="h-3 w-2/3 bg-stone-100 rounded-full" />
                  </div>
                </div>
                <button className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold text-sm">צור תיאור אוטומטי</button>
              </div>
            </section>
          </div>
        )}

        {view === 'catalog' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-stone-800 mb-2">הקטלוג שלנו</h1>
                <p className="text-stone-500">בחרי את השמלה המושלמת עבורך מתוך המגוון שלנו</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="חיפוש שמלה..." 
                    className="w-full pr-12 pl-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-3 bg-white border border-stone-200 rounded-2xl hover:bg-stone-50 transition-colors shadow-sm">
                  <Filter size={20} className="text-stone-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDresses.map(dress => (
                <DressCard key={dress.id} dress={dress} onRent={() => { setView('calendar'); setIsAddingRental(true); setNewRental({...newRental, dressId: dress.id}); }} />
              ))}
              <button 
                onClick={openAddDress}
                className="group relative aspect-[3/4] border-4 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-stone-400 hover:border-rose-400 hover:text-rose-400 transition-all duration-300"
              >
                <div className="p-4 bg-stone-100 rounded-full group-hover:bg-rose-50 transition-colors">
                  <PackagePlus size={32} />
                </div>
                <span className="font-bold">הוספת שמלה חדשה</span>
              </button>
            </div>
          </div>
        )}

        {view === 'calendar' && (
          <CalendarView 
            rentals={rentals} 
            dresses={dresses} 
            onAddRental={() => setIsAddingRental(true)} 
          />
        )}

        {view === 'dashboard' && (
          <RevenueDashboard rentals={rentals} dresses={dresses} />
        )}

        {view === 'admin' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-stone-800">ניהול העסק</h1>
                <p className="text-stone-500">הוספת פריטים, עדכון מחירים וצפייה בנתונים</p>
              </div>
              <button 
                onClick={openAddDress}
                className="bg-stone-900 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-800 transition-all"
              >
                <Plus size={20} />
                שמלה חדשה
              </button>
            </div>

            {/* Site Settings Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-lg font-black text-stone-800 mb-4 flex items-center gap-2">
                <ImageIcon className="text-rose-500" size={20} />
                הגדרות נראות האתר
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase">קישור לתמונת הבית (Hero)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                      placeholder="https://..."
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                    />
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200">
                       <img src={heroImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'סה"כ שמלות', value: dresses.length, color: 'text-rose-600' },
                { label: 'השכרות פעילות', value: rentals.filter(r => r.status === 'Confirmed').length, color: 'text-green-600' },
                { label: 'הכנסה צפויה השבוע', value: `₪${rentals.length * 400}`, color: 'text-amber-600' }
              ].map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <p className="text-sm font-bold text-stone-400 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <h2 className="font-bold text-stone-800">ניהול מלאי</h2>
                <span className="text-xs text-stone-400">{dresses.length} פריטים סה"כ</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-stone-50 text-stone-400 text-xs uppercase">
                      <th className="px-6 py-4 font-bold">שמלה</th>
                      <th className="px-6 py-4 font-bold">קטגוריה</th>
                      <th className="px-6 py-4 font-bold">מידה</th>
                      <th className="px-6 py-4 font-bold">מחיר</th>
                      <th className="px-6 py-4 font-bold">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {dresses.map(dress => (
                      <tr key={dress.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={dress.image} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold text-stone-800">{dress.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stone-600 text-sm">{dress.category}</td>
                        <td className="px-6 py-4 text-stone-600 text-sm">{dress.size}</td>
                        <td className="px-6 py-4 font-bold text-rose-600">₪{dress.price}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => openEditDress(dress)}
                            className="text-stone-400 hover:text-rose-600 font-bold text-xs flex items-center gap-1"
                          >
                            <Edit3 size={12} />
                            עריכה
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Dress Modal */}
        {isAddingDress && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
                  {editingDressId ? <Edit3 className="text-rose-500" /> : <PackagePlus className="text-rose-500" />}
                  {editingDressId ? 'עריכת שמלה' : 'הוספת שמלה חדשה'}
                </h2>
                <button onClick={() => setIsAddingDress(false)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors">
                  <ArrowLeft size={24} />
                </button>
              </div>
              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">שם השמלה</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                      placeholder="למשל: שמלת נסיכה כחולה"
                      value={dressFormData.name}
                      onChange={(e) => setDressFormData({...dressFormData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase">מחיר השכרה</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                        value={dressFormData.price}
                        onChange={(e) => setDressFormData({...dressFormData, price: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase">מידה</label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                        placeholder="S, 38, וכו'"
                        value={dressFormData.size}
                        onChange={(e) => setDressFormData({...dressFormData, size: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase">צבע</label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                        value={dressFormData.color}
                        onChange={(e) => setDressFormData({...dressFormData, color: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase">קטגוריה</label>
                      <select 
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all appearance-none"
                        value={dressFormData.category}
                        onChange={(e) => setDressFormData({...dressFormData, category: e.target.value as any})}
                      >
                        <option value="Evening">ערב</option>
                        <option value="Wedding">כלה</option>
                        <option value="Party">מסיבה</option>
                        <option value="Cocktail">קוקטייל</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">קישור לתמונת שמלה</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                      placeholder="https://..."
                      value={dressFormData.image}
                      onChange={(e) => setDressFormData({...dressFormData, image: e.target.value})}
                    />
                  </div>
                  <div className="relative group aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400">
                    <img src={dressFormData.image} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 pointer-events-none">
                      <Camera size={32} />
                      <span className="font-bold text-sm">תצוגה מקדימה</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-stone-400 uppercase">תיאור השמלה</label>
                      <button 
                        onClick={generateAIdescription}
                        disabled={isGeneratingDesc || !dressFormData.name}
                        className="text-[10px] font-bold text-rose-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                      >
                        {isGeneratingDesc ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        צור תיאור עם AI
                      </button>
                    </div>
                    <textarea 
                      rows={4}
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
                      placeholder="ספרי קצת על השמלה..."
                      value={dressFormData.description}
                      onChange={(e) => setDressFormData({...dressFormData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-stone-50 border-t border-stone-100 flex gap-4">
                <button 
                  onClick={handleSaveDress}
                  className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rose-900/10 hover:bg-rose-700 transition-all active:scale-95"
                >
                  {editingDressId ? 'שמירת שינויים' : 'שמירת שמלה חדשה'}
                </button>
                <button 
                  onClick={() => setIsAddingDress(false)}
                  className="flex-1 bg-white text-stone-400 py-4 rounded-2xl font-bold border border-stone-200 hover:bg-stone-50 transition-all"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Rental Modal (Existing) */}
        {isAddingRental && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
                  <CalendarIcon className="text-rose-500" />
                  רישום השכרה חדשה
                </h2>
                <button onClick={() => setIsAddingRental(false)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors">
                  <ArrowLeft size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase flex items-center gap-2">
                    <User size={14} /> שם הלקוחה
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                    placeholder="ישראל ישראלית"
                    value={newRental.customerName}
                    onChange={(e) => setNewRental({...newRental, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase flex items-center gap-2">
                    <Phone size={14} /> טלפון
                  </label>
                  <input 
                    type="tel" 
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                    placeholder="050-0000000"
                    value={newRental.customerPhone}
                    onChange={(e) => setNewRental({...newRental, customerPhone: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase flex items-center gap-2">
                      <CalendarIcon size={14} /> תאריך אירוע
                    </label>
                    <input 
                      type="date" 
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                      value={newRental.date}
                      onChange={(e) => setNewRental({...newRental, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase flex items-center gap-2">
                      <Tag size={14} /> בחירת שמלה
                    </label>
                    <select 
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all appearance-none"
                      value={newRental.dressId}
                      onChange={(e) => setNewRental({...newRental, dressId: e.target.value})}
                    >
                      <option value="">בחרי שמלה...</option>
                      {dresses.map(d => (
                        <option key={d.id} value={d.id}>{d.name} (₪{d.price})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-stone-50 border-t border-stone-100 flex gap-4">
                <button 
                  onClick={handleAddRental}
                  className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-stone-800 transition-all active:scale-95"
                >
                  רישום הזמנה
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="hidden md:block py-12 border-t border-stone-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h2 className="text-2xl font-black text-stone-800 mb-2">GlamourRent</h2>
            <p className="text-stone-400">ניהול קטלוג והשכרת שמלות יוקרה</p>
          </div>
          <div className="flex gap-8 text-stone-400 text-sm font-bold">
            <button onClick={() => setView('home')} className="hover:text-rose-600 transition-colors">בית</button>
            <button onClick={() => setView('catalog')} className="hover:text-rose-600 transition-colors">קטלוג</button>
            <button onClick={() => setView('calendar')} className="hover:text-rose-600 transition-colors">יומן</button>
            <button onClick={() => setView('dashboard')} className="hover:text-rose-600 transition-colors">דוחות</button>
            <button onClick={() => setView('admin')} className="hover:text-rose-600 transition-colors">ניהול</button>
          </div>
          <div className="text-stone-300 text-xs">
            © 2024 כל הזכויות שמורות למותג שלך
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
