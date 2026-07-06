import React, { useState, useMemo } from 'react';
import { 
  Scale, Search, BookOpen, FileText, HelpCircle, ExternalLink, 
  Filter, BookMarked, Briefcase, Calendar, ShieldAlert, CheckCircle,
  Clock, AlertTriangle, ArrowUpRight, Copy, Check, ChevronDown, ChevronUp
} from 'lucide-react';

interface LegislationItem {
  id: string;
  title: string;
  code: string;
  category: 'atama' | 'izin' | 'disiplin' | 'ekip' | 'sozlesmeli' | 'genel';
  summary: string;
  fullText: string;
  importantArticles: { number: string; title: string; content: string; implication: string }[];
  officialLink: string;
  lastUpdated: string;
}

const LEGISLATION_DATA: LegislationItem[] = [
  {
    id: 'atama-yer-degistirme',
    title: 'Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği',
    code: 'Yönetmelik / 29011',
    category: 'atama',
    summary: 'Sağlık Bakanlığı bünyesindeki sağlık hizmetleri sınıfı personelinin atama, nakil, eş durumu, sağlık mazereti ve bölge hizmeti gruplarını düzenleyen temel yönetmeliktir.',
    lastUpdated: '15.02.2025',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19543&MevzuatTur=7&MevzuatTertip=5',
    fullText: 'Bu Yönetmelik; Sağlık Bakanlığı taşra teşkilatında görev yapan sağlık hizmetleri ve yardımcı sağlık hizmetleri sınıfı personelinin atama ve yer değiştirme işlemlerine dair usul ve esasları kapsar. Personelin unvan ve branşlarına göre hizmet bölgeleri (1. ila 6. bölge) ve bu bölgelerdeki asgari çalışma süreleri belirlenmiştir. Mazeret tayinleri, eş durumu mazereti, sağlık mazereti, can güvenliği mazereti ve olağanüstü durumlarda tayinler bu yönetmeliğin en çok işlem gören bölümleridir.',
    importantArticles: [
      {
        number: 'Madde 19',
        title: 'Sağlık Mazeretine Bağlı Yer Değişikliği',
        content: 'Kendisi, eşi, çocukları, annesi, babası veya vasisi olduğu kardeşinin hastalığının görev yaptığı yerde tedavisinin mümkün olmadığını, eğitim ve araştırma hastanesi veya üniversite hastanesinden alınacak heyet raporu ile belgelendirenler yer değişikliği talep edebilir.',
        implication: 'Raporda "başka yerde çalışması hayati öneme haizdir" ibaresi veya tedavinin o ilde yapılamayacağının açıkça belirtilmesi şarttır. EKİP sistemi tescil ekranına bu raporun taratılarak yüklenmesi gerekir.'
      },
      {
        number: 'Madde 20',
        title: 'Aile Birliği (Eş Durumu) Mazeretine Bağlı Yer Değişikliği',
        content: 'Eşlerin her ikisinin de Bakanlıkta memur olması halinde, ast-üst ilişkisi, unvan ve kadro durumuna göre öncelikli olarak vizeli boş pozisyona atama yapılır. Eşin diğer kamu kurumlarında (TFA, Emniyet, TSK vb.) çalışması durumunda, kurumun özel mevzuatı gereği yer değiştiremeyeceğine dair belge sunulmalıdır.',
        implication: 'Özel sektörde çalışan eşin son 4 yılda en az 720 gün SGK prim ödemesinin bulunması zorunludur. İşlemler EKİP üzerinden "Eş Durumu Başvurusu" modülüyle başlatılır.'
      },
      {
        number: 'Madde 26',
        title: 'Alt Bölge Tayinleri',
        content: 'Personel, kendi unvan ve branşında boş kadro bulunması ve hizmet grubu olarak daha alt bir bölge grubunda yer alması şartıyla, dönem kısıtlaması olmaksızın alt bölgelere yer değişikliği talep edebilir.',
        implication: '1. bölgeden 2, 3, 4, 5 veya 6. bölgelere yapılacak başvurular, personel dağılım cetveli (PDC) doluluk oranına bakılmaksızın ve kura aranmaksızın her zaman yapılabilir.'
      }
    ]
  },
  {
    id: '657-izinler-haklar',
    title: '657 Sayılı Devlet Memurları Kanunu - İzin ve Haklar',
    code: 'Kanun / 657',
    category: 'izin',
    summary: 'Devlet memurlarının yıllık, mazeret, hastalık, refakat ve aylıksız izin haklarını, izinlerin sürelerini ve kullanım usullerini düzenleyen kanun hükümleridir.',
    lastUpdated: '01.01.2026',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=657&MevzuatTur=1&MevzuatTertip=5',
    fullText: '657 Sayılı Devlet Memurları Kanunu kapsamında çalışan tüm kadrolu sağlık personelinin yıllık izin, mazeret izni, hastalık ve refakat izni ile aylıksız izin hakları bu kanunda güvence altına alınmıştır. İzinlerin idare tarafından onaylanması, bütçe ve nöbet planlaması açısından önem taşır. İzin süreleri hizmet yılına göre (1 yıldan 10 yıla kadar 20 gün, 10 yıldan fazla olanlar için 30 gün) değişir.',
    importantArticles: [
      {
        number: 'Madde 102',
        title: 'Yıllık İzin Süreleri',
        content: 'Hizmeti 1 yıldan 10 yıla kadar (10 yıl dahil) olan memurlar için yıllık izin süresi yirmi gündür, hizmeti on yıldan fazla olanlar için otuz gündür. Zorunlu hallerde bu sürelere gidiş ve dönüş için en çok ikişer gün eklenebilir.',
        implication: 'Sağlık personeli için yıllık izinler, birim sorumlusu ve başhekimlik onayına tabidir. Kullanılmayan yıllık izinler sadece bir sonraki yıla devredebilir, sonraki yıllarda yanar.'
      },
      {
        number: 'Madde 104',
        title: 'Mazeret İzinleri',
        content: 'Memura; eşinin doğum yapması halinde 10 gün; kendisinin veya çocuğunun evlenmesi ya da eşinin, çocuğunun, kendisinin veya eşinin ana, baba ve kardeşinin ölümü hallerinde isteği üzerine 7 gün izin verilir. Kadın memura doğumdan önce 8, doğumdan sonra 8 hafta analık izni verilir.',
        implication: 'Mazeret izinleri amirin takdirinde değildir, yasal bir haktır. Doğum ve vefat belgelerinin EKİP Özlük modülüne işlenmesi ve dilekçe ekinde sunulması gereklidir.'
      },
      {
        number: 'Madde 105',
        title: 'Hastalık ve Refakat İzni',
        content: 'Memura, aylık ve özlük hakları korunarak, hekim raporuyla gösterilen lüzum üzerine hastalık izni verilebilir. Ayrıca bakmakla yükümlü olduğu anne, baba, eş ve çocuklarının ağır bir kaza geçirmesi veya tedavisi uzun süren bir hastalığının bulunması hallerinde 3 aya kadar refakat izni verilir.',
        implication: 'Tek hekim raporları bir defada en çok 10 gün, yılda toplam 40 günü geçemez. Bu süreyi aşan raporlar sağlık kurulu tarafından verilmelidir.'
      }
    ]
  },
  {
    id: 'sozlesmeli-personel-3-1',
    title: 'Sözleşmeli Sağlık Personeli İstihdamı (3+1 Modeli)',
    code: 'KHK / 663 Madde 45/A',
    category: 'sozlesmeli',
    summary: '663 sayılı KHK uyarınca KPSS puanıyla atanan sözleşmeli sağlık personelinin 3 yıl sözleşmeli, ardından kadroya geçerek 1 yıl da aday memur olarak çalışmasını öngören istihdam modelidir.',
    lastUpdated: '10.12.2025',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=663&MevzuatTur=3&MevzuatTertip=5',
    fullText: 'Bu kanun maddesi uyarınca istihdam edilen sözleşmeli sağlık personeli, atandıkları yerlerde üç yıl süreyle fiilen görev yapmak zorundadır. Üç yıllık sürenin sonunda, yapılacak sınav veya performans değerlendirmesi ile başarılı olanlar talepleri halinde kadroya geçirilir. Kadroya geçirilen personel aynı yerde en az bir yıl daha görev yapmakla yükümlüdür.',
    importantArticles: [
      {
        number: 'KHK 45/A - Fıkra 3',
        title: 'Eş Durumu ve Mazeret Tayini Kısıtlaması',
        content: 'Sözleşmeli sağlık personeli, 3 yıllık çalışma süresini tamamlamadan eş durumu mazeretiyle yer değişikliği talebinde bulunamaz. Ancak eşinin de 663 sayılı KHK kapsamında sözleşmeli personel olması veya kamu görevlisi olması koşuluyla istisnalar mevcuttur.',
        implication: 'Eş durumu tayini isteyebilmek için iki tarafın da 3 yıllık fiili hizmet süresini doldurması ya da diğer eşin tayin imkanı olmayan bir kamu görevinde (TSK, Emniyet vb.) olması gerekir. Özel sektör çalışanları için eş durumu tayini 3 yıl dolmadan yapılamaz.'
      },
      {
        number: 'KHK 45/A - Fıkra 5',
        title: 'Kadroya Geçiş İşlemleri',
        content: '3 yıllık çalışma süresini tamamlayan sözleşmeli personel, EKİP portalı üzerinden yapılacak başvuru ve il sağlık müdürlüğü onayı ile kadrolu memur statüsüne (4/A) geçirilir.',
        implication: 'Kadroya geçiş yazısı tebliğ edildikten sonra personel "Aday Memur" olarak 1 yıl süreyle aynı kurumda görevine devam eder. Bu sürede "Yıllık İzin Devri" yapılamaz, hakları sıfırlanır.'
      }
    ]
  },
  {
    id: 'ekip-portal-yonerge',
    title: 'EKİP Portalı ve ÇKYS Entegrasyon Genelgesi',
    code: 'Yönerge / SB-BSGM-2024',
    category: 'ekip',
    summary: 'ÇKYS (Çekirdek Kaynak Yönetim Sistemi) ve KYS yazılımlarının kapatılarak tüm işlemlerin EKİP (Entegre Kurumsal İşlem Platformu) üzerine aktarılması yönergesidir.',
    lastUpdated: '28.11.2025',
    officialLink: 'https://ekip.saglik.gov.tr',
    fullText: 'Sağlık Bakanlığı Bilgi Sistemleri Genel Müdürlüğü tarafından yayımlanan bu yönerge ile insan kaynakları, tescil, terfi, disiplin, özlük, hizmet puanı ve eğitim işlemlerinin tamamı EKİP platformuna taşınmıştır. Sistemde yer almayan hiçbir personelin göreve başlama ve ayrılış tescili yapılamaz, tescili olmayan personele maaş ödemesi gerçekleştirilemez.',
    importantArticles: [
      {
        number: 'Madde 4',
        title: 'Anlık Göreve Başlama ve Ayrılış Tescili',
        content: 'Açıktan atanan, tayini çıkan veya ücretsiz izne ayrılan tüm personelin göreve başlama ve ayrılış bildirimleri, fiili işlemin gerçekleştiği gün mesai bitimine kadar EKİP platformuna işlenmek zorundadır.',
        implication: 'Gecikmeli girilen tesciller SGK işe giriş/çıkış bildirgeleriyle çeliştiğinde kuruma idari para cezası uygulanır. Sorumluluk işlemi yapan özlük birimindedir.'
      },
      {
        number: 'Madde 8',
        title: 'Hizmet İçi Eğitim ve Sertifika Tescilleri',
        content: 'Bakanlık onaylı sertifikalı eğitimler ile kurum içi zorunlu eğitimler EKİP sistemi üzerinde tescil edilmedikçe personelin özlük dosyasında ve hizmet puanı hesaplamasında geçerli kabul edilmez.',
        implication: 'Özellikle yoğun bakım, acil tıp ve ameliyathane sertifikalarının EKİP tescili, o birimlerde "Sertifikalı Personel" olarak çalıştırılabilme şartının önkoşuludur.'
      }
    ]
  },
  {
    id: '657-disiplin-hukumleri',
    title: '657 Sayılı Kanun - Disiplin Hükümleri ve Cezalar',
    code: 'Kanun / 657 - Disiplin',
    category: 'disiplin',
    summary: 'Sağlık personeline uygulanabilecek disiplin cezalarını, cezayı gerektiren fiilleri, savunma hakkı ve zamanaşımı sürelerini belirleyen yasal çerçevedir.',
    lastUpdated: '10.01.2026',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=657&MevzuatTur=1&MevzuatTertip=5',
    fullText: 'Devlet memurlarının kamu hizmetlerini düzenli ve etkin bir şekilde yürütmesini sağlamak amacıyla, kanun, tüzük ve yönetmeliklerin emrettiği ödevleri yurt içinde veya yurt dışında yerine getirmeyenlere, uyulmasını zorunlu kıldığı hususları yapmayanlara uygulanacak disiplin cezaları belirlenmiştir. Cezalar; Uyarma, Kınama, Aylıktan Kesme, Kademe İlerlemesinin Durdurulması ve Devlet Memurluğundan Çıkarma şeklindedir.',
    importantArticles: [
      {
        number: 'Madde 125',
        title: 'Disiplin Cezası Çeşitleri ve Cezayı Gerektiren Fiiller',
        content: 'Uyarma, Kınama, Aylıktan kesme (Brüt aylığın 1/30 - 1/8 oranında kesilmesi), Kademe ilerlemesinin durdurulması (1 - 3 yıl süreyle) ve Devlet memurluğundan çıkarma cezalarının hangi somut kusurlu davranışlarda verileceğini tek tek listeler.',
        implication: 'Göreve özürsüz olarak 1 veya 2 gün gelmemek Aylıktan Kesme cezası; kesintisiz 3-9 gün gelmemek Kademe İlerlemesinin Durdurulması cezası; bir yılda toplam 20 gün gelmemek ise Memuriyetten Çıkarma cezası gerektirir.'
      },
      {
        number: 'Madde 129',
        title: 'Savunma Hakkı ve Karar Süresi',
        content: 'Devlet memuru hakkında savunması alınmadan disiplin cezası verilemez. Soruşturmayı yapanın veya yetkili disiplin kurulunun yedi günden az olmamak üzere verdiği süre içinde veya belirtilen tarihte savunmasını yapmayan memur, savunma hakkından vazgeçmiş sayılır.',
        implication: 'Disiplin soruşturmalarında memura en az 7 gün yazılı savunma süresi tanınması zorunludur. Aksi halde verilen ceza idari mahkemelerce usul yönünden iptal edilir.'
      }
    ]
  }
];

