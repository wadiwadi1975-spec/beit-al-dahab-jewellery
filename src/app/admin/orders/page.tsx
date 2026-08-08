'use client';

import { useState, useEffect } from 'react';

interface DesignOrder {
  id: number;
  date: string;
  type: string;
  weight: string;
  karat: string;
  engraving: string;
  whatsapp: string;
  image: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DesignOrder[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem('kayan-design-orders') || '[]');
    setOrders(stored);
  }, []);

  const deleteOrder = (id: number) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('kayan-design-orders', JSON.stringify(updated));
  };

  const clearAll = () => {
    setOrders([]);
    localStorage.removeItem('kayan-design-orders');
  };

  if (!mounted) return <div className="min-h-screen bg-black flex items-center justify-center text-gold">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">طلبات التصميم</h1>
            <p className="text-foreground/40 text-sm mt-1">{orders.length} طلب</p>
          </div>
          {orders.length > 0 && (
            <button onClick={clearAll} className="px-4 py-2 rounded-full border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-all">
              مسح الكل
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-gold/50 text-lg">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5 hover:border-gold/30 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold">#{order.id.toString().slice(-6)}</span>
                      <span className="text-foreground/30 text-xs">{order.date}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      <div>
                        <p className="text-foreground/40 text-[10px]">النوع</p>
                        <p className="text-gold font-bold text-sm">{order.type}</p>
                      </div>
                      <div>
                        <p className="text-foreground/40 text-[10px]">الوزن</p>
                        <p className="text-gold font-bold text-sm">{order.weight}</p>
                      </div>
                      <div>
                        <p className="text-foreground/40 text-[10px]">العيار</p>
                        <p className="text-gold font-bold text-sm">{order.karat}</p>
                      </div>
                      <div>
                        <p className="text-foreground/40 text-[10px]">النقش</p>
                        <p className="text-gold font-bold text-sm">{order.engraving}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-foreground/40 text-[10px]">الوتساب</p>
                      <p className="text-gold font-bold text-sm" dir="ltr">{order.whatsapp}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteOrder(order.id)} className="text-red-400/50 hover:text-red-400 text-xs px-3 py-1 rounded-lg hover:bg-red-500/10 transition-all">
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
