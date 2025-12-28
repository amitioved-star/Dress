
import React from 'react';
import { Dress } from '../types';
import { Calendar, Tag } from 'lucide-react';

interface DressCardProps {
  dress: Dress;
  onRent: (dress: Dress) => void;
}

const DressCard: React.FC<DressCardProps> = ({ dress, onRent }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={dress.image} 
          alt={dress.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-rose-600 shadow-sm">
          ₪{dress.price}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={() => onRent(dress)}
            className="w-full bg-white text-stone-900 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-stone-100 transition-colors"
          >
            <Calendar size={18} />
            בדקי זמינות
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-stone-800">{dress.name}</h3>
          <span className="text-xs bg-stone-100 px-2 py-1 rounded-md text-stone-500">{dress.size}</span>
        </div>
        <p className="text-sm text-stone-500 line-clamp-2 min-h-[40px] leading-relaxed">
          {dress.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dress.color.toLowerCase() }} />
            {dress.color}
          </div>
          <div className="flex items-center gap-1">
            <Tag size={12} />
            {dress.category}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DressCard;
