
export interface Dress {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  description: string;
  category: 'Evening' | 'Wedding' | 'Cocktail' | 'Party';
}

export interface Rental {
  id: string;
  dressId: string;
  customerName: string;
  customerPhone: string;
  date: string; // ISO string YYYY-MM-DD
  status: 'Confirmed' | 'Pending' | 'Returned';
}

export type View = 'catalog' | 'calendar' | 'admin' | 'home' | 'dashboard';