interface FAQItem {
  question: string;
  answer: string;
  reference: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'Eş durumu tayini için özel sektörde çalışan eşin kaç gün prim ödemiş olması gerekir?',
    answer: 'Özel sektörde aktif çalışan eşin, başvuru tarihi itibarıyla son dört yılda en az 720 gün sosyal güvenlik primi ödenmiş olması ve halen çalışıyor olması şarttır. Kesintili primler de bu hesaba dahil edilir.',
    reference: 'Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği - Madde 20',
    tags: ['Eş Durumu', 'Tayin', 'Özel Sektör']
  },
  {
    question: 'Hizmet yılına göre yıllık izin hakları kaç gündür ve sonraki yıla devreder mi?',
    answer: 'Hizmet süresi 1 yıldan 10 yıla kadar olan memurların 20 gün, 10 yıldan fazla olan memurların ise 30 gün yıllık izin hakkı bulunur. Cari yılda kullanılmayan izin hakları sadece takip eden bir sonraki takvim yılına devreder. İkinci yılda da kullanılmayan izinler tamamen yanar.',
    reference: '657 Sayılı Kanun - Madde 102 & 103',
    tags: ['Yıllık İzin', 'Haklar', 'İzin Devri']
  },
  {
    question: 'Sözleşmeli (3+1) sağlık personeli hangi hallerde tayin isteyebilir?',
    answer: '3 yıllık sözleşmeli süresini doldurmayan personel ancak can güvenliği mazereti, eşinin de başka bir ilde 663 KHK kapsamında sözleşmeli personel olması veya eşinin nakli mümkün olmayan bir kamu görevlisi olması durumunda kısıtlı mazeret tayini isteyebilir. Standart eş durumu veya eğitim durumu tayini için 3 yılın fiilen dolması gerekir.',
    reference: '663 Sayılı KHK - Madde 45/A',
    tags: ['3+1', 'Sözleşmeli', 'Tayin Kısıtlaması']
  },
  {
    question: 'Göreve mazeretsiz olarak kaç gün gelmemek memuriyetten çıkarma cezası gerektirir?',
    answer: 'Özürsüz veya izinsiz olarak kesintisiz 10 gün göreve gelmeyen memur, yazılı uyarıya gerek kalmaksızın çekilmiş (istifa etmiş) sayılır. Bir takvim yılı içinde toplamda mazeretsiz 20 gün göreve gelmeyen memurun ise devlet memurluğundan çıkarma cezası ile ilişiği kesilir.',
    reference: '657 Sayılı Kanun - Madde 94 & Madde 125',
    tags: ['Müstafi', 'Disiplin', 'Memuriyetten Çıkarma']
  },
  {
    question: 'Hastalık raporları kuruma ne kadar sürede teslim edilmelidir?',
    answer: 'Hastalık raporlarının, alındığı günün mesai saati bitimine kadar veya en geç ertesi gün mesai başlangıcına kadar sözlü ya da elektronik iletişim kanallarıyla birim amirine bildirilmesi ve asıllarının en geç 3 iş günü içinde kuruma teslim edilmesi şarttır.',
    reference: 'Devlet Memurlarına Verilecek Hastalık Raporları Yönetmeliği - Madde 7',
    tags: ['Sağlık Raporu', 'Hastalık İzni', 'Teslim Süresi']
  }
];

