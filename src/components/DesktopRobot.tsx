import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageSquare, 
  Plus, 
  HelpCircle, 
  X, 
  Zap, 
  Coffee, 
  Volume2, 
  VolumeX, 
  Settings, 
  Minimize2, 
  Maximize2, 
  EyeOff,
  Pencil,
  Check,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import { WorkflowTemplate, ActiveStep } from '../types';

interface DesktopRobotProps {
  setIsAssistantOpen: (open: boolean) => void;
  openNewTemplateModal: () => void;
  workflows: WorkflowTemplate[];
  onStartWorkflow: (wf: WorkflowTemplate) => void;
  isStandalone?: boolean;
  activeStep?: ActiveStep | null;
}

type RobotState = 'idle' | 'happy' | 'thinking' | 'waving' | 'sleepy';

export function DesktopRobot({ 
  setIsAssistantOpen, 
  openNewTemplateModal, 
  workflows, 
  onStartWorkflow,
  isStandalone = false,
  activeStep = null
}: DesktopRobotProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [bubbleText, setBubbleText] = useState<string>('Merhaba! Ben senin Kurumsal Süreç Asistanınım. Bugün hangi süreci takip ediyoruz? 🤖\n\n💡 İpucu: Üzerime sağ tıklayarak özel menümü açabilirsin!');
  const [showBubble, setShowBubble] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Daily resetting ISm Status
  const [ismStatus, setIsmStatus] = useState<'pending' | 'sent'>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('ism_daily_date');
      const savedStatus = localStorage.getItem('ism_daily_status');
      if (savedDate === today && savedStatus) {
        return savedStatus as 'pending' | 'sent';
      }
    } catch (e) {
      console.error(e);
    }
    return 'pending';
  });

  const tips = [
    "Uzman Hekim göreve başlamalarında yeni EKİP (Entegre Kurumsal İşlem Platformu) kaydı düştükten sonra 15 gün içinde tebligat yapılmalıdır.",
    "4/B Sözleşmeli personelin işe başlama evraklarında Güvenlik Soruşturması ve Arşiv Araştırması belgesi kritik önem taşır (7315 Sayılı Güvenlik Soruşturması Kanunu).",
    "Sürekli işçi girişlerinde SGK işe giriş bildirgesinin en geç işe başlamadan 1 gün önce yapılması yasal zorunluluktur (5510 Sayılı Kanun Md. 8).",
    "KVKK uyarınca, personelin sağlık raporu ve sabıka kaydı gibi hassas kişisel verileri kilitli dolaplarda saklanmalı ve yetkisiz erişim engellenmelidir.",
    "Süreç adımlarını eksiksiz tamamlamak için sağ taraftaki yapay zekâ asistanına her zaman danışabilirsin!",
    "Kurumunuza özel yeni bir süreç tasarlamak için sol alt kısımdaki 'Yeni Şablon Tasarla' seçeneğini kullanabilirsiniz.",
    "Yıllık izin taleplerinde, memurun çalışılan yıla ait hak ettiği izin süresi ile bir önceki yıldan devreden izni birleştirilebilir, ancak daha önceki yılların izni yanar (657 DMK Md. 102).",
    "Kadın memura, doğum sonrası analık izni süresinin bitiminden itibaren ilk altı ayda günde 3 saat, ikinci altı ayda günde 1,5 saat süt izni verilir. İznin kullanılacağı saatleri kadın memur kendisi tercih eder (657 DMK Md. 104/D).",
    "Doğum sonrası analık izni bitiminden itibaren kadın memur (veya 3 yaşını doldurmamış çocuğu evlat edinen memur) birinci doğumda 2 ay, ikinci doğumda 4 ay, sonraki doğumlarda ise 6 ay süreyle yarım zamanlı (günlük çalışma süresinin yarısı kadar) çalışabilir (657 DMK Md. 104/F).",
    "Refakat izni; memurun bakmakla yükümlü olduğu veya refakat etmediği takdirde hayatı tehlikeye girecek ana, baba, eş ve çocukları ile kardeşlerinin ağır kaza geçirmesi veya tedavisi uzun süren bir hastalığının bulunması hâllerinde sağlık kurulu raporuyla belgelendirilmesi şartıyla 3 aya kadar verilir ve en fazla bir katına kadar (toplam 6 aya kadar) uzatılır (657 DMK Md. 105).",
    "Memura; kendisinin veya çocuğunun evlenmesi ya da eşinin, çocuğunun, kendisinin veya eşinin ana, baba ve kardeşinin ölümü hâllerinde isteği üzerine 7 gün mazeret izni verilir (657 DMK Md. 104/B).",
    "Müstafi sayılma: İzinsiz veya özürsüz olarak kesintisiz 10 gün görevini terk eden memur, yazılı müracaat şartı aranmaksızın görevden çekilmiş (müstafi) sayılır (657 DMK Md. 94).",
    "Aday memurluk süresi asgari 1 yıl, azami 2 yıldır. Bu süre içinde olumsuz değerlendirilen veya disiplin cezası alan aday memurların görevine son verilir (657 DMK Md. 54-57).",
    "Devlet hizmeti yükümlülüğü (DHY) kapsamındaki tabipler, atanma kararlarının ilanından itibaren yol süresi hariç 15 gün içinde görevlerine başlamalıdır (657 DMK Md. 62).",
    "Tabipler ve diş tabiplerinin nöbet ücretleri, diğer sağlık personeline oranla Bakanlıkça belirlenen özel katsayılar üzerinden artırımlı ödenir (657 DMK Ek Madde 33).",
    "4/B sözleşmeli personelin yıllık izin hakları bir sonraki yıla devredilemez, ilgili takvim yılı içinde kullanılmayan izinler yanar (Sözleşmeli Personel Çalıştırılmasına İlişkin Esaslar).",
    "Becayiş (Karşılıklı yer değiştirme), aynı unvan ve branştaki personellerin karşılıklı anlaşarak yer değiştirmesidir ve İl Sağlık Müdürlüğü onayıyla gerçekleştirilir (657 DMK Md. 73).",
    "Geçici görevlendirme süresi, bir takvim yılı içinde her ne suretle olursa olsun toplamda 6 ayı geçemez (Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği).",
    "Personelin ad soyad değişikliği, evlilik veya boşanma durumlarında nüfus kayıt örneği ve dilekçesi alınarak EKİP (eski ÇKYS) üzerinde güncellenmelidir.",
    "Sendika üyelik formu veya çekilme formu alındığında, maaş mutemetliğine 3 iş günü içinde bildirilerek kesinti durumu güncellenmelidir (4688 Sayılı Kanun).",
    "Mal bildirimi beyannamesi, sonu (0) ve (5) ile biten yıllarda en geç Şubat ayı sonuna kadar tüm devlet memurları tarafından yenilenmelidir (3628 Sayılı Kanun Md. 6).",
    "Her gün mesai bitiminden önce Günlük Personel Hareket Listesi mutlaka İl Sağlık Müdürlüğü (İSM) İnsan Kaynakları Şubesi'ne gönderilmelidir.",
    "Disiplin amiri, disiplin suçu teşkil eden eylemi öğrendiği tarihten itibaren en geç 1 ay içinde soruşturma başlatmak zorundadır, aksi takdirde soruşturma açma yetkisi zamanaşımına uğrar (657 DMK Md. 127).",
    "Eşinin doğum yapması halinde memura isteği üzerine 10 gün mazeret (babalık) izni verilir (657 DMK Md. 104/B).",
    "Memura tek hekim raporu ile bir defada en çok 10 gün rapor verilebilir. Raporda kontrol süresi belirtilmişse tek hekim bunu en çok 10 gün daha uzatabilir. Bir takvim yılında tek hekim raporları toplamı 40 günü geçemez (Hastalık Raporları Yönetmeliği Md. 6).",
    "En az %70 oranında engelli veya süreğen hastalığı olan çocuğu hastalanan memura, bir yıl içinde toptan veya bölümler hâlinde 10 güne kadar mazeret izni verilir (657 DMK Md. 104/E).",
    "Radyonüklit ve iyonizan radyasyonla çalışan personele, her yıl yıllık izinlerine ilaveten 30 gün ücretli sağlık izni (şua izni) verilmesi zorunludur.",
    "Memuriyetten usulüne uygun istifa edenler 6 ay geçmeden tekrar memurluğa atanamazlar. Usulüne uymadan görevden ayrılanlar ise 1 yıl devlet memurluğuna geri dönemezler (657 DMK Md. 97).",
    "Sendikadan çekilmek (istifa) isteyen memur, 3 nüsha çekilme formunu doldurup kuruma teslim eder. Çekilme, bildirim tarihinden itibaren 30 gün sonra geçerlilik kazanır (4688 Sayılı Kanun Md. 16).",
    "Personelin aldığı istirahat raporunu, en geç raporun alındığı günü takip eden iş gününün mesai bitimine kadar kurumuna (evrak kayıt birimine) ulaştırması zorunludur.",
    "Aylıktan kesme cezası kapsamında, memurun brüt aylığının 1/30 ile 1/8 arasında kesinti yapılır. Tebliğ tarihinden itibaren 15 gün içinde itiraz edilmezse ceza kesinleşir (657 DMK Md. 125/C).",
    "Hizmet süresi 1 yıldan 10 yıla kadar olan sağlık personeli ve memurların yıllık izin süresi 20 gün, 10 yıldan fazla olanların ise 30 gündür (657 DMK Md. 102)."
  ];

  const getProactiveMevzuatTip = (step: ActiveStep) => {
    const title = step.title.toLowerCase();
    
    if (title.includes('evrak') || title.includes('belge') || title.includes('diploma') || title.includes('adli sicil')) {
      return `📌 GÖREVE BAŞLAMA EVRAKLARI (Mevzuat Hatırlatması):\n\n657 DMK Madde 48 uyarınca memuriyete girişte diploma aslı veya onaylı sureti, adli sicil kaydı ve sağlık kurulu raporu şarttır. Evrak fotokopilerinin üzerine 'Aslı Görülmüştür' kaşesi vurulmalı ve paraf atılmalıdır.`;
    }
    if (title.includes('sözleşme') || title.includes('hizmet sözleşmesi')) {
      return `✍️ HİZMET SÖZLEŞMESİ (Mevzuat Hatırlatması):\n\nSözleşmeli Personel Esasları Madde 5 gereğince, sözleşmeler her mali yıl için ayrı düzenlenir. Sözleşmenin tüm sayfaları hem personel hem de müdürlük yetkilisi tarafından imzalanmalı ve birer nüsha taraflarda kalmalıdır.`;
    }
    if (title.includes('sgk') || title.includes('sigorta') || title.includes('işe giriş')) {
      return `🚨 SGK İŞE GİRİŞ BİLDİRGESİ (Yasal Zorunluluk):\n\n5510 Sayılı Kanun Madde 8 gereği, 4/B sözleşmeli personelin işe giriş bildirgesi en geç göreve başlamasından bir gün önce SGK sistemine girilmelidir. Geç bildirim durumunda asgari ücret tutarında idari para cezası uygulanır!`;
    }
    if (title.includes('banka') || title.includes('iban') || title.includes('maaş') || title.includes('hesap')) {
      return `💳 MAAŞ VE BANKA İŞLEMLERİ (Mevzuat Hatırlatması):\n\n657 DMK Madde 164 uyarınca devlet memurlarına maaşlar her ayın 15'inde peşin ödenir. Personelin göreve başlama tarihi ay ortasındaysa, takip eden ayın 15'inde geriye dönük kıst maaş (günlük) hesabı yapılarak ödeme listesine eklenmelidir.`;
    }
    if (title.includes('sistem') || title.includes('ekip') || title.includes('çkys') || title.includes('ortak') || title.includes('kayıt')) {
      return `💻 EKİP SİSTEMİ VERİ GİRİŞİ (Sistem Bildirimi):\n\nSağlık Bakanlığı personellerinin atama ve işe başlama onayları artık yeni EKİP (Entegre Kurumsal İşlem Platformu - eski ÇKYS) üzerinden yapılmaktadır. EKİP sistemi başlama tarihi girilmeden personelin aktiflik durumu tetiklenmez ve maaş işlemleri başlatılamaz.`;
    }
    if (title.includes('dys') || title.includes('üst yazı') || title.includes('yazışma') || title.includes('resmi yazı')) {
      return `✉️ DYS ÜST YAZI HAZIRLAMA (Resmî Yazışma Kuralları):\n\nResmî Yazışma Kuralları Yönetmeliği uyarınca, göreve başlama üst yazıları DYS (Doküman Yönetim Sistemi) üzerinden elektronik imzalı olarak İl Sağlık Müdürlüğü'ne iletilir. Sayı numarası ve tarih otomatik üretilir.`;
    }
    if (title.includes('etik') || title.includes('taahhütname') || title.includes('etik sözleşmesi')) {
      return `⚖️ ETİK SÖZLEŞMESİ & TAAHHÜT (Mevzuat Hatırlatması):\n\nKamu Görevlileri Etik Davranış İlkeleri Yönetmeliği gereği, göreve başlayan her personelden ilk hafta içerisinde 'Kamu Görevlileri Etik Sözleşmesi' belgesi imzalı olarak alınmalı ve şahsi özlük dosyasına konulmalıdır.`;
    }
    if (title.includes('oryantasyon') || title.includes('eğitim') || title.includes('uyum')) {
      return `🎯 ADAYLIK VE ORYANTASYON SÜRECİ (DMK Madde 54):\n\nAday memurluk süresi 1 yıldan az 2 yıldan çok olamaz. Bu süreçte adayın temel eğitim, hazırlayıcı eğitim ve staj eğitimlerini başarıyla tamamlaması şarttır. Oryantasyon programı süreci kolaylaştırır.`;
    }
    
    return `💡 ADIM İPUCU [${step.title}]:\n\n${step.description}\n\nYasal Mevzuat: ${step.helpText}`;
  };

  const activeStepId = activeStep?.id;
  const activeStepTitle = activeStep?.title;

  // Proactive context-aware Mevzuat İpucu notification
  useEffect(() => {
    if (activeStep && !isMinimized && isVisible) {
      // Simulate analysis
      setRobotState('thinking');
      playBeep(520, 80);
      
      const timer = setTimeout(() => {
        setRobotState('happy');
        const tipText = getProactiveMevzuatTip(activeStep);
        setBubbleText(tipText);
        setShowBubble(true);
        // Play a cheerful double-beep
        playBeep(660, 80);
        setTimeout(() => playBeep(880, 100), 80);
        
        // Reset state to idle after some time
        const idleTimer = setTimeout(() => {
          setRobotState('idle');
        }, 3500);
        
        return () => clearTimeout(idleTimer);
      }, 800); // 800ms thinking delay
      
      return () => clearTimeout(timer);
    }
  }, [activeStepId, activeStepTitle, isMinimized, isVisible]);

  // Auto show a tip or wave occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6 && !isMinimized && isVisible) {
        setRobotState('waving');
        const nextTip = tips[Math.floor(Math.random() * tips.length)];
        setBubbleText(`💡 Faydalı Bilgi:\n${nextTip}`);
        setShowBubble(true);
        playBeep(440, 100);

        setTimeout(() => {
          setRobotState('idle');
        }, 3000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isMinimized, isVisible]);

  // Handle outside click to close context menu
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // Audio synthesizer for micro sound effects (doesn't require static assets)
  const playBeep = (freq = 440, duration = 80) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Audio output failed:', e);
    }
  };

  const handleInteract = (state: RobotState, text: string) => {
    setRobotState(state);
    setBubbleText(text);
    setShowBubble(true);
    
    let pitch = 500;
    if (state === 'happy') pitch = 650;
    if (state === 'thinking') pitch = 350;
    playBeep(pitch, 120);

    setTimeout(() => {
      setRobotState('idle');
    }, 4000);
  };

  const showNextTip = () => {
    const nextIdx = (tipIndex + 1) % tips.length;
    setTipIndex(nextIdx);
    handleInteract('thinking', `💡 Önemli İpucu:\n${tips[nextIdx]}`);
  };

  const markIsmAsSent = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('ism_daily_status', 'sent');
    localStorage.setItem('ism_daily_date', today);
    setIsmStatus('sent');
    handleInteract('happy', "Harika! Günlük Personel Hareket Listesi İSM'ye başarıyla iletildi olarak işaretlendi. Teşekkürler! 👍📁");
  };

  const resetIsmStatus = () => {
    localStorage.removeItem('ism_daily_status');
    localStorage.removeItem('ism_daily_date');
    setIsmStatus('pending');
    handleInteract('idle', "Günlük Personel Hareket Listesi durumu sıfırlandı. Hatırlatıcı tekrar aktif! ⏰");
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
    playBeep(600, 60);
  };

  if (isStandalone) {
    return (
      <div 
        style={{ WebkitAppRegion: 'drag' } as any}
        className="flex flex-col items-center justify-center w-full min-h-screen bg-transparent text-slate-800 p-4 relative overflow-hidden select-none"
      >
        {/* Minimalist title/control bar */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-slate-400 z-10 pointer-events-auto">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            🤖 Asistan Widget
          </span>
          <button 
            onClick={() => window.close()}
            style={{ WebkitAppRegion: 'no-drag' } as any}
            className="hover:text-red-500 font-bold text-xs transition-colors p-1"
            title="Kapat"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col items-center cursor-default pt-6 max-w-full pointer-events-auto">
          {/* Speech Bubble */}
          <AnimatePresence>
            {showBubble && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ WebkitAppRegion: 'no-drag' } as any}
                className="w-full max-w-[260px] bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-slate-100 flex flex-col gap-2 text-slate-800 text-xs mb-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1">
                  <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1 uppercase tracking-wider">
                    <Zap size={11} className="text-amber-500 animate-pulse" />
                    Asistan Robot
                  </span>
                  <button 
                    onClick={() => setShowBubble(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="text-[11px] font-medium leading-normal text-slate-700 whitespace-pre-line max-h-36 overflow-y-auto">
                  {bubbleText}
                </p>
                <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-50 mt-1">
                  <button
                    onClick={showNextTip}
                    className="bg-orange-50 hover:bg-orange-100 border border-orange-100 text-orange-700 rounded-lg py-1 px-2 text-[9px] font-bold transition-all"
                  >
                    İpucu Ver 💡
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg py-1 px-1.5 text-[9px] font-bold transition-all"
                  >
                    {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascot Drawing */}
          <div 
            className="flex flex-col items-center cursor-pointer"
            style={{ WebkitAppRegion: 'no-drag' } as any}
            onClick={() => {
              if (isMinimized) {
                setIsMinimized(false);
                handleInteract('happy', "Geldim! 😊");
              } else {
                handleInteract('happy', "Yardımcı olabildiğim için mutluyum! Sağ tıklayarak diğer seçeneklerime göz atabilirsin.");
              }
            }}
            onContextMenu={handleContextMenu}
          >
            {isMinimized ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg relative border border-blue-400"
              >
                <Sparkles size={16} className="animate-pulse" />
              </motion.div>
            ) : (
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '20s' }} />
                    <line x1="50" y1="20" x2="50" y2="12" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
                    <motion.circle 
                      cx="50" cy="12" r="5" 
                      fill={robotState === 'thinking' ? '#f97316' : '#3b82f6'} 
                      animate={robotState === 'thinking' ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <rect x="22" y="20" width="56" height="52" rx="18" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" />
                    <rect x="28" y="26" width="44" height="34" rx="10" fill="#1e293b" />
                    {robotState === 'happy' ? (
                      <>
                        <path d="M 34 45 Q 39 37 44 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 56 45 Q 61 37 66 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                      </>
                    ) : robotState === 'thinking' ? (
                      <>
                        <text x="33" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                        <text x="55" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                      </>
                    ) : robotState === 'waving' ? (
                      <>
                        <circle cx="39" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="61" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="33" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                        <circle cx="67" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                      </>
                    ) : (
                      <>
                        <motion.ellipse 
                          cx="39" cy="43" rx="5" ry="5" fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                        <motion.ellipse 
                          cx="61" cy="43" rx="5" ry="5" fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                      </>
                    )}
                    <rect x="42" y="52" width="16" height="4" rx="2" fill={robotState === 'thinking' ? '#f59e0b' : '#10b981'} className={robotState === 'thinking' ? 'animate-pulse' : ''} />
                  </svg>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-2 text-[8px] text-slate-400 text-center w-full pointer-events-none">
          Sürükle & Sağ Tıkla 🖱️
        </div>

        {/* Context Menu inside Standalone */}
        <AnimatePresence>
          {contextMenu && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ top: contextMenu.y, left: contextMenu.x, WebkitAppRegion: 'no-drag' } as any}
              className="fixed z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 py-1.5 w-44 text-slate-800 text-[11px] font-medium pointer-events-auto"
              onContextMenu={(e) => e.preventDefault()}
            >
              <button
                onClick={() => {
                  showNextTip();
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <HelpCircle size={12} className="text-amber-500" />
                <span>Mevzuat İpucu Ver</span>
              </button>
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={12} className="text-blue-500" /> : <VolumeX size={12} className="text-slate-400" />}
                  <span>Asistan Sesleri</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setIsMinimized(!isMinimized);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                <span>{isMinimized ? "Asistanı Büyüt" : "Simge Durumuna Getir"}</span>
              </button>
              <button
                onClick={() => window.close()}
                className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
              >
                <X size={12} />
                <span>Kapat</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <button 
        id="robot-summon-btn"
        onClick={() => {
          setIsVisible(true);
          setIsMinimized(false);
          setShowBubble(true);
          setBubbleText("Tekrar buradayım! İşlemlerinde sana rehberlik etmeye hazırım. 🧑‍🚀");
        }}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-blue-400 pointer-events-auto"
      >
        <Sparkles size={14} className="animate-spin text-amber-200" />
        <span>Asistan Robotu Çağır</span>
      </button>
    );
  }

  return (
    <>
      {/* Viewport boundary container for dragging */}
      <div 
        ref={constraintsRef} 
        className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden"
      >
        {/* Draggable Mascot + Bubble Group */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.05}
          dragConstraints={constraintsRef}
          className="absolute bottom-6 left-6 pointer-events-auto cursor-grab active:cursor-grabbing flex flex-col items-center z-40"
          style={{ x: 0, y: 0 }}
          onContextMenu={handleContextMenu}
        >
          {/* Custom right click indicator */}
          {!isMinimized && (
            <div className="absolute -top-6 text-[9px] bg-slate-900/80 text-white/90 px-2 py-0.5 rounded-full font-medium tracking-tight opacity-0 hover:opacity-100 group transition-opacity duration-300">
              Sağ Tıklayın 🖱️
            </div>
          )}

          {/* Speech Bubble */}
          <AnimatePresence>
            {showBubble && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                onPointerDown={(e) => e.stopPropagation()} // Stop dragging when interacting with bubble
                className="absolute bottom-24 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex flex-col gap-3 text-slate-800 cursor-default"
              >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45"></div>
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 uppercase tracking-wider">
                    <Zap size={12} className="text-amber-500 animate-pulse" />
                    Yapay Zekâ Maskotu
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
                    >
                      {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                    </button>
                    <button 
                      onClick={() => setShowBubble(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold leading-relaxed whitespace-pre-line text-slate-700">
                  {bubbleText}
                </p>

                {/* İSM Daily Report Status Panel */}
                <div className="border-t border-b border-slate-100 py-2.5 my-0.5">
                  {ismStatus === 'pending' ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <ShieldAlert size={15} className="text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Günlük İSM Görevi</p>
                          <p className="text-[10px] text-amber-700 leading-tight">Günlük Personel Hareket Listesi'ni İl Sağlık Müdürlüğü'ne (İSM) göndermeyi unutmayın!</p>
                        </div>
                      </div>
                      <button
                        onClick={markIsmAsSent}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Check size={12} /> İSM'ye Gönderildi Olarak İşaretle
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-2.5 flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">İSM Görevi Tamamlandı</p>
                        <p className="text-[9px] text-emerald-700">Bugünkü Personel Hareket Listesi başarıyla iletildi.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      setIsAssistantOpen(true);
                      handleInteract('happy', "Yapay zekâ asistanımızı açtım! Sağ panelden detaylı sorularını sorabilirsin. 💬");
                    }}
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <MessageSquare size={11} /> Sohbet Başlat
                  </button>
                  <button
                    onClick={() => {
                      openNewTemplateModal();
                      handleInteract('happy', "Harika! Yeni bir süreç tasarlama modülünü açtım. Kolay gelsin!");
                    }}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Plus size={11} /> Süreç Tasarla
                  </button>
                  <button
                    onClick={showNextTip}
                    className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <HelpCircle size={11} /> Bilgi Kartı
                  </button>
                  <button
                    onClick={() => {
                      handleInteract('happy', "Süreçler tıkır tıkır işliyor! Kahveni yudumlarken sakin kalmayı unutma. ☕");
                    }}
                    className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Coffee size={11} /> Kahve Molası
                  </button>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-50 pt-2 mt-1">
                  <span>🤖 Sürükleyip taşıyabilirsiniz</span>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="hover:text-red-500 font-medium transition-colors"
                  >
                    Robotu Gizle
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Mascot */}
          <div 
            className="flex flex-col items-center"
            onClick={() => {
              if (isMinimized) {
                setIsMinimized(false);
                handleInteract('happy', "Merhaba! Geldim, ne yapıyoruz? 😊");
              } else {
                handleInteract('happy', "Dokunulmak hoşuma gidiyor! Sana mevzuat ve süreç takibinde her zaman yardıma hazırım. ✨");
              }
            }}
          >
            {isMinimized ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg relative border border-blue-400"
              >
                <Sparkles size={16} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
              </motion.div>
            ) : (
              <div className="relative">
                {/* Floating Container */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 relative"
                >
                  {/* Robot Body SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    {/* Glowing Aura */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '20s' }} />
                    
                    {/* Antenna */}
                    <line x1="50" y1="20" x2="50" y2="12" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
                    <motion.circle 
                      cx="50" 
                      cy="12" 
                      r="5" 
                      fill={robotState === 'thinking' ? '#f97316' : '#3b82f6'} 
                      animate={robotState === 'thinking' ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />

                    {/* Head Outline */}
                    <rect x="22" y="20" width="56" height="52" rx="18" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" />
                    
                    {/* Face Screen */}
                    <rect x="28" y="26" width="44" height="34" rx="10" fill="#1e293b" />

                    {/* Eyes rendering depending on emotional state */}
                    {robotState === 'happy' ? (
                      <>
                        <path d="M 34 45 Q 39 37 44 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 56 45 Q 61 37 66 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                      </>
                    ) : robotState === 'thinking' ? (
                      <>
                        <text x="33" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                        <text x="55" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                      </>
                    ) : robotState === 'waving' ? (
                      <>
                        <circle cx="39" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="61" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="33" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                        <circle cx="67" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                      </>
                    ) : (
                      <>
                        <motion.ellipse 
                          cx="39" 
                          cy="43" 
                          rx="5" 
                          ry="5" 
                          fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                        <motion.ellipse 
                          cx="61" 
                          cy="43" 
                          rx="5" 
                          ry="5" 
                          fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                      </>
                    )}

                    {/* Mouth LED */}
                    <motion.path 
                      d="M 42 54 L 58 54" 
                      stroke="#38bdf8" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      animate={robotState === 'waving' ? { d: "M 44 53 Q 50 58 56 53" } : {}}
                    />

                    {/* Side ears/bolts */}
                    <rect x="16" y="38" width="6" height="16" rx="2" fill="#94a3b8" />
                    <rect x="78" y="38" width="6" height="16" rx="2" fill="#94a3b8" />
                  </svg>

                  {/* Little waving arm */}
                  {robotState === 'waving' && (
                    <motion.div 
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [-20, 20, -20] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute -right-2 top-8 w-6 h-3 bg-blue-500 rounded-full origin-left border border-blue-600"
                      style={{ transformOrigin: '0% 50%' }}
                    />
                  )}
                </motion.div>
                
                {/* Floating shadow */}
                <div className="w-10 h-1 bg-slate-300/40 rounded-full mx-auto blur-[1px] animate-pulse mt-1"></div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right Click Custom Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 py-2.5 w-64 text-slate-800 text-xs font-medium pointer-events-auto select-none"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => e.stopPropagation()} // Stop propagation so it doesn't trigger drag
          >
            <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Settings size={12} className="text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Asistan Seçenekleri</span>
            </div>
            
            <button
              onClick={() => {
                setIsAssistantOpen(true);
                handleInteract('happy', "Yapay zekâ asistanımızı açtım! Sağ panelden detaylı sorularını sorabilirsin. 💬");
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={14} className="text-blue-500" />
              <span>Sohbet Asistanını Aç</span>
            </button>

            <button
              onClick={() => {
                openNewTemplateModal();
                handleInteract('happy', "Harika! Yeni bir süreç tasarlama modülünü açtım. Kolay gelsin!");
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={14} className="text-emerald-500" />
              <span>Yeni Süreç / Şablon Tasarla</span>
            </button>

            <button
              onClick={() => {
                showNextTip();
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <HelpCircle size={14} className="text-amber-500" />
              <span>Faydalı Mevzuat İpucu Ver</span>
            </button>

            <button
              onClick={() => {
                resetIsmStatus();
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <ShieldAlert size={14} className="text-red-500 animate-pulse" />
              <span>Günlük İSM Görevi Sıfırla</span>
            </button>

            <div className="h-px bg-slate-100 my-1"></div>

            {/* Mascot Mood selection */}
            <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Maskot Duygu Durumu
            </div>
            <div className="grid grid-cols-4 gap-1 px-3 py-1">
              {(['idle', 'happy', 'thinking', 'waving'] as RobotState[]).map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    const textMap: Record<RobotState, string> = {
                      idle: "Normal modda bekliyorum. Yapılacak işleri gözlemliyorum. 🧐",
                      happy: "Harika hissediyorum! Bugün çok verimli bir gün olacak! 🎉",
                      thinking: "Mevzuatı inceliyorum, verileri analiz ediyorum... 🧠",
                      waving: "Sana el sallıyorum! Kolay gelsin mesai arkadaşım! 👋",
                      sleepy: "Esniyorum... Biraz dinlensem fena olmazdı. 💤"
                    };
                    handleInteract(state, textMap[state]);
                    setContextMenu(null);
                  }}
                  className={`text-[9px] font-bold py-1 rounded-md transition-all ${
                    robotState === state 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {state === 'idle' ? 'Sakin' : state === 'happy' ? 'Mutlu' : state === 'thinking' ? 'Düşün' : 'Selam'}
                </button>
              ))}
            </div>

            <div className="h-px bg-slate-100 my-1"></div>

            <button
              onClick={() => {
                const updatedSound = !soundEnabled;
                setSoundEnabled(updatedSound);
                // We set soundEnabled temporarily in this local tick to trigger playBeep immediately
                if (updatedSound) {
                  try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(700, ctx.currentTime);
                    gain.gain.setValueAtTime(0.05, ctx.currentTime);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.1);
                  } catch(e) {}
                }
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={14} className="text-blue-500" /> : <VolumeX size={14} className="text-slate-400" />}
                <span>Asistan Sesleri</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {soundEnabled ? 'Açık' : 'Kapalı'}
              </span>
            </button>

            <button
              onClick={() => {
                setIsMinimized(!isMinimized);
                setContextMenu(null);
                playBeep(400, 80);
              }}
              className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              {isMinimized ? <Maximize2 size={14} className="text-slate-500" /> : <Minimize2 size={14} className="text-slate-500" />}
              <span>{isMinimized ? "Asistanı Büyüt" : "Asistanı Simge Durumuna Getir"}</span>
            </button>

            <button
              onClick={() => {
                setIsVisible(false);
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2.5 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
            >
              <EyeOff size={14} />
              <span>Asistanı Gizle (Kapat)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
