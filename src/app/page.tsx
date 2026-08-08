'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('../components/ModelViewer'), { ssr: false });

const defaultProducts = [
  { id: 1, name: 'سوار ذهب أبيض', nameEn: 'White Gold Bracelet', price: '---', image: '/products/bracelet.png', section: 'products' },
  { id: 2, name: 'عقد ماسي', nameEn: 'Diamond Necklace', price: '---', image: '/products/necklace.png', section: 'products' },

  { id: 4, name: 'أقراط لؤلؤ', nameEn: 'Pearl Earrings', price: '---', image: '/products/earrings.png', section: 'products' },
  { id: 8, name: 'سوار ألماسي', nameEn: 'Diamond Bangle', price: '---', image: '/products/bangle.png', section: 'products' },
  { id: 9, name: 'خاتم ذهب', nameEn: 'Gold Ring', price: '---', image: '/products/ring-1.png', section: 'products' },
  { id: 10, name: 'خاتم ماسي', nameEn: 'Diamond Ring', price: '---', image: '/products/ring-2.png', section: 'products' },
];

const marqueeItems = [
  'مجوهرات فاخرة', 'تصاميم حصرية', 'ذهب عالي الجودة',
  'تصميم عربي أصيل', 'جودة لا تضاهى', 'أناقة لا حدود لها', 'قطع نادرة',
];

const goldPriceItems = [
  { label: '🪙 أونصة الذهب (24 عيار)', value: '1,251' },
  { label: '🟡 ذهب 24 عيار/غرام', value: '40.23' },
  { label: '🟡 ذهب 22 عيار/غرام', value: '36.85' },
  { label: '🟡 ذهب 21 عيار/غرام', value: '35.20' },
  { label: '🟡 ذهب 18 عيار/غرام', value: '30.17' },
];