export function MevzuatBankasi() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<LegislationItem | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLegislation = useMemo(() => {
    return LEGISLATION_DATA.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullText.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const filteredFaq = useMemo(() => {
    if (!faqSearch) return FAQ_DATA;
    return FAQ_DATA.filter(faq => 
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(faqSearch.toLowerCase()))
    );
  }, [faqSearch]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'Tüm Mevzuatlar', icon: BookOpen },
    { id: 'atama', label: 'Atama & Nakil', icon: Briefcase },
    { id: 'izin', label: 'İzin & Haklar', icon: Calendar },
    { id: 'disiplin', label: 'Disiplin & Soruşturma', icon: ShieldAlert },
    { id: 'sozlesmeli', label: 'Sözleşmeli Personel (3+1)', icon: Clock },
    { id: 'ekip', label: 'EKİP & ÇKYS Sistemleri', icon: FileText },
  ];

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/20">
              <Scale size={14} /> Sağlık Mevzuatı Portalı
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Sağlık Mevzuatı ve Karar Destek Bilgi Bankası</h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              İl Sağlık Müdürlüğü ve bağlı sağlık tesisleri için atama, nakil, özlük hakları, disiplin işlemleri ve EKİP sistem entegrasyonuna ilişkin resmi mevzuat ve uygulama esasları rehberi.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl shrink-0 self-stretch md:self-center flex flex-col justify-center">
            <div className="text-xs text-slate-300 font-bold tracking-wider uppercase mb-1">YÜKLÜ MEVZUAT METNİ</div>
            <div className="text-2xl font-black text-white flex items-baseline gap-1">
              {LEGISLATION_DATA.length} <span className="text-xs text-blue-300 font-normal">Ana Kategorilerde</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Mevzuat Arama ve Liste */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <BookMarked size={18} className="text-blue-600" />
                Resmi Mevzuat Kılavuzları
              </h3>
              
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Mevzuat veya kanun ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legislation Cards */}
          <div className="space-y-4">
            {filteredLegislation.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search size={20} />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Arama Sonucu Bulunamadı</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Girdiğiniz arama terimine uygun mevzuat kaydı bulunmamaktadır. Farklı anahtar kelimelerle arama yapmayı veya filtreleri sıfırlamayı deneyebilirsiniz.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            ) : (
              filteredLegislation.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-200 transition-all group"
                >
                  <div className="p-5 md:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {item.code}
                          </span>
                          <span className="text-[10px] text-slate-400">Güncelleme: {item.lastUpdated}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      
                      <a 
                        href={item.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all shrink-0 border border-slate-100"
                        title="Resmi Mevzuat Sistemine Git"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      {item.summary}
                    </p>

                    {/* Important Articles Quick List */}
                    <div className="space-y-3 pt-2">
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Öne Çıkan Önemli Maddeler</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.importantArticles.slice(0, 2).map((art, idx) => (
                          <div 
                            key={idx}
                            className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 p-3.5 rounded-xl transition-all cursor-pointer flex flex-col justify-between"
                            onClick={() => setSelectedItem(item)}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                  {art.number}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">{art.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                                {art.content}
                              </p>
                            </div>
                            <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-2 justify-end">
                              İncele <ArrowUpRight size={11} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 flex-wrap gap-3">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Sağlık Kurumu İş Akışları & Özlük Uyumluluğu İçin Önemlidir.
                      </span>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <BookOpen size={13} /> Tamamını ve Maddeleri İncele
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Column: Soru-Cevap & Faydalı İpuçları */}
        <div className="space-y-6">
          {/* Hızlı Soru-Cevap Simgesi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <HelpCircle size={18} className="text-indigo-600" />
                Mevzuat Soru-Cevap
              </h3>
              <p className="text-xs text-slate-500">
                Sık karşılaşılan özlük ve tescil senaryolarına yönelik hızlı çözümler.
              </p>
            </div>

            {/* Soru Arama Kutusu */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Soru veya etiket ara..."
                value={faqSearch}
                onChange={(e) => {
                  setFaqSearch(e.target.value);
                  setExpandedFaqIndex(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredFaq.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">Kriterlere uygun soru bulunamadı.</p>
              ) : (
                filteredFaq.map((faq, idx) => {
                  const isExpanded = expandedFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30 hover:bg-slate-50 transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                        className="w-full text-left p-3.5 flex items-start justify-between gap-2.5 cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-700 line-clamp-2 leading-relaxed">
                          {faq.question}
                        </span>
                        <span className="text-slate-400 shrink-0 pt-0.5">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-slate-100 text-[11px] text-slate-600 space-y-3 animate-in slide-in-from-top-1 duration-150">
                          <p className="leading-relaxed font-medium text-slate-600">
                            {faq.answer}
                          </p>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/60 flex items-start gap-1">
                            <span className="font-bold text-indigo-600">Referans:</span>
                            <span className="font-mono text-[10px] text-slate-500">{faq.reference}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {faq.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mevzuat Uyarı Paneli */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-200/60 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle size={18} className="shrink-0" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider">İdari Süreç Uyarısı</h4>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Mevzuatta yapılan değişiklikler ve EKİP sistemindeki güncellemeler, İl Sağlık Müdürlükleri tarafından duyurulmaktadır. İşlemleri gerçekleştirmeden önce mutlaka en güncel bakanlık tebliğlerini kontrol ediniz.
            </p>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-100 text-[10px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-700">📌 Hatırlatma:</div>
              Özlük tescil işlemlerinin geriye dönük hatalı yapılması, SGK cezalarına ve personelin mali kayıplarına neden olabilir.
            </div>
          </div>
        </div>
      </div>

      {/* Legislation Detail Modal / Drawer */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative border border-slate-200 my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 md:p-8 text-white relative">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
                title="Kapat"
              >
                <Check size={18} />
              </button>
              
              <div className="space-y-2 max-w-[90%]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-blue-100">
                    {selectedItem.code}
                  </span>
                  <span className="text-[10px] text-blue-200">Güncelleme: {selectedItem.lastUpdated}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight">{selectedItem.title}</h3>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              
              {/* Scope & Full Text Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-600" /> Kapsam ve Genel Bakış
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {selectedItem.fullText}
                </p>
              </div>

              {/* Important Articles Full Specification */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <FileText size={14} className="text-blue-600" /> Kritik Maddeler ve İdari Yansımaları
                </h4>
                
                <div className="space-y-4">
                  {selectedItem.importantArticles.map((art, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-3 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-2.5">
                        <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg">
                          {art.number}
                        </span>
                        <h5 className="font-extrabold text-slate-800 text-xs md:text-sm">{art.title}</h5>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-[11px] text-slate-700 leading-relaxed font-medium">
                          <strong>Kanun/Yönetmelik Metni:</strong> {art.content}
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-[11px] text-blue-900 flex gap-2">
                          <CheckCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Kurumsal Uygulama & Öneri:</strong> {art.implication}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
              <button
                onClick={() => handleCopyText(selectedItem.title + '\n\n' + selectedItem.fullText, selectedItem.id)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {copiedId === selectedItem.id ? (
                  <>
                    <Check size={14} className="text-green-600" /> Kopyalandı!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Bilgileri Kopyala
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <a 
                  href={selectedItem.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-200"
                >
                  🌐 Resmi Gazete Metni <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