const faqItems = [
  {
    q: 'هل يمكنني استبدال أو إرجاع المنتج؟',
    a: 'نعم، يمكنك الاستبدال أو الإرجاع خلال 14 يوماً من تاريخ الشراء بشرط أن يكون المنتج بحالته الأصلية ولم يُستخدم. يرجى إحضار الفاتورة الأصلية مع المنتج.',
  },
  {
    q: 'هل تقدمون خدمة الصيانة والتنظيف؟',
    a: 'نعم، نقدم خدمة صيانة وتنظيف المجوهرات بشكل احترافي. يمكنك زيارتنا في أي وقت لتنظيف قطعك المفضلة واستعادة لمعانها.',
  },
  {
    q: 'ما هي خدمة الاستشارة المجانية؟',
    a: 'نقدم استشارة مجانية لمساعدتك في اختيار المجوهرات المناسبة لمختلف المناسبات. يمكننا تصميم قطع حصرية حسب ذوقك وميزانيتك.',
  },
  {
    q: 'هل تشحنون internationally؟',
    a: 'نعم، نشحن إلى جميع أنحاء العالم. الشحن والتوصيل مجاني لجميع مناطق الكويت. للشحن الدولي، يرجى التواصل معنا لحساب التكلفة.',
  },
  {
    q: 'كيف أعرف مقاس الحلقة المناسب لي؟',
    a: 'يمكنك قياس محيط إصبعك باستخدام شريط ورقي رفيع وتحديد النقطة التي تلتقي فيها الطرفين. يمكنك أيضاً زيارتنا في المحل لأخذ المقاس بدقة.',
  },
  {
    q: 'هل تتوفر جميع المنتجات في المحل؟',
    a: 'معظم المنتجات المعروضة على الموقع متوفرة في المحل. للقطع الحصرية أو المحدودة، ننصح بالتواصل معنا مسبقاً للتأكد من التوفر.',
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [products, setProducts] = useState(defaultProducts);
  const [userImages, setUserImages] = useState<Record<string, string[]>>({
    products: [], sets: [], watches: [], bracelets: [], anklets: [],
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTarget, setAddTarget] = useState<{ section: string; sectionAr: string }>({ section: 'products', sectionAr: 'المنتجات' });
  const [newItem, setNewItem] = useState({ name: '', nameEn: '', price: '', image: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedProducts = localStorage.getItem('kayan-products');
    const savedImages = localStorage.getItem('kayan-userImages');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedImages) setUserImages(JSON.parse(savedImages));
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('kayan-products', JSON.stringify(products));
  }, [products, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem('kayan-userImages', JSON.stringify(userImages));
  }, [userImages, mounted]);

  const [tryOnCategory, setTryOnCategory] = useState('necklace');
  const [tryOnItems, setTryOnItems] = useState<Record<string, string>>({});
  const [tryOnOffset, setTryOnOffset] = useState({ x: 0, y: 0 });
  const [tryOnZoom, setTryOnZoom] = useState(1);
  const [tryOnRotation, setTryOnRotation] = useState(0);
  const [tryOnStep, setTryOnStep] = useState(5);
  const [selectedModel, setSelectedModel] = useState('hijab-black-1');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [useUserPhoto, setUseUserPhoto] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  // Outfit Matching states
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [outfitOccasion, setOutfitOccasion] = useState('casual');
  const [outfitResults, setOutfitResults] = useState<{ type: string; typeAr: string; name: string; nameAr: string; price: string; image: string; score: number }[] | null>(null);
  const [outfitLoading, setOutfitLoading] = useState(false);

  const outfitOccasions = [
    { key: 'casual', label: 'كاجوال' },
    { key: 'formal', label: 'رسمي' },
    { key: 'wedding', label: 'زفاف' },
    { key: 'party', label: 'حفلة' },
    { key: 'business', label: 'عمل' },
    { key: 'daily', label: 'يومي' },
  ];

  const outfitSuggestions: Record<string, { type: string; typeAr: string; name: string; nameAr: string; price: string; image: string; score: number }[]> = {
    casual: [
      { type: 'Necklace', typeAr: 'عقد', name: 'Gold Chain', nameAr: 'سلسلة ذهبية', price: '---', image: '/products/necklace.png', score: 96 },
      { type: 'Ring', typeAr: 'خاتم', name: 'Gold Ring', nameAr: 'خاتم ذهب', price: '---', image: '/products/ring-1.png', score: 92 },
      { type: 'Bracelet', typeAr: 'سوار', name: 'Gold Bracelet', nameAr: 'سوار ذهب', price: '---', image: '/products/bracelet.png', score: 88 },
    ],
    formal: [
      { type: 'Necklace', typeAr: 'عقد', name: 'Diamond Necklace', nameAr: 'عقد ماسي', price: '---', image: '/products/necklace.png', score: 98 },
      { type: 'Ring', typeAr: 'خاتم', name: 'Diamond Ring', nameAr: 'خاتم ماسي', price: '---', image: '/products/ring-2.png', score: 95 },
      { type: 'Earrings', typeAr: 'أقراط', name: 'Pearl Earrings', nameAr: 'أقراط لؤلؤ', price: '---', image: '/products/earrings.png', score: 93 },
    ],
    wedding: [
      { type: 'Necklace', typeAr: 'عقد', name: 'Bridal Set', nameAr: 'طقم عروس', price: '---', image: '/products/set-1.png', score: 99 },
      { type: 'Earrings', typeAr: 'أقراط', name: 'Pearl Earrings', nameAr: 'أقراط لؤلؤ', price: '---', image: '/products/earrings.png', score: 96 },
      { type: 'Bracelet', typeAr: 'سوار', name: 'Diamond Bangle', nameAr: 'سوار ألماسي', price: '---', image: '/products/bangle.png', score: 94 },
    ],
    party: [
      { type: 'Necklace', typeAr: 'عقد', name: 'Butterfly Set', nameAr: 'طقم فراشات', price: '---', image: '/products/set-1.png', score: 94 },
      { type: 'Ring', typeAr: 'خاتم', name: 'Emerald Ring', nameAr: 'خاتم زمرد', price: '---', image: '/products/ring.png', score: 91 },
      { type: 'Bracelet', typeAr: 'سوار', name: 'Diamond Bracelet', nameAr: 'سوار ألماسي', price: '---', image: '/products/bracelet-3.png', score: 87 },
    ],
    business: [
      { type: 'Necklace', typeAr: 'عقد', name: 'Gold Pendant', nameAr: 'قلادة ذهبية', price: '---', image: '/products/necklace.png', score: 93 },
      { type: 'Ring', typeAr: 'خاتم', name: 'Gold Ring', nameAr: 'خاتم ذهب', price: '---', image: '/products/ring-1.png', score: 90 },
      { type: 'Watch', typeAr: 'ساعة', name: 'Classic Watch', nameAr: 'ساعة كلاسيكية', price: '---', image: '/products/watch-2.png', score: 88 },
    ],
    daily: [
      { type: 'Bracelet', typeAr: 'سوار', name: 'Gold Bracelet', nameAr: 'سوار ذهب', price: '---', image: '/products/bracelet.png', score: 91 },
      { type: 'Ring', typeAr: 'خاتم', name: 'Simple Ring', nameAr: 'خاتم بسيط', price: '---', image: '/products/ring-1.png', score: 89 },
      { type: 'Watch', typeAr: 'ساعة', name: 'Elegant Watch', nameAr: 'ساعة أنيقة', price: '---', image: '/products/watch-3.png', score: 84 },
    ],
  };

  const handleOutfitMatch = () => {
    setOutfitLoading(true);
    setTimeout(() => {
      setOutfitResults(outfitSuggestions[outfitOccasion]);
      setOutfitLoading(false);
    }, 2000);
  };

  // Gold Calculator states
  const [calcKarat, setCalcKarat] = useState('24K');
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcForm, setCalcForm] = useState('jewelry');
  const [calcCurrency, setCalcCurrency] = useState('KWD');
  const [calcMfgKd, setCalcMfgKd] = useState(0);

  // Custom Design Studio states
  const [designStep, setDesignStep] = useState(0);
  const [designType, setDesignType] = useState('ring');
  const [designColor, setDesignColor] = useState('yellow');
  const [designKarat, setDesignKarat] = useState('21K');
  const [designStone, setDesignStone] = useState('none');
  const [designEngraving, setDesignEngraving] = useState('');
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [designWeight, setDesignWeight] = useState(10);
  const [designWhatsapp, setDesignWhatsapp] = useState('');
  const [designSaved, setDesignSaved] = useState(false);

  const designTypes = [
    { key: 'ring', label: 'عقد', icon: '/design-types/ring.png', base: 800, weight: '3-8 جرام' },
    { key: 'necklace', label: 'أقراط', icon: '/design-types/necklace.png', base: 1200, weight: '15-30 جرام' },
    { key: 'bracelet', label: 'خاتم', icon: '/design-types/bracelet.png', base: 950, weight: '10-25 جرام' },
    { key: 'earrings', label: 'سوار', icon: '/design-types/earrings.png', base: 650, weight: '2-6 جرام' },
  ];

  const designColors = [
    { key: 'yellow', label: 'ذهب أصفر', hex: '#C7A14A', mul: 1.0 },
    { key: 'white', label: 'ذهب أبيض', hex: '#E8E8E8', mul: 1.15 },
    { key: 'rose', label: 'ذهب وردي', hex: '#E8B4B8', mul: 1.1 },
  ];

  const designKarats = [
    { key: '18K', label: '18 عيار', mul: 1.0 },
    { key: '21K', label: '21 عيار', mul: 1.2 },
    { key: '22K', label: '22 عيار', mul: 1.35 },
    { key: '24K', label: '24 عيار', mul: 1.6 },
  ];

  const designStones = [
    { key: 'none', label: 'بدون', price: 0 },
    { key: 'diamond', label: 'الماس', price: 2500 },
    { key: 'emerald', label: 'زمرد', price: 1800 },
    { key: 'ruby', label: 'ياقوت', price: 2000 },
    { key: 'sapphire', label: 'سافير', price: 1900 },
    { key: 'pearl', label: 'لؤلؤ', price: 800 },
  ];

  const designPrice = useMemo(() => {
    const base = designTypes.find(t => t.key === designType)?.base || 800;
    const karatMul = designKarats.find(k => k.key === designKarat)?.mul || 1;
    const pricePerGram = base * karatMul / 10;
    return Math.round(pricePerGram * designWeight);
  }, [designType, designKarat, designWeight]);

  const calcRates: Record<string, { kwd: number; usd: number; sar: number }> = {
    '24K': { kwd: 40.23, usd: 131.2, sar: 491.5 },
    '22K': { kwd: 36.85, usd: 120.2, sar: 450.3 },
    '21K': { kwd: 35.20, usd: 114.8, sar: 430.1 },
    '18K': { kwd: 30.17, usd: 98.4, sar: 368.5 },
  };

  const calcForms = [
    { key: 'bar', label: 'سبيكة', labelEn: 'Bar', icon: '📦', mfg: 0 },
    { key: 'jewelry', label: 'مجوهرات', labelEn: 'Jewelry', icon: '💍', mfg: 0.20 },
    { key: 'coin', label: 'عملة', labelEn: 'Coin', icon: '🪙', mfg: 0.05 },
  ];

  const calcCurrencies = [
    { key: 'KWD', label: 'KD', labelAr: 'دينار' },
    { key: 'USD', label: '$', labelAr: 'دولار' },
    { key: 'SAR', label: 'SR', labelAr: 'ريال' },
  ];

  const calcResult = useMemo(() => {
    const rate = calcRates[calcKarat];
    const priceKey = calcCurrency.toLowerCase() as 'kwd' | 'usd' | 'sar';
    const pricePerGram = rate[priceKey];
    const baseValue = calcWeight * pricePerGram;
    let mfgCost = calcMfgKd;
    if (calcCurrency === 'USD') mfgCost = calcMfgKd * 3.26;
    if (calcCurrency === 'SAR') mfgCost = calcMfgKd * 12.2;
    const totalValue = baseValue + mfgCost;
    const symbol = calcCurrencies.find(c => c.key === calcCurrency)?.label || 'KD';
    return { pricePerGram, baseValue, mfgCost, totalValue, symbol };
  }, [calcKarat, calcWeight, calcForm, calcCurrency, calcMfgKd]);

  const hijabModels = [
    { id: 'hijab-black-1', name: 'سوداء ١', image: '/mannequins/hijab-black-1.png' },
    { id: 'hijab-black-2', name: 'سوداء ٢', image: '/mannequins/hijab-black-2.png' },
    { id: 'hijab-navy', name: 'زرقاء', image: '/mannequins/hijab-navy.png' },
    { id: 'hijab-white', name: 'بيضاء', image: '/mannequins/hijab-white.png' },
  ];

  const tryOnModels: Record<string, string> = {
    necklace: hijabModels.find(m => m.id === selectedModel)?.image || '/mannequins/hijab-black-1.png',
    earring: '/mannequins/face-earring.png',
    ring: '/mannequins/hand-ring.png',
    bracelet: '/mannequins/hand-wrist.png',
    watch: '/mannequins/hand-side.png',
    anklet: '/mannequins/woman-full.png',
    handchain: '/mannequins/hand-front.png',
  };

  const resetTryOn = () => {
    setTryOnItems({});
    setTryOnOffset({ x: 0, y: 0 });
    setTryOnZoom(1);
    setTryOnRotation(0);
  };

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('الصورة يجب أن تكون أقل من 5 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDropPhoto = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('الصورة يجب أن تكون أقل من 5 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const tryOnJewelry = [
    { id: 'n1', name: 'عقد ماسي', cat: 'necklace', image: '/products/necklace.png' },
    { id: 'n2', name: 'عقد فراشات', cat: 'necklace', image: '/products/set-1.png' },

    { id: 'r2', name: 'خاتم ذهب', cat: 'ring', image: '/products/ring-1.png' },
    { id: 'r3', name: 'خاتم ماسي', cat: 'ring', image: '/products/ring-2.png' },
    { id: 'b1', name: 'سوار ذهب', cat: 'bracelet', image: '/products/bracelet.png' },
    { id: 'b2', name: 'سوار كارتير', cat: 'bracelet', image: '/products/bracelet-4.png' },
    { id: 'w1', name: 'ساعة كلاسيكية', cat: 'watch', image: '/products/watch-2.png' },
    { id: 'w2', name: 'ساعة أنيقة', cat: 'watch', image: '/products/watch-3.png' },
    { id: 'w3', name: 'ساعة فاخرة', cat: 'watch', image: '/products/watches-1.png' },
    { id: 'e1', name: 'أقراط لؤلؤ', cat: 'earring', image: '/products/earrings.png' },
    { id: 'a1', name: 'سلسلة كاحل', cat: 'anklet', image: '/products/anklet-1.png' },
    { id: 'h1', name: 'سلسال يد 1', cat: 'handchain', image: '/products/hand-chain-1.png' },
    { id: 'h2', name: 'سلسال يد 2', cat: 'handchain', image: '/products/hand-chain-2.png' },
    { id: 'h3', name: 'سلسال يد 3', cat: 'handchain', image: '/products/hand-chain-3.png' },
    { id: 'h4', name: 'سلسال يد 4', cat: 'handchain', image: '/products/hand-chain-4.png' },
    { id: 'h5', name: 'سلسال يد 5', cat: 'handchain', image: '/products/hand-chain-5.png' },
    { id: 'h6', name: 'سلسال يد 6', cat: 'handchain', image: '/products/hand-chain-6.png' },
    { id: 'h7', name: 'سلسال يد 7', cat: 'handchain', image: '/products/hand-chain-7.jpg' },
    { id: 'h8', name: 'سلسال يد 8', cat: 'handchain', image: '/products/hand-chain-8.jpg' },
    { id: 'h9', name: 'سلسال يد 9', cat: 'handchain', image: '/products/hand-chain-9.jpg' },
  ];

  const tryOnZones: Record<string, { top: string; left: string; width: string; label: string }> = {
    necklace: { top: '25%', left: '50%', width: '30%', label: 'العنق' },
    ring: { top: '65%', left: '20%', width: '15%', label: 'اليد' },
    bracelet: { top: '50%', left: '10%', width: '18%', label: 'الرسغ' },
    watch: { top: '50%', left: '60%', width: '18%', label: 'المعصم' },
    earring: { top: '35%', left: '65%', width: '12%', label: 'الأذن' },
    anklet: { top: '85%', left: '40%', width: '18%', label: 'الكاحل' },
    handchain: { top: '55%', left: '15%', width: '20%', label: 'سلسال يد' },
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('تم الحذف');
  };

  const deleteFromSection = (section: string, index: number) => {
    setUserImages(prev => ({
      ...prev,
      [section]: prev[section].filter((_: string, i: number) => i !== index),
    }));
    showToast('تم الحذف');
  };

  const [editItem, setEditItem] = useState<{ section: string; index: number; name: string; nameEn: string; price: string; image: string } | null>(null);

  const saveEdit = () => {
    if (!editItem) return;
    if (editItem.section === 'products') {
      setProducts(prev => prev.map(p => {
        const idx = prev.indexOf(p);
        return idx === editItem.index ? { ...p, name: editItem.name, nameEn: editItem.nameEn, price: editItem.price } : p;
      }));
    } else {
      setUserImages(prev => ({
        ...prev,
        [editItem.section]: prev[editItem.section].map((img: string, i: number) => i === editItem.index ? editItem.image : img),
      }));
    }
    setEditItem(null);
    showToast('تم التعديل');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewItem({ ...newItem, image: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmAddItem = () => {
    if (!newItem.image || !newItem.name) {
      showToast('يرجى إدخال اسم الصورة واختيار صورة');
      return;
    }
    const newId = Date.now();
    if (addTarget.section === 'products') {
      setProducts([...products, { id: newId, name: newItem.name, nameEn: newItem.nameEn, price: newItem.price, image: newItem.image, section: 'products' }]);
    } else {
      setUserImages(prev => ({
        ...prev,
        [addTarget.section]: [...prev[addTarget.section], newItem.image],
      }));
    }
    setNewItem({ name: '', nameEn: '', price: '', image: '' });
    setShowAddModal(false);
    showToast(`تمت إضافة "${newItem.name}" إلى ${addTarget.sectionAr}`);
  };

  const openAddModal = (section: string, sectionAr: string) => {
    setAddTarget({ section, sectionAr });
    setShowAddModal(true);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground noise-overlay relative" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gold/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left: Hamburger Menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex flex-col gap-[5px] p-2 hover:opacity-70 transition-opacity">
              <span className="block w-5 sm:w-6 h-[1.5px] bg-gold"></span>
              <span className="block w-5 sm:w-6 h-[1.5px] bg-gold"></span>
              <span className="block w-5 sm:w-6 h-[1.5px] bg-gold"></span>
              <span className="block w-3.5 sm:w-4 h-[1.5px] bg-gold"></span>
            </button>

            {/* Center: Nav Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#rings" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">خواتم</span><span className="text-base text-gold/70 font-serif">Rings</span></a>
              <a href="#necklaces" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">قلائد</span><span className="text-base text-gold/70 font-serif">Necklaces</span></a>
              <a href="#sets" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">أطقم</span><span className="text-base text-gold/70 font-serif">Sets</span></a>
              <a href="#bracelets" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">أساور</span><span className="text-base text-gold/70 font-serif">Bracelets</span></a>
              <a href="#earrings2" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">أقراط</span><span className="text-base text-gold/70 font-serif">Earrings</span></a>
              <a href="#watches" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">ساعات</span><span className="text-base text-gold/70 font-serif">Watches</span></a>
              <a href="#chairs" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">كراسي</span><span className="text-base text-gold/70 font-serif">Chairs</span></a>
              <a href="#handchain" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">سلسال يد</span><span className="text-base text-gold/70 font-serif">Hand Chain</span></a>
              <a href="#gift-wrapping" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">تغليف</span><span className="text-base text-gold/70 font-serif">Gift</span></a>
              <a href="#try-on" className="flex flex-col items-center text-gold hover:text-gold-light transition-colors font-bold"><span className="text-base">تجربة</span><span className="text-base text-gold/70 font-serif">Try On</span></a>
              <a href="#outfit" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">تنسيق</span><span className="text-base text-gold/70 font-serif">Outfit</span></a>
              <a href="#calculator" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">حاسبة</span><span className="text-base text-gold/70 font-serif">Calc</span></a>
              <a href="#custom" className="flex flex-col items-center text-foreground/70 hover:text-gold transition-colors"><span className="text-base">تصميم</span><span className="text-base text-gold/70 font-serif">Design</span></a>
            </div>

            {/* Right: Logo + Icons */}
            <div className="flex items-center gap-6">
              <a href="/" className="flex flex-col items-center leading-none">
                <span className="brand-logo font-serif text-xl tracking-[0.15em] font-semibold">بيت الذهب</span>
                <span className="text-gold/60 text-[9px] tracking-[0.35em] uppercase font-serif">Jewellery</span>
              </a>
              <button className="p-2 hover:text-gold transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              <button className="p-2 hover:text-gold transition-colors relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-0 left-0 w-80 bg-background/98 backdrop-blur-md border-r border-gold/10 p-8 pt-20 space-y-6 z-50">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 p-2">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-6">
              <span className="text-gold/40 text-[10px] tracking-[0.3em] uppercase">التصنيفات</span>
            </div>
            <a href="#watches" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">ساعات <span className="text-gold/40 text-[10px] font-serif">Watches</span></a>
            <a href="#chairs" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">كراسي <span className="text-gold/40 text-[10px] font-serif">Chairs</span></a>
            <a href="#handchain" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">سلسال يد <span className="text-gold/40 text-[10px] font-serif">Hand Chain</span></a>
            <a href="#gift-wrapping" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">تغليف فاخر <span className="text-gold/40 text-[10px] font-serif">Gift Wrapping</span></a>
            <a href="#rings" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">خواتم <span className="text-gold/40 text-[10px] font-serif">Rings</span></a>
            <a href="#necklaces" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">قلائد <span className="text-gold/40 text-[10px] font-serif">Necklaces</span></a>
            <a href="#sets" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">أطقم <span className="text-gold/40 text-[10px] font-serif">Sets</span></a>
            <a href="#bracelets" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">أساور <span className="text-gold/40 text-[10px] font-serif">Bracelets</span></a>
            <a href="#earrings2" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/80 hover:text-gold text-sm transition-colors">أقراط <span className="text-gold/40 text-[10px] font-serif">Earrings</span></a>
            <a href="#try-on" className="block text-gold hover:text-gold-light text-sm font-bold mt-2" onClick={() => setMobileMenuOpen(false)}>تجربة المجوهرات <span className="text-gold/40 text-[10px] font-serif">Try On</span></a>
            <a href="#outfit" className="block text-foreground/80 hover:text-gold text-sm transition-colors mt-2" onClick={() => setMobileMenuOpen(false)}>تنسيق الإطلالة <span className="text-gold/40 text-[10px] font-serif">Outfit</span></a>
            <a href="#calculator" className="block text-foreground/80 hover:text-gold text-sm transition-colors mt-2" onClick={() => setMobileMenuOpen(false)}>حاسبة الذهب <span className="text-gold/40 text-[10px] font-serif">Calculator</span></a>
            <a href="#custom" className="block text-foreground/80 hover:text-gold text-sm transition-colors mt-2" onClick={() => setMobileMenuOpen(false)}>تصاميم خاصة <span className="text-gold/40 text-[10px] font-serif">Custom Design</span></a>
            <div className="border-t border-gold/10 pt-4 mt-4 space-y-4">
              <span className="text-gold/40 text-[10px] tracking-[0.3em] uppercase font-serif">روابط</span>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/60 hover:text-gold text-sm">عن بيت الذهب <span className="text-gold/30 text-[10px] font-serif">About</span></a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-foreground/60 hover:text-gold text-sm">تواصل معنا <span className="text-gold/30 text-[10px] font-serif">Contact</span></a>
            </div>
          </div>
        )}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden bg-background border-b border-gold/10">
        <div className="relative z-10 text-center px-4 sm:px-6 pt-6 sm:pt-8">
          <div className="flex justify-center mb-4 relative">
              <img src="/logo.png" alt="بيت الذهب" className="w-64 sm:w-80 md:w-[28rem] lg:w-[40rem] h-auto" />
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-gold/60 to-transparent" />
            <div className="w-1.5 h-1.5 bg-gold/60 rounded-full" />
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-gold/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative py-6 border-y border-gold/10 overflow-hidden bg-surface/40">
        <div className="flex whitespace-nowrap marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 text-gold/50 text-lg tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-gold/40 rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Gold Prices Ticker */}
      <div className="relative py-4 border-b border-gold/10 overflow-hidden bg-black">
        <div className="flex whitespace-nowrap marquee-track" style={{ animationDuration: '35s' }}>
          {[...goldPriceItems, ...goldPriceItems, ...goldPriceItems].map((item, i) => (
            <span key={i} className="mx-6 text-white/70 text-sm tracking-wide flex items-center gap-2">
              <span className="text-gold text-xs">◆</span>
              <span>{item.label}</span>
              <span className="text-white font-bold">{item.value}</span>
              <span className="text-white/40 text-xs">KD</span>
            </span>
          ))}
        </div>
      </div>

      {/* Products */}
      <section id="products" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">المنتجات</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">تشكيلتنا الفاخرة</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...products, ...userImages.products.map((img, i) => ({ id: 5001 + i, name: 'منتج جديد', nameEn: 'New Product', price: '---', image: img }))].map((product, i) => (
              <div key={product.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className={`aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative ${product.id === 2 ? 'hide-ai-text' : ''}`} onClick={() => setLightbox({ src: product.image, alt: product.name })}>
                  <img src={product.image} alt={product.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditItem({ section: 'products', index: i, name: product.name, nameEn: product.nameEn, price: product.price, image: product.image }); }} className="w-7 h-7 bg-blue-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-400">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }} className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-400">✕</button>
                  </div>
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{product.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{product.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
                <button onClick={(e) => { e.stopPropagation(); const cat = product.nameEn.toLowerCase().includes('watch') ? 'watch' : product.nameEn.toLowerCase().includes('ring') ? 'ring' : product.nameEn.toLowerCase().includes('earring') ? 'earring' : product.nameEn.toLowerCase().includes('bracelet') || product.nameEn.toLowerCase().includes('bangle') ? 'bracelet' : product.nameEn.toLowerCase().includes('anklet') ? 'anklet' : 'necklace'; setTryOnCategory(cat); setTryOnItems(prev => ({ ...prev, [cat]: product.image })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="mt-3 w-full py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold hover:text-background transition-all font-bold">جربي افتراضياً</button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={() => openAddModal('products', 'المنتجات')} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              إضافة منتج جديد
            </button>
          </div>
        </div>
      </section>

      {/* Rings */}
      <section id="rings" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Rings / خواتم</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">خواتم فاخرة</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { id: 402, name: 'خاتم ذهب', nameEn: 'Gold Ring', price: '---', image: '/products/ring-1.png' },
              { id: 403, name: 'خاتم ماسي', nameEn: 'Diamond Ring', price: '---', image: '/products/ring-2.png' },
              { id: 410, name: 'خاتم 10', nameEn: 'Ring 10', price: '---', image: '/products/ring-10.jpg' },
              { id: 411, name: 'خاتم 11', nameEn: 'Ring 11', price: '---', image: '/products/ring-11.jpg' },
              { id: 412, name: 'خاتم 12', nameEn: 'Ring 12', price: '---', image: '/products/ring-12.jpg' },
              { id: 413, name: 'خاتم 13', nameEn: 'Ring 13', price: '---', image: '/products/ring-13.jpg' },
              { id: 414, name: 'خاتم 14', nameEn: 'Ring 14', price: '---', image: '/products/ring-14.jpg' },
              { id: 415, name: 'خاتم 15', nameEn: 'Ring 15', price: '---', image: '/products/ring-15.jpg' },
              { id: 416, name: 'خاتم 16', nameEn: 'Ring 16', price: '---', image: '/products/ring-16.jpg' },
              { id: 417, name: 'خاتم 17', nameEn: 'Ring 17', price: '---', image: '/products/ring-17.jpg' },
              { id: 418, name: 'خاتم 18', nameEn: 'Ring 18', price: '---', image: '/products/ring-18.jpg' },
              { id: 419, name: 'خاتم 19', nameEn: 'Ring 19', price: '---', image: '/products/ring-19.jpg' },
              { id: 420, name: 'خاتم 20', nameEn: 'Ring 20', price: '---', image: '/products/ring-20.jpg' },
              { id: 421, name: 'خاتم 21', nameEn: 'Ring 21', price: '---', image: '/products/ring-21.jpg' },
              { id: 422, name: 'خاتم 22', nameEn: 'Ring 22', price: '---', image: '/products/ring-22.jpg' },
              { id: 423, name: 'خاتم 23', nameEn: 'Ring 23', price: '---', image: '/products/ring-23.jpg' },
              { id: 424, name: 'خاتم 24', nameEn: 'Ring 24', price: '---', image: '/products/ring-24.jpg' },
              { id: 425, name: 'خاتم 25', nameEn: 'Ring 25', price: '---', image: '/products/ring-25.jpg' },
              { id: 426, name: 'خاتم 26', nameEn: 'Ring 26', price: '---', image: '/products/ring-26.jpg' },
              { id: 427, name: 'خاتم 27', nameEn: 'Ring 27', price: '---', image: '/products/ring-27.jpg' },
              { id: 428, name: 'خاتم 28', nameEn: 'Ring 28', price: '---', image: '/products/ring-28.jpg' },
              ...userImages.products.map((img, i) => ({ id: 4100 + i, name: 'خاتم جديد', nameEn: 'New Ring', price: '---', image: img }))
            ].map((item, i) => (
              <div key={item.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className="aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative" onClick={() => setLightbox({ src: item.image, alt: item.name })}>
                  <img src={item.image} alt={item.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditItem({ section: 'rings', index: i, name: item.name, nameEn: item.nameEn, price: item.price, image: item.image }); }} className="w-7 h-7 bg-blue-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-400">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); if (i >= 21) deleteFromSection('rings', i - 21); }} className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-400">✕</button>
                  </div>
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{item.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{item.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
                <button onClick={(e) => { e.stopPropagation(); setTryOnCategory('ring'); setTryOnItems(prev => ({ ...prev, ring: item.image })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="mt-3 w-full py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold hover:text-background transition-all font-bold">جربي هذا الخاتم</button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={() => openAddModal('rings', 'الخواتم')} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              إضافة خاتم جديد
            </button>
          </div>
        </div>
      </section>

      {/* Sets */}
      <section id="sets" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Sets / أطقم</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">أطقم مجوهرات فاخرة</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[{ id: 108, name: 'طقم كامل 3', nameEn: 'Full Set 3', price: '---', image: '/products/set-7.png' },
              { id: 109, name: 'طقم كامل 4', nameEn: 'Full Set 4', price: '---', image: '/products/set-8.png' },
              { id: 110, name: 'طقم كامل 5', nameEn: 'Full Set 5', price: '---', image: '/products/set-9.png' },
              { id: 111, name: 'طقم كامل 6', nameEn: 'Full Set 6', price: '---', image: '/products/set-10.png' },
              { id: 112, name: 'طقم كامل 7', nameEn: 'Full Set 7', price: '---', image: '/products/set-11.png' },
              { id: 113, name: 'طقم 10', nameEn: 'Set 10', price: '---', image: '/products/set-12.jpg' },
              { id: 114, name: 'طقم 11', nameEn: 'Set 11', price: '---', image: '/products/set-13.jpg' },
              { id: 115, name: 'طقم 12', nameEn: 'Set 12', price: '---', image: '/products/set-14.jpg' },
              { id: 116, name: 'طقم 13', nameEn: 'Set 13', price: '---', image: '/products/set-15.jpg' },
              { id: 117, name: 'طقم 14', nameEn: 'Set 14', price: '---', image: '/products/set-16.jpg' },
              { id: 118, name: 'طقم 15', nameEn: 'Set 15', price: '---', image: '/products/set-17.jpg' },
              { id: 119, name: 'طقم 16', nameEn: 'Set 16', price: '---', image: '/products/set-18.jpg' },
            ...userImages.sets.map((img, i) => ({ id: 6001 + i, name: 'طقم جديد', nameEn: 'New Set', price: '---', image: img }))].map((item, i) => (
              <div key={item.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className="aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative" onClick={() => setLightbox({ src: item.image, alt: item.name })}>
                  <img src={item.image} alt={item.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditItem({ section: 'sets', index: i, name: item.name, nameEn: item.nameEn, price: item.price, image: item.image }); }} className="w-7 h-7 bg-blue-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-400">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); deleteFromSection('sets', i); }} className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-400">✕</button>
                  </div>
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{item.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{item.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
                <button onClick={(e) => { e.stopPropagation(); setTryOnCategory('necklace'); setTryOnItems(prev => ({ ...prev, necklace: item.image })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="mt-3 w-full py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold hover:text-background transition-all font-bold">جربي هذا الطقم</button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={() => openAddModal('sets', 'الأطقم')} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              إضافة طقم جديد
            </button>
          </div>
        </div>
      </section>

      {/* Watches */}
      <section id="watches" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Watches / ساعات</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">ساعات فاخرة</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { id: 501, name: 'ساعة كلاسيكية', nameEn: 'Classic Watch', price: '---', image: '/products/watch-2.png' },
              { id: 502, name: 'ساعة أنيقة', nameEn: 'Elegant Watch', price: '---', image: '/products/watch-3.png' },
              { id: 503, name: 'ساعة فاخرة', nameEn: 'Luxury Watch', price: '---', image: '/products/watches-1.png' },
              { id: 504, name: 'ساعة 10', nameEn: 'Watch 10', price: '---', image: '/products/watch-4.jpg' },
              { id: 505, name: 'ساعة 11', nameEn: 'Watch 11', price: '---', image: '/products/watch-5.jpg' },
              { id: 506, name: 'ساعة 12', nameEn: 'Watch 12', price: '---', image: '/products/watch-6.jpg' },
              { id: 507, name: 'ساعة 15', nameEn: 'Watch 15', price: '---', image: '/products/watch-7.jpg' },
              { id: 508, name: 'ساعة 20', nameEn: 'Watch 20', price: '---', image: '/products/watch-8.jpg' },
              { id: 509, name: 'ساعة 21', nameEn: 'Watch 21', price: '---', image: '/products/watch-9.jpg' },
              { id: 510, name: 'ساعة 22', nameEn: 'Watch 22', price: '---', image: '/products/watch-10.jpg' },
              { id: 511, name: 'ساعة 23', nameEn: 'Watch 23', price: '---', image: '/products/watch-11.jpg' },
              { id: 512, name: 'ساعة 24', nameEn: 'Watch 24', price: '---', image: '/products/watch-12.jpg' },
              { id: 513, name: 'ساعة 25', nameEn: 'Watch 25', price: '---', image: '/products/watch-13.jpg' },
              { id: 514, name: 'ساعة 26', nameEn: 'Watch 26', price: '---', image: '/products/watch-14.jpg' },
              ...userImages.watches.map((img, i) => ({ id: 7001 + i, name: 'ساعة جديدة', nameEn: 'New Watch', price: '---', image: img }))
            ].map((watch, i) => (
              <div key={watch.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className="aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative" onClick={() => setLightbox({ src: watch.image, alt: watch.name })}>
                  <img src={watch.image} alt={watch.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditItem({ section: 'watches', index: i - 6, name: watch.name, nameEn: watch.nameEn, price: watch.price, image: watch.image }); }} className="w-7 h-7 bg-blue-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-400">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); if (i >= 14) deleteFromSection('watches', i - 14); }} className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-400">✕</button>
                  </div>
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{watch.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{watch.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
                <button onClick={(e) => { e.stopPropagation(); setTryOnCategory('watch'); setTryOnItems(prev => ({ ...prev, watch: watch.image })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="mt-3 w-full py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold hover:text-background transition-all font-bold">جربي هذه الساعة</button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={() => openAddModal('watches', 'الساعات')} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              إضافة ساعة جديدة
            </button>
          </div>
        </div>
      </section>

      {/* Outfit Matching */}
      <section id="outfit" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Outfit Matching / تنسيق الإطلالة</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold mb-3">نسّق إطلالتك مع مجوهراتنا</h3>
            <p className="text-foreground/50 text-xs sm:text-sm">ارفعي صورة إطلالتك واختاري المناسبة وسنوصيكي بأفضل القطع</p>
          </div>

          {!outfitResults && !outfitLoading ? (
            <div className="bg-surface-2/50 border border-gold/10 rounded-3xl p-6 sm:p-8 md:p-12 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                </div>
                <h4 className="text-gold font-bold text-lg mb-2">ابدئي برفع صورة إطلالتك</h4>
                <p className="text-foreground/40 text-xs">سنوافيكي أفضل المجوهرات المناسبة لإطلالتك</p>
              </div>

              <div className="space-y-5">
                {/* Upload outfit image */}
                <div>
                  <label className="block text-gold/60 text-xs mb-2">صورة الإطلالة</label>
                  <div className="flex items-center gap-3">
                    {outfitImage && (
                      <div className="w-16 h-16 rounded-xl bg-cover bg-center border border-gold/20 shrink-0" style={{ backgroundImage: `url(${outfitImage})` }} />
                    )}
                    <label className="flex-1 flex items-center justify-center h-12 rounded-xl bg-background/40 border border-dashed border-gold/30 cursor-pointer hover:border-gold/60 transition-all">
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { const reader = new FileReader(); reader.onload = (ev) => setOutfitImage(ev.target?.result as string); reader.readAsDataURL(file); }
                      }} className="hidden" />
                      <span className="text-gold/60 text-xs">{outfitImage ? 'تغيير الصورة' : 'ارفعي صورة الإطلالة'}</span>
                    </label>
                  </div>
                </div>

                {/* Occasion selector */}
                <div>
                  <label className="block text-gold/60 text-xs mb-2">المناسبة</label>
                  <div className="grid grid-cols-3 gap-2">
                    {outfitOccasions.map(occ => (
                      <button key={occ.key} onClick={() => setOutfitOccasion(occ.key)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${outfitOccasion === occ.key ? 'bg-gold text-background' : 'bg-background/40 border border-gold/10 text-foreground/60 hover:border-gold/30'}`}>
                        {occ.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Match button */}
                <button onClick={handleOutfitMatch} className="w-full py-3 rounded-xl bg-gold text-background font-bold text-sm hover:bg-gold-light transition-all">
                  طابقي إطلالتي
                </button>
              </div>
            </div>
          ) : outfitLoading ? (
            <div className="bg-surface-2/50 border border-gold/10 rounded-3xl p-12 text-center max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full border-2 border-gold border-t-transparent animate-spin" />
              <p className="text-gold font-bold text-lg mb-1">جاري المطابقة...</p>
              <p className="text-foreground/40 text-xs">نبحث عن أفضل القطع لإطلالتك</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-gold/40 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-gold/60 animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          ) : (
            <div>
              {/* Results header */}
              <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div>
                  <h4 className="text-gold font-bold text-sm">أفضل القطع لإطلالتك</h4>
                  <p className="text-foreground/40 text-xs">{outfitOccasions.find(o => o.key === outfitOccasion)?.label}</p>
                </div>
                <button onClick={() => { setOutfitResults(null); setOutfitImage(null); }} className="px-4 py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold/10 transition-all">إعادة</button>
              </div>

              {/* Results grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {outfitResults?.map((item, i) => (
                  <div key={i} className="group bg-surface-2/50 border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-300">
                    <div className="aspect-square bg-background/40 overflow-hidden flex items-center justify-center">
                      <img src={item.image} alt={item.nameAr} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gold/40 text-[10px]">{item.typeAr}</p>
                          <h5 className="text-foreground font-bold text-sm">{item.nameAr}</h5>
                          <p className="text-foreground/40 text-[10px] font-serif">{item.name}</p>
                        </div>
                        <span className="text-gold font-bold text-sm">اتصل بالسعر</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-gold/10">
                        <div className="flex-1 h-1.5 bg-background/60 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" style={{ width: `${item.score}%` }} />
                        </div>
                        <span className="text-gold/60 text-[10px]">{item.score}% مطابقة</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Uploaded outfit preview */}
              {outfitImage && (
                <div className="mt-6 bg-surface-2/50 border border-gold/10 rounded-2xl p-5">
                  <h5 className="text-gold font-bold text-xs mb-3">إطلالتك المرفوعة</h5>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-background/40 border border-gold/10 bg-cover bg-center" style={{ backgroundImage: `url(${outfitImage})` }} />
                    <span className="text-foreground/40 text-xs">تم رفع الصورة</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Gold Calculator */}
      <section id="calculator" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Gold Calculator / حاسبة الذهب</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold mb-3">احسبي قيمة ذهبك</h3>
            <p className="text-foreground/50 text-xs sm:text-sm">اختاري العيار والوزن والشكل وسترين القيمة فوراً</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-2 bg-surface-2/50 border border-gold/10 rounded-2xl p-4 sm:p-6">
              <h4 className="text-gold font-bold text-sm mb-1">بيانات الاستثمار</h4>
              <p className="text-foreground/40 text-xs mb-6">اختاري العيار والوزن والشكل</p>

              <div className="space-y-5">
                {/* Karat */}
                <div>
                  <label className="block text-gold/60 text-xs mb-2">عيار الذهب</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(calcRates).map(k => (
                      <button key={k} onClick={() => setCalcKarat(k)}
                        className={`py-2.5 rounded-lg text-xs font-bold transition-all ${calcKarat === k ? 'bg-gold text-background' : 'bg-background/40 border border-gold/10 text-gold/60 hover:border-gold/30'}`}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-gold/60 text-xs mb-2">الوزن (جرام)</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCalcWeight(w => Math.max(0.5, w - 0.5))}
                      className="w-10 h-10 rounded-lg bg-background/40 border border-gold/10 text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-sm font-bold">−</button>
                    <input type="number" value={calcWeight} onChange={e => setCalcWeight(Math.max(0.5, parseFloat(e.target.value) || 0.5))} step="0.5" min="0.5"
                      className="flex-1 text-center bg-background/40 border border-gold/10 rounded-lg px-3 py-2.5 text-gold font-bold text-sm focus:outline-none focus:border-gold/50" />
                    <button onClick={() => setCalcWeight(w => Math.min(10000, w + 0.5))}
                      className="w-10 h-10 rounded-lg bg-background/40 border border-gold/10 text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-sm font-bold">+</button>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[5, 10, 50, 100, 500].map(v => (
                      <button key={v} onClick={() => setCalcWeight(v)}
                        className="flex-1 py-1.5 rounded text-[10px] text-gold/50 border border-gold/10 hover:border-gold/30 hover:text-gold transition-all">{v}g</button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <div>
                  <label className="block text-gold/60 text-xs mb-2">الشكل</label>
                  <div className="grid grid-cols-3 gap-2">
                    {calcForms.map(f => (
                      <button key={f.key} onClick={() => { setCalcForm(f.key); setCalcMfgKd(f.key === 'jewelry' ? 5 : f.key === 'coin' ? 2 : 0); }}
                        className={`p-3 rounded-xl text-center transition-all ${calcForm === f.key ? 'bg-gold/10 border border-gold' : 'bg-background/40 border border-gold/10 hover:border-gold/30'}`}>
                        <span className="text-xl block mb-1">{f.icon}</span>
                        <p className="text-[10px] text-gold font-bold">{f.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Manufacturing Cost in KD */}
                <div>
                  <label className="block text-gold/60 text-xs mb-2">المصنعية (KD)</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCalcMfgKd(p => Math.max(0, p - 0.5))}
                      className="w-10 h-10 rounded-lg bg-background/40 border border-gold/10 text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-sm font-bold">−</button>
                    <input type="number" value={calcMfgKd} onChange={e => setCalcMfgKd(Math.max(0, parseFloat(e.target.value) || 0))} step="0.5" min="0"
                      className="flex-1 text-center bg-background/40 border border-gold/10 rounded-lg px-3 py-2.5 text-gold font-bold text-sm focus:outline-none focus:border-gold/50" />
                    <button onClick={() => setCalcMfgKd(p => p + 0.5)}
                      className="w-10 h-10 rounded-lg bg-background/40 border border-gold/10 text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-sm font-bold">+</button>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[0, 1, 2, 5, 10, 15, 20].map(v => (
                      <button key={v} onClick={() => setCalcMfgKd(v)}
                        className="flex-1 py-1.5 rounded text-[10px] text-gold/50 border border-gold/10 hover:border-gold/30 hover:text-gold transition-all">{v}</button>
                    ))}
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-gold/60 text-xs mb-2">العملة</label>
                  <div className="flex gap-2">
                    {calcCurrencies.map(c => (
                      <button key={c.key} onClick={() => setCalcCurrency(c.key)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${calcCurrency === c.key ? 'bg-gold text-background' : 'bg-background/40 border border-gold/10 text-gold/60 hover:border-gold/30'}`}>
                        {c.label} <span className="text-[9px] font-normal opacity-60">{c.labelAr}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-3 space-y-4">
              {/* Price per gram */}
              <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5">
                <p className="text-gold/50 text-[10px] mb-1">سعر الجرام الحالي</p>
                <p className="text-2xl font-bold text-gold">{calcResult.symbol} {calcResult.pricePerGram.toFixed(3)}</p>
                <p className="text-foreground/40 text-[10px]">{calcKarat} ذهب</p>
              </div>

              {/* Base value */}
              <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5">
                <p className="text-gold/50 text-[10px] mb-1">قيمة الذهب النقية</p>
                <p className="text-2xl font-bold text-gold">{calcResult.symbol} {calcResult.baseValue.toFixed(3)}</p>
                <p className="text-foreground/40 text-[10px]">{calcWeight}g × {calcResult.symbol}{calcResult.pricePerGram.toFixed(3)}</p>
              </div>

              {/* Manufacturing cost */}
              {calcMfgKd > 0 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5">
                  <p className="text-gold/50 text-[10px] mb-1">المصنعية</p>
                  <p className="text-2xl font-bold text-gold">+{calcResult.symbol} {calcResult.mfgCost.toFixed(3)}</p>
                </div>
              )}

              {/* Total */}
              <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/30 rounded-2xl p-6">
                <p className="text-gold/50 text-[10px] mb-1">القيمة الإجمالية</p>
                <p className="text-3xl font-bold text-gold">{calcResult.symbol} {calcResult.totalValue.toFixed(3)}</p>
                <p className="text-foreground/40 text-[10px]">{calcKarat} · {calcForms.find(f => f.key === calcForm)?.label} · {calcWeight}g</p>
              </div>

              {/* Rate Table */}
              <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5">
                <h5 className="text-gold font-bold text-xs mb-3">مرجع أسعار الذهب (للغرام)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gold/10">
                        <th className="text-right py-2 text-gold/50 font-bold">العيار</th>
                        <th className="text-right py-2 text-gold/50 font-bold">KD</th>
                        <th className="text-right py-2 text-gold/50 font-bold">$</th>
                        <th className="text-right py-2 text-gold/50 font-bold">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(calcRates).map(([karat, data]) => (
                        <tr key={karat} className="border-b border-gold/5">
                          <td className="py-2 text-gold font-bold">{karat}</td>
                          <td className="py-2 text-foreground/60 text-right">{data.kwd.toFixed(3)}</td>
                          <td className="py-2 text-foreground/60 text-right">{data.usd.toFixed(2)}</td>
                          <td className="py-2 text-foreground/60 text-right">{data.sar.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-foreground/30 text-[9px] mt-2 text-center">الأسعار تقريبية وقابلة للتغيير</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Design Studio */}
      <section id="custom" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Custom Design / تصاميم خاصة</span>
            <h3 className="font-body text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold mb-3">صممي قطعتك الفريدة بنفسك</h3>
            <p className="text-foreground/50 text-xs sm:text-sm">اختاري التفاصيل وسنحول تصميمك لواقع</p>
          </div>

          {/* Step Progress */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2">
            {['النوع', 'الوزن', 'العيار', 'النقش', 'صورة التصميم', 'رقم الوتساب', 'الملخص'].map((step, i) => (
              <div key={i} className="flex items-center">
                <button onClick={() => setDesignStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${designStep === i ? 'bg-gold text-background' : designStep > i ? 'bg-gold/20 text-gold' : 'bg-surface-2/50 text-foreground/40 border border-gold/10'}`}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{designStep > i ? '✓' : i + 1}</span>
                  <span className="hidden sm:inline">{step}</span>
                </button>
                {i < 6 && <div className={`w-6 h-px mx-1 ${designStep > i ? 'bg-gold' : 'bg-gold/10'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Steps Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Type */}
              {designStep === 0 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6">
                  <h4 className="text-gold font-bold text-lg mb-1">اختاري نوع القطعة</h4>
                  <p className="text-foreground/40 text-xs mb-6">ما الذي تبحثين عنه؟</p>
                  <div className="grid grid-cols-2 gap-4">
                    {designTypes.map(t => (
                      <button key={t.key} onClick={() => setDesignType(t.key)}
                        className={`p-6 rounded-2xl text-center transition-all ${designType === t.key ? 'border-2 border-gold bg-background' : 'border-2 border-gold/10 hover:border-gold/30 bg-background'}`}>
                        <img src={t.icon} alt={t.label} className="w-48 h-48 mx-auto mb-4 rounded-xl object-contain" />
                        <p className="text-gold font-bold text-lg">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Weight */}
              {designStep === 1 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6">
                  <h4 className="text-gold font-bold text-lg mb-1">الوزن التقريبي</h4>
                  <p className="text-foreground/40 text-xs mb-6">حددي الوزن الأقصى للقطعة بالجرام</p>
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setDesignWeight(w => Math.max(1, w - 1))}
                      className="w-12 h-12 rounded-xl bg-background/40 border border-gold/10 text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-lg font-bold">−</button>
                    <div className="flex-1 text-center">
                      <input type="number" value={designWeight} onChange={e => setDesignWeight(Math.max(1, parseInt(e.target.value) || 1))} min="1"
                        className="w-full text-center bg-background/40 border border-gold/10 rounded-xl px-4 py-3 text-gold font-bold text-2xl focus:outline-none focus:border-gold/50" />
                      <p className="text-foreground/40 text-xs mt-1">جرام</p>
                    </div>
                    <button onClick={() => setDesignWeight(w => Math.min(200, w + 1))}
                      className="w-12 h-12 rounded-xl bg-background/40 border border-gold/10 text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-lg font-bold">+</button>
                  </div>
                  <div className="flex gap-2">
                    {[5, 10, 15, 20, 30, 50].map(v => (
                      <button key={v} onClick={() => setDesignWeight(v)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-gold/50 border border-gold/10 hover:border-gold/30 hover:text-gold transition-all">{v}g</button>
                    ))}
                  </div>
                  <p className="text-gold/30 text-[10px] mt-4 text-center">الوزن المعتاد: {designTypes.find(t => t.key === designType)?.weight}</p>
                </div>
              )}

              {/* Step 3: Karat */}
              {designStep === 2 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6">
                  <h4 className="text-gold font-bold text-lg mb-1">اختر العيار</h4>
                  <p className="text-foreground/40 text-xs mb-6">نقاء الذهب</p>
                  <div className="grid grid-cols-2 gap-3">
                    {designKarats.map(k => (
                      <button key={k.key} onClick={() => setDesignKarat(k.key)}
                        className={`p-5 rounded-2xl text-left transition-all ${designKarat === k.key ? 'bg-gold/10 border-2 border-gold' : 'bg-background/40 border-2 border-gold/10 hover:border-gold/30'}`}>
                        <p className="text-2xl font-bold text-gold">{k.key}</p>
                        <p className="text-foreground/40 text-xs">{k.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Engraving */}
              {designStep === 3 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6">
                  <h4 className="text-gold font-bold text-lg mb-1">النقش</h4>
                  <p className="text-foreground/40 text-xs mb-6">اختياري — اكتبي ما تريده</p>
                  <input type="text" value={designEngraving} onChange={e => setDesignEngraving(e.target.value.slice(0, 20))}
                    placeholder="اكتبي النقش هنا..."
                    className="w-full bg-background/40 border border-gold/10 rounded-xl px-4 py-3 text-gold text-sm focus:outline-none focus:border-gold/50 text-center" />
                  <p className="text-foreground/30 text-[10px] mt-2 text-center">{designEngraving.length}/20 حرف</p>
                </div>
              )}

              {/* Step 5: Upload Design Image */}
              {designStep === 4 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6">
                  <h4 className="text-gold font-bold text-lg mb-1">صورة التصميم</h4>
                  <p className="text-foreground/40 text-xs mb-6">ارفعي صورة التصميم الذي تريدينه</p>
                  <label className="block cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setDesignImage(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                    {designImage ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-gold">
                        <img src={designImage} alt="تصميمك" className="w-full h-64 object-contain bg-background/40" />
                        <div className="absolute top-2 left-2 bg-gold text-background px-3 py-1 rounded-full text-xs font-bold">تم الرفع ✓</div>
                        <div className="absolute bottom-2 right-2 bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-500" onClick={e => { e.preventDefault(); setDesignImage(null); }}>حذف</div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gold/30 rounded-2xl p-12 text-center hover:border-gold/60 transition-all">
                        <span className="text-4xl block mb-3">📸</span>
                        <p className="text-gold font-bold text-sm mb-1">اضغطي لرفع الصورة</p>
                        <p className="text-foreground/30 text-[10px]">JPG, PNG — حد أقصى 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              )}

              {/* Step 6: WhatsApp */}
              {designStep === 5 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6">
                  <h4 className="text-gold font-bold text-lg mb-1">رقم الوتساب</h4>
                  <p className="text-foreground/40 text-xs mb-6">اتركي رقمك وسنتواصل معك بعد دراسة الطلب</p>
                  <div className="flex items-center gap-3">
                    <span className="text-gold font-bold text-lg">+965</span>
                    <input type="tel" value={designWhatsapp} onChange={e => setDesignWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      placeholder="XXXXXXXX"
                      className="flex-1 bg-background/40 border border-gold/10 rounded-xl px-4 py-3 text-gold text-sm focus:outline-none focus:border-gold/50" dir="ltr" />
                  </div>
                  <p className="text-foreground/30 text-[10px] mt-3 text-center">سيتم التواصل معك عبر الوتساب خلال 24 ساعة</p>
                </div>
              )}

              {/* Step 7: Summary */}
              {designStep === 6 && (
                <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6">
                  <h4 className="text-gold font-bold text-lg mb-4">ملخص التصميم</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-background/40 rounded-xl px-4 py-3">
                      <span className="text-foreground/60 text-sm">النوع</span>
                      <span className="text-gold font-bold flex items-center gap-2">
                        <img src={designTypes.find(t => t.key === designType)?.icon} alt="" className="w-6 h-6 rounded object-cover" />
                        {designTypes.find(t => t.key === designType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-background/40 rounded-xl px-4 py-3">
                      <span className="text-foreground/60 text-sm">الوزن</span>
                      <span className="text-gold font-bold">{designWeight} جرام</span>
                    </div>
                    <div className="flex justify-between items-center bg-background/40 rounded-xl px-4 py-3">
                      <span className="text-foreground/60 text-sm">العيار</span>
                      <span className="text-gold font-bold">{designKarat}</span>
                    </div>
                    {designEngraving && (
                      <div className="flex justify-between items-center bg-background/40 rounded-xl px-4 py-3">
                        <span className="text-foreground/60 text-sm">النقش</span>
                        <span className="text-gold font-bold italic">"{designEngraving}"</span>
                      </div>
                    )}
                    {designImage && (
                      <div className="bg-background/40 rounded-xl px-4 py-3">
                        <p className="text-foreground/60 text-sm mb-2">صورة التصميم</p>
                        <img src={designImage} alt="تصميمك" className="w-full h-40 object-contain rounded-lg" />
                      </div>
                    )}
                    {designWhatsapp && (
                      <div className="flex justify-between items-center bg-background/40 rounded-xl px-4 py-3">
                        <span className="text-foreground/60 text-sm">الوتساب</span>
                        <span className="text-gold font-bold" dir="ltr">+965 {designWhatsapp}</span>
                      </div>
                    )}
                   </div>
                  <button onClick={() => {
                    const order = {
                      id: Date.now(),
                      date: new Date().toLocaleDateString('ar-KW'),
                      type: designTypes.find(t => t.key === designType)?.label,
                      weight: designWeight + ' جرام',
                      karat: designKarat,
                      engraving: designEngraving || 'بدون',
                      whatsapp: '+965 ' + designWhatsapp,
                      image: designImage ? 'مرفوعة' : 'بدون',
                    };
                    const existing = JSON.parse(localStorage.getItem('kayan-design-orders') || '[]');
                    existing.unshift(order);
                    localStorage.setItem('kayan-design-orders', JSON.stringify(existing));

                    const msg = encodeURIComponent(
                      `✨ طلب تصميم خاص من بيت الذهب\n\n` +
                      `📦 النوع: ${order.type}\n` +
                      `⚖️ الوزن: ${order.weight}\n` +
                      `🔶 العيار: ${order.karat}\n` +
                      `${order.engraving !== 'بدون' ? `✍️ النقش: ${order.engraving}\n` : ''}` +
                      `📸 الصورة: ${order.image}\n` +
                      `📱 الوتساب: ${order.whatsapp}\n` +
                      `📅 التاريخ: ${order.date}`
                    );
                    window.open(`https://wa.me/96598980888?text=${msg}`, '_blank');
                    setDesignSaved(true);
                    setTimeout(() => setDesignSaved(false), 3000);
                  }}
                    className="w-full mt-4 py-3 rounded-xl bg-gold text-background font-bold text-sm hover:bg-gold-light transition-all">
                    {designSaved ? '✓ تم الإرسال' : 'أرسلي التصميم عبر الوتساب'}
                  </button>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-4">
                {designStep > 0 && (
                  <button onClick={() => setDesignStep(s => s - 1)}
                    className="px-6 py-2.5 rounded-full border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-all">السابق</button>
                )}
                {designStep < 6 && (
                  <button onClick={() => setDesignStep(s => s + 1)}
                    className="px-6 py-2.5 rounded-full bg-gold text-background text-sm font-bold hover:bg-gold-light transition-all">التالي</button>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-6 sticky top-24">
                <h4 className="text-gold font-bold text-sm mb-4">معاينة التصميم</h4>
                <div className="aspect-square rounded-2xl bg-background/40 border border-gold/10 flex items-center justify-center mb-4 relative overflow-hidden">
                  {designImage ? (
                    <img src={designImage} alt="تصميمك" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <img src={designTypes.find(t => t.key === designType)?.icon} alt="" className="w-32 h-32 mx-auto mb-3 rounded-xl object-contain" />
                      <p className="text-gold font-bold">{designTypes.find(t => t.key === designType)?.label}</p>
                      <p className="text-foreground/40 text-[10px]">{designKarat}</p>
                      {designEngraving && <p className="text-gold/40 text-[10px] mt-1 italic">"{designEngraving}"</p>}
                    </div>
                  )}
                </div>
                <button className="w-full mt-4 py-3 rounded-xl border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-all font-bold">اطلبي هذه القطعة</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bracelets */}
      <section id="bracelets" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Bracelets / أساور</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">أساور فاخرة</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[{ id: 301, name: 'سوار ماسي كلاسيكي', nameEn: 'Classic Diamond Bracelet', price: '---', image: '/products/bracelet-1.jpg' },
              { id: 302, name: 'سوار ذهب أنيق', nameEn: 'Elegant Gold Bracelet', price: '---', image: '/products/bracelet-2.jpg' },
              { id: 303, name: 'سوار ألماسي', nameEn: 'Diamond Bracelet', price: '---', image: '/products/bracelet-3.jpg' },
              { id: 304, name: 'سوار كارتير', nameEn: 'Cartier Bracelet', price: '---', image: '/products/bracelet-4.jpg' },
              { id: 310, name: 'سوار 10', nameEn: 'Bracelet 10', price: '---', image: '/products/bracelet-10.jpg' },
              { id: 311, name: 'سوار 11', nameEn: 'Bracelet 11', price: '---', image: '/products/bracelet-11.jpg' },
              { id: 312, name: 'سوار 12', nameEn: 'Bracelet 12', price: '---', image: '/products/bracelet-12.jpg' },
              { id: 313, name: 'سوار 13', nameEn: 'Bracelet 13', price: '---', image: '/products/bracelet-13.jpg' },
              { id: 314, name: 'سوار 14', nameEn: 'Bracelet 14', price: '---', image: '/products/bracelet-14.jpg' },
              { id: 315, name: 'سوار 15', nameEn: 'Bracelet 15', price: '---', image: '/products/bracelet-15.jpg' },
              { id: 316, name: 'سوار 16', nameEn: 'Bracelet 16', price: '---', image: '/products/bracelet-16.jpg' },
              { id: 317, name: 'سوار 17', nameEn: 'Bracelet 17', price: '---', image: '/products/bracelet-17.jpg' },
            ...userImages.bracelets.map((img, i) => ({ id: 8001 + i, name: 'سوار جديد', nameEn: 'New Bracelet', price: '---', image: img }))].map((item, i) => (
              <div key={item.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className="aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative" onClick={() => setLightbox({ src: item.image, alt: item.name })}>
                  <img src={item.image} alt={item.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditItem({ section: 'bracelets', index: i - 4, name: item.name, nameEn: item.nameEn, price: item.price, image: item.image }); }} className="w-7 h-7 bg-blue-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-400">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); if (i >= 12) deleteFromSection('bracelets', i - 12); }} className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-400">✕</button>
                  </div>
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{item.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{item.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
                <button onClick={(e) => { e.stopPropagation(); setTryOnCategory('bracelet'); setTryOnItems(prev => ({ ...prev, bracelet: item.image })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="mt-3 w-full py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold hover:text-background transition-all font-bold">جربي هذا السوار</button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={() => openAddModal('bracelets', 'الأساور')} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              إضافة سوار جديد
            </button>
          </div>
        </div>
      </section>

      {/* Anklets */}
      <section id="earrings2" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Earrings / أقراط</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">أقراط أنيقة</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[{ id: 501, name: 'أقراط ماسية', nameEn: 'Diamond Earrings', price: '---', image: '/products/earring-1.jpg' },
              { id: 502, name: 'أقراط ذهبية', nameEn: 'Gold Earrings', price: '---', image: '/products/earring-2.jpg' },
              { id: 503, name: 'أقراط أنيقة', nameEn: 'Elegant Earrings', price: '---', image: '/products/earring-3.jpg' },
              { id: 504, name: 'أقراط كلاسيكية', nameEn: 'Classic Earrings', price: '---', image: '/products/earring-4.jpg' },
              { id: 505, name: 'أقراط لامعة', nameEn: 'Shiny Earrings', price: '---', image: '/products/earring-5.jpg' },
              { id: 506, name: 'أقراط راقية', nameEn: 'Premium Earrings', price: '---', image: '/products/earring-6.jpg' },
            ...userImages.earrings?.map((img, i) => ({ id: 9001 + i, name: 'أقراط جديدة', nameEn: 'New Earrings', price: '---', image: img })) || []].map((item, i) => (
              <div key={item.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className="aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative" onClick={() => setLightbox({ src: item.image, alt: item.name })}>
                  <img src={item.image} alt={item.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditItem({ section: 'earrings', index: i - 6, name: item.name, nameEn: item.nameEn, price: item.price, image: item.image }); }} className="w-7 h-7 bg-blue-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-400">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); if (i >= 6) deleteFromSection('earrings', i - 6); }} className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-400">✕</button>
                  </div>
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{item.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{item.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
                <button onClick={(e) => { e.stopPropagation(); setTryOnCategory('earring'); setTryOnItems(prev => ({ ...prev, earring: item.image })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="mt-3 w-full py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold hover:text-background transition-all font-bold">جربي هذه الأقراط</button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={() => openAddModal('earrings', 'الأقراط')} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              إضافة أقراط جديدة
            </button>
          </div>
        </div>
      </section>

      {/* Gold Chairs */}
      <section id="chairs" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Gold Chairs / كراسي ذهب</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">كراسي ذهب</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { id: 601, name: 'كرسي ذهبي فاخر', nameEn: 'Luxury Gold Chair', price: '---', image: '/products/chair-1.png' },
              { id: 602, name: 'كرسي ذهبي كلاسيكي', nameEn: 'Classic Gold Chair', price: '---', image: '/products/chair-2.png' },
              { id: 603, name: 'كرسي ذهبي أنيق', nameEn: 'Elegant Gold Chair', price: '---', image: '/products/chair-3.png' },
              { id: 604, name: 'كرسي ذهبي مزخرف', nameEn: 'Ornate Gold Chair', price: '---', image: '/products/chair-4.png' },
            ].map((item, i) => (
              <div key={item.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className="aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative" onClick={() => setLightbox({ src: item.image, alt: item.name })}>
                  <img src={item.image} alt={item.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{item.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{item.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hand Chain */}
      <section id="handchain" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Hand Chain / سلسال يد</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold">سلسال يد</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { id: 701, name: 'سلسال يد 1', nameEn: 'Hand Chain 1', price: '---', image: '/products/hand-chain-1.png' },
              { id: 702, name: 'سلسال يد 2', nameEn: 'Hand Chain 2', price: '---', image: '/products/hand-chain-2.png' },
              { id: 703, name: 'سلسال يد 3', nameEn: 'Hand Chain 3', price: '---', image: '/products/hand-chain-3.png' },
              { id: 704, name: 'سلسال يد 4', nameEn: 'Hand Chain 4', price: '---', image: '/products/hand-chain-4.png' },
              { id: 705, name: 'سلسال يد 5', nameEn: 'Hand Chain 5', price: '---', image: '/products/hand-chain-5.png' },
              { id: 706, name: 'سلسال يد 6', nameEn: 'Hand Chain 6', price: '---', image: '/products/hand-chain-6.png' },
              { id: 707, name: 'سلسال يد 7', nameEn: 'Hand Chain 7', price: '---', image: '/products/hand-chain-7.jpg' },
              { id: 708, name: 'سلسال يد 8', nameEn: 'Hand Chain 8', price: '---', image: '/products/hand-chain-8.jpg' },
              { id: 709, name: 'سلسال يد 9', nameEn: 'Hand Chain 9', price: '---', image: '/products/hand-chain-9.jpg' },
            ].map((item, i) => (
              <div key={item.id} className="group relative bg-gradient-to-b from-surface-2 to-surface rounded-3xl p-8 border border-gold/10 hover:border-gold/40 transition-all duration-500">
                <div className="aspect-square overflow-hidden mb-6 flex items-center justify-center bg-background/40 rounded-2xl cursor-pointer relative" onClick={() => setLightbox({ src: item.image, alt: item.name })}>
                  <img src={item.image} alt={item.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-2'}`} />
                </div>
                <h4 className="font-display text-lg text-foreground font-bold mb-1">{item.name}</h4>
                <p className="text-foreground/40 text-xs mb-3">{item.nameEn}</p>
                <p className="text-gold font-bold">اتصل بالسعر</p>
                <button onClick={(e) => { e.stopPropagation(); setTryOnCategory('handchain'); setTryOnItems(prev => ({ ...prev, handchain: item.image })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="mt-3 w-full py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold hover:text-background transition-all font-bold">جربي هذا السلسال</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-gold/10 bg-surface flex items-center justify-center">
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient-gold font-bold text-center leading-relaxed animate-float-slow px-6 sm:px-8" style={{ lineHeight: '1.4' }}>
                  تألقي بلمسة<br />لا تُضاهى
                </h3>
              </div>
            </div>
            <div>
              <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">من نحن</span>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold mb-4 sm:mb-6">
                فن المجوهرات العربي الأصيل
              </h3>
              <div className="space-y-4 text-foreground/60 leading-relaxed text-sm">
                <p>
                  في بيت الذهب، نؤمن بأن المجوهرات أكثر من مجرد إكسسوارات — إنها تعبير عن الهوية والأناقة. صُنعت تصاميمنا بعناية فائقة من أجود المواد لتناسب المرأة العربية العصرية.
                </p>
                <p>
                  كل قطعة تحكي قصة فنية تجمع بين عراقة التراث العربي وأناقة العصر الحديث.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-10">
                <div className="bg-surface border border-gold/10 rounded-2xl p-6 text-center hover:border-gold/30 transition-colors">
                  <p className="text-gradient-gold text-2xl md:text-3xl font-bold font-display">+15</p>
                  <p className="text-foreground/40 text-xs mt-1">سنة خبرة</p>
                </div>
                <div className="bg-surface border border-gold/10 rounded-2xl p-6 text-center hover:border-gold/30 transition-colors">
                  <p className="text-gradient-gold text-2xl md:text-3xl font-bold font-display">+500</p>
                  <p className="text-foreground/40 text-xs mt-1">قطعة فريدة</p>
                </div>
                <div className="bg-surface border border-gold/10 rounded-2xl p-6 text-center hover:border-gold/30 transition-colors">
                  <p className="text-gradient-gold text-2xl md:text-3xl font-bold font-display">+1000</p>
                  <p className="text-foreground/40 text-xs mt-1">عميل سعيد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try On AR */}
      <section id="try-on" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Try On / تجربة</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold mb-3">جربي المجوهرات على صورتك</h3>
            <p className="text-foreground/50 text-xs sm:text-sm">ارفعي صورتك وجربي القطعة عليها مباشرة</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Jewelry selector */}
            <div className="order-3 lg:order-1">
              <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5 sticky top-24">
                <h4 className="text-gold font-bold text-sm mb-3">قطع المجوهرات</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['necklace','ring','bracelet','watch','earring','anklet','handchain'].map(cat => (
                    <button key={cat} onClick={() => setTryOnCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs transition-all ${tryOnCategory === cat ? 'bg-gold text-background font-bold' : 'bg-surface border border-gold/10 text-foreground/60 hover:border-gold/30'}`}>
                      {tryOnZones[cat]?.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto">
                  {tryOnJewelry.filter(j => j.cat === tryOnCategory).map(item => (
                    <div key={item.id} onClick={() => setTryOnItems(prev => ({ ...prev, [item.cat]: item.image }))} className={`bg-background/40 border rounded-xl p-2 cursor-pointer hover:border-gold/40 transition-all ${tryOnItems[item.cat] === item.image ? 'border-green-500/50 bg-green-500/10' : 'border-gold/10'}`}>
                      <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <p className="text-foreground/70 text-[10px] text-center mt-1">{item.name}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setTryOnItems({}); setUserPhoto(null); setUseUserPhoto(false); }} className="w-full mt-3 px-4 py-2 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold/10 transition-all">مسح الكل</button>
              </div>
            </div>

            {/* Photo Display */}
            <div className="order-1 lg:order-2">
              <div
                className="relative bg-gradient-to-b from-surface-2/30 to-surface/30 border border-gold/10 rounded-3xl overflow-hidden aspect-[3/4]"
                onDragOver={(e) => { e.preventDefault(); setIsDraggingPhoto(true); }}
                onDragLeave={() => setIsDraggingPhoto(false)}
                onDrop={handleDropPhoto}
              >
                {/* User uploaded photo - shows when toggled */}
                {userPhoto && useUserPhoto ? (
                  <img src={userPhoto} alt="صورتك" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    {/* Default mannequin models - always visible */}
                    {Object.entries(tryOnModels).map(([cat, img]) => (
                      <img
                        key={cat}
                        src={img}
                        alt=""
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${tryOnCategory === cat ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      />
                    ))}
                  </>
                )}

                {/* Drag & drop overlay */}
                {!userPhoto && isDraggingPhoto && (
                  <div className="absolute inset-0 bg-gold/20 border-2 border-dashed border-gold rounded-3xl flex items-center justify-center z-20">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📸</span>
                      <span className="text-gold font-bold text-sm">أفلتي الصورة هنا</span>
                    </div>
                  </div>
                )}

                {/* Jewelry overlay */}
                {tryOnItems[tryOnCategory] && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <img
                      src={tryOnItems[tryOnCategory]}
                      alt=""
                      className="w-1/3 h-auto drop-shadow-[0_0_20px_rgba(205,161,90,0.6)] transition-transform duration-200"
                      style={{ transform: `translate(${tryOnOffset.x}px, ${tryOnOffset.y}px) scale(${tryOnZoom}) rotate(${tryOnRotation}deg)` }}
                    />
                  </div>
                )}

                {/* Bottom label */}
                <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                  <span className="bg-black/60 backdrop-blur-sm text-gold/80 text-[10px] px-3 py-1 rounded-full">
                    {userPhoto && useUserPhoto ? 'صورتك' : tryOnZones[tryOnCategory]?.label}
                  </span>
                </div>
              </div>

              {/* Upload photo button - below image */}
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <label className="bg-gold text-background px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg">
                  <span>📷</span>
                  <span>{userPhoto ? 'تغيير الصورة' : 'ارفعي صورتك'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUserPhotoUpload} />
                </label>
                {userPhoto && (
                  <>
                    <button
                      onClick={() => setUseUserPhoto(!useUserPhoto)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${useUserPhoto ? 'bg-green-500 text-white' : 'bg-surface border border-gold/30 text-gold hover:bg-gold/10'}`}
                    >
                      <span>{useUserPhoto ? '✓' : '🖼️'}</span>
                      <span>{useUserPhoto ? 'صورتك' : 'المانيكان'}</span>
                    </button>
                    <button onClick={() => { setUserPhoto(null); setUseUserPhoto(false); }} className="bg-red-500/80 text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-red-500 transition-all">
                      حذف الصورة
                    </button>
                  </>
                )}
              </div>

              {/* Model Selector */}
              {tryOnCategory === 'necklace' && (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {hijabModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); resetTryOn(); }}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${selectedModel === model.id ? 'border-gold scale-110' : 'border-gold/20 hover:border-gold/50'}`}
                    >
                      <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {/* Position & Zoom Controls */}
              {Object.keys(tryOnItems).length > 0 && (
                <div className="mt-4 bg-surface-2/50 border border-gold/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Directional pad */}
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => setTryOnOffset(p => ({ ...p, y: p.y - tryOnStep }))} className="w-8 h-8 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-xs">▲</button>
                      <div className="flex gap-1">
                        <button onClick={() => setTryOnOffset(p => ({ ...p, x: p.x - tryOnStep }))} className="w-8 h-8 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-xs">◀</button>
                        <button onClick={() => setTryOnOffset({ x: 0, y: 0 })} className="w-8 h-8 bg-surface border border-gold/20 rounded-lg text-gold/50 hover:bg-gold/10 transition-all flex items-center justify-center text-[8px]">●</button>
                        <button onClick={() => setTryOnOffset(p => ({ ...p, x: p.x + tryOnStep }))} className="w-8 h-8 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-xs">▶</button>
                      </div>
                      <button onClick={() => setTryOnOffset(p => ({ ...p, y: p.y + tryOnStep }))} className="w-8 h-8 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-xs">▼</button>
                    </div>
                    {/* Zoom & Rotate */}
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gold/60 text-[10px] w-8">تكبير</span>
                        <button onClick={() => setTryOnZoom(z => Math.max(0.2, z - 0.1))} className="w-7 h-7 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-sm font-bold">−</button>
                        <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                          <div className="h-full bg-gold/40 rounded-full transition-all" style={{ width: `${((tryOnZoom - 0.2) / 2.8) * 100}%` }} />
                        </div>
                        <button onClick={() => setTryOnZoom(z => Math.min(3, z + 0.1))} className="w-7 h-7 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-sm font-bold">+</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold/60 text-[10px] w-8">دوران</span>
                        <button onClick={() => setTryOnRotation(r => r - 15)} className="w-7 h-7 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-xs">↺</button>
                        <div className="flex-1 text-center text-gold/50 text-[10px]">{tryOnRotation}°</div>
                        <button onClick={() => setTryOnRotation(r => r + 15)} className="w-7 h-7 bg-surface border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-all flex items-center justify-center text-xs">↻</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold/60 text-[10px] w-8">خطوة</span>
                        {[1, 5, 10, 25].map(s => (
                          <button key={s} onClick={() => setTryOnStep(s)} className={`flex-1 py-1 rounded text-[10px] transition-all ${tryOnStep === s ? 'bg-gold text-background font-bold' : 'bg-surface border border-gold/10 text-foreground/50 hover:border-gold/30'}`}>{s}px</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="order-2 lg:order-3">
              <div className="bg-surface-2/50 border border-gold/10 rounded-2xl p-5 sticky top-24">
                <h4 className="text-gold font-bold text-sm mb-3">القطع المختارة</h4>
                {/* User photo status */}
                {userPhoto && (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-2 mb-3">
                    <img src={userPhoto} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-green-400 text-[10px] font-bold">صورتك مرفوعة</p>
                      <button onClick={() => setUserPhoto(null)} className="text-red-400 text-[10px] hover:text-red-300">حذف</button>
                    </div>
                  </div>
                )}
                {Object.keys(tryOnItems).length === 0 && !userPhoto ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">💎</div>
                    <p className="text-foreground/40 text-xs">ارفعي صورتك ثم اختاري قطعاً لتجربتها</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(tryOnItems).map(([cat, img]) => (
                      <div key={cat} className="flex items-center gap-3 bg-background/40 border border-gold/10 rounded-xl p-3">
                        <img src={img} alt="" className="w-10 h-10 object-contain" />
                        <span className="text-foreground/80 text-xs flex-1">{tryOnZones[cat]?.label}</span>
                        <button onClick={() => setTryOnItems(prev => { const n = { ...prev }; delete n[cat]; return n; })} className="text-red-400 hover:text-red-300">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Model Viewer */}
      <ModelViewer />

      {/* CTA */}
      <section className="py-20 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(205,161,90,0.08),transparent_70%)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl text-gradient-gold font-bold mb-6">
            احجز استشارتك المجانية
          </h3>
          <p className="text-foreground/50 text-base sm:text-lg mb-10">
            دع فريقنا المتخصص يساعدك في اختيار القطعة المثالية
          </p>
          <a
            href="https://wa.me/96598980888?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#20BD5A] transition-all shadow-lg shadow-[#25D366]/20 hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            احجز استشارتك المجانية
          </a>
        </div>
      </section>

      {/* Luxury Gift Wrapping Service */}
      <section id="gift-wrapping" className="py-12 sm:py-20 px-4 sm:px-6 md:px-10 bg-gradient-to-b from-surface/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3">Luxury Gift Wrapping / تغليف فاخر</span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold mb-4">هدية تليق بأهمية المحبة</h3>
            <p className="text-foreground/50 text-xs sm:text-sm max-w-2xl mx-auto">نقدم لك خدمة تغليف فاخرة تحول هديتك إلى تجربة لا تُنسى مع لمسة شخصية تعكس ذوقك الرفيع</p>
          </div>

          {/* Gift Wrapping Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { id: 'gw1', image: '/products/gift-wrap-1.jpg', name: 'تغليف فاخر 1' },
              { id: 'gw2', image: '/products/gift-wrap-2.jpg', name: 'تغليف فاخر 2' },
              { id: 'gw3', image: '/products/gift-wrap-3.jpg', name: 'تغليف فاخر 3' },
              { id: 'gw4', image: '/products/gift-wrap-4.jpg', name: 'تغليف فاخر 4' },
            ].map((item) => (
              <div key={item.id} className="aspect-square rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all cursor-pointer group" onClick={() => setLightbox({ src: item.image, alt: item.name })}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>

          {/* Gift Wrapping Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Basic Package */}
            <div className="bg-surface-2/50 border border-gold/10 rounded-3xl p-6 sm:p-8 hover:border-gold/30 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <h4 className="text-gold font-bold text-xl mb-3">تغليف كلاسيكي</h4>
                <p className="text-foreground/50 text-sm mb-6 leading-relaxed">صندوق فاخر بلمسة ذهبية مع شريط ساتان وبطاقة هدية مكتوبة بخط اليد</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    صندوق مخمل فاخر
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    شريط ساتان ذهبي
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    بطاقة هدية شخصية
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    كيس هدايا مقوّى
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-gold font-bold text-2xl">5 KD</span>
                  <span className="text-foreground/40 text-sm block">تكلفة إضافية</span>
                </div>
              </div>
            </div>

            {/* Premium Package */}
            <div className="bg-surface-2/50 border-2 border-gold/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden group transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-4 right-4 bg-gold text-background px-3 py-1 rounded-full text-xs font-bold">الأكثر طلباً</div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h4 className="text-gold font-bold text-xl mb-3">تغليف فاخر</h4>
                <p className="text-foreground/50 text-sm mb-6 leading-relaxed">تجربة تغليف متكاملة مع صندوق خشبي فاخر وتفصيل ذهبي وباقة ورد طبيعية</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                    صندوق خشبي فاخر بالذهبي
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                    باقة ورد طبيعية
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                    بطاقة هدية مزخرفة
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                    شمع فاخر معطر
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                    كيس مخمل فاخر
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-gold font-bold text-2xl">10 KD</span>
                  <span className="text-foreground/40 text-sm block">تكلفة إضافية</span>
                </div>
              </div>
            </div>

            {/* VIP Package */}
            <div className="bg-surface-2/50 border border-gold/10 rounded-3xl p-6 sm:p-8 hover:border-gold/30 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h4 className="text-gold font-bold text-xl mb-3">تغليف VIP</h4>
                <p className="text-foreground/50 text-sm mb-6 leading-relaxed">تجربة هدايا استثنائية مع صندوق إبداعي ورسالة شخصية وخدمة توصيل خاصة</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    صندوق إبداعي مخصص
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    رسالة صوتية شخصية
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    تغليف معطر بعطر مميز
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    صندوق مفاجأة إضافي
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    توصيل شخصي مجاني
                  </li>
                  <li className="flex items-center gap-3 text-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    شهادة هدية فاخرة
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-gold font-bold text-2xl">20 KD</span>
                  <span className="text-foreground/40 text-sm block">تكلفة إضافية</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <a
              href="https://wa.me/96598980888?text=%23خدمة_التغليف_الفاخر"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gold text-background px-8 py-4 rounded-full font-bold text-lg hover:bg-gold-light transition-all shadow-lg shadow-gold/20 hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              اطلبي خدمة التغليف الآن
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient-gold font-bold mb-4">الأسئلة الشائعة</h2>
            <p className="text-foreground/50 text-sm sm:text-base lg:text-lg">إجابات على أكثر الاستفسارات تكراراً</p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((faq, i) => (
              <details key={i} className="group bg-surface/60 border border-gold/10 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-foreground/80 hover:text-gold transition-colors">
                  <span className="font-display text-base sm:text-lg font-bold">{faq.q}</span>
                  <span className="text-gold/40 group-open:rotate-180 transition-transform text-lg">▾</span>
                </summary>
                <div className="px-6 pb-5 text-foreground/50 text-sm sm:text-base leading-relaxed border-t border-gold/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative border-t border-gold/10 pt-10 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 md:px-10 bg-surface/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
            <div>
              <div className="mb-4">
                <a href="/" className="flex flex-col items-start leading-none">
                  <span className="brand-logo font-serif text-xl tracking-[0.15em] font-semibold">بيت الذهب</span>
                  <span className="text-gold/60 text-[9px] tracking-[0.35em] uppercase font-serif">Jewellery</span>
                </a>
              </div>
              <p className="text-foreground/40 text-sm leading-relaxed">
                مجوهرات فاخرة تصمم خصيصاً للمرأة العربية العصرية
              </p>
            </div>
            <div>
              <h5 className="text-gold text-sm font-bold mb-4">روابط سريعة</h5>
              <div className="space-y-3">
                <a href="#collections" className="block text-foreground/40 hover:text-gold text-sm transition-colors">المجموعات</a>
                <a href="#products" className="block text-foreground/40 hover:text-gold text-sm transition-colors">المنتجات</a>
                <a href="#about" className="block text-foreground/40 hover:text-gold text-sm transition-colors">عن بيت الذهب</a>
              </div>
            </div>
            <div>
              <h5 className="text-gold text-sm font-bold mb-4">خدمة العملاء</h5>
              <div className="space-y-3">
                <a href="#" className="block text-foreground/40 hover:text-gold text-sm transition-colors">الأسئلة الشائعة</a>
                <a href="#" className="block text-foreground/40 hover:text-gold text-sm transition-colors">الشحن والتوصيل <span className="text-gold/60 text-[10px]">مجاني لجميع مناطق الكويت</span></a>
              </div>
            </div>
            <div className="sm:col-span-2 md:col-span-4">
              <h5 className="text-gold text-sm font-bold mb-4">موقعنا على الخريطة</h5>
              <div className="rounded-2xl overflow-hidden border border-gold/10 h-[250px]">
                <iframe
                  src="https://www.google.com/maps?q=سوق+الذهب+الفروانية+الكويت&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع بيت الذهب - سوق الذهب الفروانية"
                />
              </div>
            </div>
            <div>
              <h5 className="text-gold text-sm font-bold mb-4">تواصل معنا</h5>
              <div className="space-y-3 text-foreground/40 text-sm">
                <p>الكويت - مدينة الفروانية - سوق الذهب</p>
                <p>خلف الجمعية</p>
                <p dir="ltr">+965 9898 0888</p>
                <p dir="ltr">Bait.aldhab@gmail.com</p>
              </div>
              <div className="flex gap-4 mt-4">
                <a href="https://www.facebook.com/people/%D9%85%D8%AC%D9%88%D9%87%D8%B1%D8%A7%D8%AA-%D8%A8%D9%8A%D8%AA-%D8%A7%D9%84%D8%B0%D9%87%D8%A8/61576973302802/#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-surface border border-gold/20 rounded-full flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/40 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/bait_aldhab/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-surface border border-gold/20 rounded-full flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/40 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gold/10 pt-8 text-center">
            <p className="text-foreground/30 text-sm">© 2026 بيت الذهب Jewellery. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-gold text-background px-6 py-3 rounded-full font-medium text-sm shadow-lg animate-[fadeIn_0.3s_ease-out]">
          {toast}
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
          <div className="bg-surface-2 border border-gold/20 rounded-3xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-gold font-bold mb-6 text-center">تعديل المنتج</h3>
            <div className="space-y-4">
              <div>
                <label className="text-foreground/60 text-sm block mb-1">اسم المنتج</label>
                <input type="text" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full bg-background/60 border border-gold/20 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="text-foreground/60 text-sm block mb-1">الاسم بالإنجليزية</label>
                <input type="text" value={editItem.nameEn} onChange={(e) => setEditItem({ ...editItem, nameEn: e.target.value })} className="w-full bg-background/60 border border-gold/20 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="text-foreground/60 text-sm block mb-1">السعر</label>
                <input type="text" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} className="w-full bg-background/60 border border-gold/20 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              </div>
              <button onClick={saveEdit} className="w-full bg-gold text-background py-3 rounded-full font-bold hover:bg-gold-light transition-all">حفظ التعديلات</button>
              <button onClick={() => setEditItem(null)} className="w-full border border-gold/30 text-gold py-3 rounded-full hover:bg-gold/10 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface-2 border border-gold/20 rounded-3xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-gold font-bold mb-6 text-center">إضافة منتج جديد إلى {addTarget.sectionAr}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-foreground/60 text-sm block mb-1">اسم المنتج *</label>
                <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-background/60 border border-gold/20 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold/50" placeholder="مثال: خاتم ماسي" />
              </div>
              <div>
                <label className="text-foreground/60 text-sm block mb-1">الاسم بالإنجليزية</label>
                <input type="text" value={newItem.nameEn} onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })} className="w-full bg-background/60 border border-gold/20 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold/50" placeholder="e.g. Diamond Ring" />
              </div>
              <div>
                <label className="text-foreground/60 text-sm block mb-1">السعر</label>
                <input type="text" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full bg-background/60 border border-gold/20 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold/50" placeholder="مثال: 5,000 KD" />
              </div>
              <div>
                <label className="text-foreground/60 text-sm block mb-1">صورة المنتج *</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-background/60 border border-dashed border-gold/30 rounded-xl px-4 py-6 text-gold/60 text-sm hover:border-gold/50 hover:text-gold transition-all flex flex-col items-center gap-2">
                  {newItem.image ? (
                    <img src={newItem.image} alt="preview" className="w-20 h-20 object-contain rounded-lg" />
                  ) : (
                    <>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span>اضغط لاختيار صورة</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={confirmAddItem} className="flex-1 bg-gold text-background font-medium py-3 rounded-xl hover:bg-gold-light transition-colors">إضافة</button>
                <button onClick={() => { setShowAddModal(false); setNewItem({ name: '', nameEn: '', price: '', image: '' }); }} className="flex-1 border border-gold/30 text-gold py-3 rounded-xl hover:bg-gold/10 transition-colors">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-gold hover:text-gold-light transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[75vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox(null); const name = lightbox.alt.toLowerCase(); const cat = name.includes('ساعة') || name.includes('watch') ? 'watch' : name.includes('خاتم') || name.includes('ring') ? 'ring' : name.includes('أقراط') || name.includes('earring') ? 'earring' : name.includes('سوار') || name.includes('bracelet') || name.includes('bangle') ? 'bracelet' : name.includes('كاحل') || name.includes('anklet') ? 'anklet' : 'necklace'; setTryOnCategory(cat); setTryOnItems(prev => ({ ...prev, [cat]: lightbox.src })); resetTryOn(); setTimeout(() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gold text-background px-8 py-3 rounded-full font-bold text-sm hover:bg-gold-light transition-all">
            جربي هذا العقد افتراضياً ✨
          </button>
        </div>
      )}
    </div>
  );
}
