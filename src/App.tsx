import React, { useState, useEffect } from 'react';
import { Assistant } from './components/Assistant';
import { WorkflowRunner } from './components/WorkflowRunner';
import { DesktopRobot } from './components/DesktopRobot';
import { defaultWorkflows, defaultReminders, mockStats, mockOngoingWorkflows } from './data/mockData';
import { ActiveWorkflow, WorkflowTemplate, ActiveStep } from './types';
import { Plus, Bell, Clock, Calendar, CheckSquare, PlayCircle, AlertCircle, CheckCircle, Activity, ShieldCheck, Users, FileText, AlertTriangle, X, Download, Pencil, Trash2, Monitor, Laptop, Smartphone, Info, ExternalLink, Scale, Menu, Sparkles } from 'lucide-react';
import { MevzuatBankasi } from './components/MevzuatBankasi';
// @ts-ignore
import mammoth from 'mammoth';

interface TemplateDoc {
  id: string;
  title: string;
  description: string;
  content: string;
}

const initialTemplates: TemplateDoc[] = [
  {
    id: 't_1',
    title: 'Göreve Başlama Üst Yazısı',
    description: "DYS üzerinden yazılacak göreve başlama yazısının standart formatı (Resmî Yazışma Kurallarına uygun).",
    content: `T.C.
SAĞLIK BAKANLIĞI
[İl Adı] İl Sağlık Müdürlüğü

Sayı : [Evrak Sayısı]                                                              [Tarih]
Konu : Göreve Başlama

                [GÖNDERİLECEK MAKAM ADI]
               ([İlgili Birim/Şube Adı])

İlgi : [Varsa İlgi Yazı Tarih ve Sayısı]

    Bakanlığımızca [Atama Şekli] kapsamında müdürlüğümüze ataması yapılan [Unvan] [Ad Soyad]'ın atamaya esas teşkil eden evrakları incelenmiş olup, görevine başlamasında idari yönden herhangi bir sakınca bulunmamaktadır.

    Adı geçen personelin [Başlama Tarihi] tarihi itibarıyla kurumunuzda göreve başlatılması hususunda;

    Gereğini rica ederim.

                                                                            [İmza Sahibi Ad Soyad]
                                                                            [Unvan]`
  },
  {
    id: 't_2',
    title: 'Mutemetlik Bildirim Formu',
    description: 'Yeni başlayan personelin maaş hesaplaması için gerekli bilgilerin istendiği matbu form yapısı.',
    content: `                [KURUM ADI] MUTEMETLİK BİRİMİNE

Konu: Maaş ve Özlük Bilgileri Bildirimi

    Kurumunuzda yeni göreve başlayan personel olarak, maaş ve diğer mali haklarımın hesaplanmasında kullanılmak üzere gerekli olan kişisel bilgilerim aşağıda sunulmuştur.

    Bilgilerinizi ve gereğini arz ederim.

PERSONEL BİLGİLERİ:
T.C. Kimlik No : 
Adı Soyadı : 
Unvan / Branş : 
Banka ve IBAN No : TR
Medeni Durum : [Evli / Bekar]
Eş Durumu : [Çalışıyor / Çalışmıyor]
Çocuk Sayısı ve Yaşları : 
BES Kesintisi Talebi : [İstiyorum / İstemiyorum]

                                                                            [Tarih]
                                                                            [İmza]
                                                                            [Ad Soyad]`
  },
  {
    id: 't_3',
    title: 'Evrak Teslim Tutanağı',
    description: 'Personelden alınan evrakların asıllarının görüldüğüne ve eksiksiz teslim alındığına dair standart tutanak.',
    content: `                TUTANAKTIR

    Bakanlığımız taşra teşkilatına [Atama Türü/Kurası] kapsamında ataması yapılan aşağıda kimlik bilgileri bulunan personelin, göreve başlama işlemleri için ibraz etmesi gereken evrakların asılları görülerek müdürlüğümüz/başhekimliğimiz tarafından eksiksiz olarak teslim alınmıştır.

    İşbu tutanak taraflarca imza altına alınmıştır.

PERSONEL BİLGİLERİ:
T.C. Kimlik No : 
Adı Soyadı : 
Unvanı : 

TESLİM ALINAN EVRAKLAR:
1- [Evrak Adı] (Aslı Görüldü)
2- [Evrak Adı] (Aslı Görüldü)
3- [Evrak Adı] (Aslı Görüldü)

                                                                            [Tarih]

TESLİM EDEN (Personel)                                     TESLİM ALAN (Kurum Yetkilisi)
İmza                                                       İmza
Ad Soyad                                                   Ad Soyad
                                                           Unvan`
  },
  {
    id: 't_4',
    title: 'Eş Durumu Tayin Dilekçesi',
    description: 'Personelin eş durumu mazeretiyle tayin talebinde bulunması için örnek dilekçe formatı.',
    content: `                                                                            [Tarih]

                [HASTANE / KURUM ADI] BAŞTABİPLİĞİNE
                (İl Sağlık Müdürlüğüne Gönderilmek Üzere)


    Kurumunuz [Kurum Adı]'nde [Unvan] olarak görev yapmaktayım. Eşim [Eşin Kurumu]'nda [Eşin Unvanı] olarak görev yapmaktadır. Eşimin çalışma belgesi ve diğer belgeler dilekçe ekinde olup aile birliğinin sağlanması için tayinimin eşimin görev yaptığı [İl Adı] iline yapılması hususunda;

    Gereğinin yapılmasını arz ederim.



                                                                            [Ad Soyad]
                                                                            [Unvan]




TCKN: [TC Kimlik Numarası]
İletişim: [Telefon Numarası]
Adres: [İkamet Adresi]

EKLER:
1- Eş Görev Belgesi
2- Nüfus Kayıt Örneği
3- Evlenme Cüzdanı Fotokopisi`
  }
];

function App() {
  const [activeWorkflow, setActiveWorkflow] = useState<ActiveWorkflow | null>(null);
  const [selectedStep, setSelectedStep] = useState<ActiveStep | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isEkipModalOpen, setIsEkipModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'library' | 'deadlines' | 'all-workflows' | 'desktop-app' | 'mevzuat'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Clear selectedStep if activeWorkflow is removed
  useEffect(() => {
    if (!activeWorkflow) {
      setSelectedStep(null);
    }
  }, [activeWorkflow]);

  // Set body background to transparent if in mascot-only view
  useEffect(() => {
    const isMascotOnly = typeof window !== 'undefined' && window.location.search.includes('view=mascot-only');
    if (isMascotOnly) {
      document.body.style.setProperty('background-color', 'transparent', 'important');
      document.documentElement.style.setProperty('background-color', 'transparent', 'important');
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.style.setProperty('background-color', 'transparent', 'important');
      }
    }
  }, []);
  
  // PWA Support state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Kurulum şu anda başlatılamıyor. Lütfen tarayıcınızın adres satırındaki 'Uygulamayı Yükle' (⊕ veya yukarı ok) simgesine tıklayarak kurulum yapın.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const openMascotWindow = () => {
    const isElectron = typeof window !== 'undefined' && (
      navigator.userAgent.toLowerCase().includes('electron') ||
      !!(window as any).ipcRenderer ||
      typeof (window as any).require === 'function'
    );

    if (isElectron) {
      try {
        // Since nodeIntegration: true and contextIsolation: false is enabled in electron.cjs
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('open-mascot-widget');
        return;
      } catch (e) {
        console.error("Failed to open mascot widget via IPC, falling back to window.open:", e);
      }
    }

    const width = 280;
    const height = 400;
    const left = window.screen.width - width - 40;
    const top = window.screen.height - height - 100;
    window.open(
      '/?view=mascot-only',
      'AsistanRobotWidget',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no,toolbar=no,location=no,resizable=no,scrollbars=no`
    );
  };

  const [libraryTemplates, setLibraryTemplates] = useState<TemplateDoc[]>(() => {
    try {
      const saved = localStorage.getItem('library_templates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialTemplates;
  });
  const [editingTemplate, setEditingTemplate] = useState<TemplateDoc | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('isakis_workflows_v3');
      if (saved) return JSON.parse(saved);
      
      // If v3 is not found, force defaultWorkflows to load the newly standardized steps
      localStorage.setItem('isakis_workflows_v3', JSON.stringify(defaultWorkflows));
    } catch (e) {
      console.error(e);
    }
    return defaultWorkflows;
  });
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowTemplate | null>(null);

  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowTemplate | null>(null);

  const confirmDeleteWorkflow = () => {
    if (!workflowToDelete) return;
    setWorkflows(prev => {
      const updated = prev.filter(w => w.id !== workflowToDelete.id);
      try {
        localStorage.setItem('isakis_workflows_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setWorkflowToDelete(null);
  };

  // Stateful reminders with localStorage persistence
  const [reminders, setReminders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('yasal_sure_reminders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultReminders;
  });

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => {
      const updated = prev.filter(r => r.id !== id);
      try {
        localStorage.setItem('yasal_sure_reminders', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [ongoingWorkflows, setOngoingWorkflows] = useState<ActiveWorkflow[]>(() => {
    try {
      const saved = localStorage.getItem('ongoing_workflows');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return mockOngoingWorkflows;
  });

  const handleDeleteOngoingWorkflow = (id: string) => {
    setOngoingWorkflows(prev => {
      const updated = prev.filter(w => w.id !== id);
      try {
        localStorage.setItem('ongoing_workflows', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    if (activeWorkflow?.id === id) {
      setActiveWorkflow(null);
    }
  };

  // Dynamic stats states
  const [todayCompleted, setTodayCompleted] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('today_completed');
      if (saved !== null) return parseInt(saved, 10);
    } catch (e) {
      console.error(e);
    }
    return 0; // default starts at 0
  });

  const [totalPersonnel, setTotalPersonnel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('total_personnel');
      if (saved !== null) return parseInt(saved, 10);
    } catch (e) {
      console.error(e);
    }
    return 0; // default starts at 0 (or can be edited)
  });

  // Editing states for stats
  const [isEditingTodayCompleted, setIsEditingTodayCompleted] = useState(false);
  const [tempTodayCompleted, setTempTodayCompleted] = useState('');
  
  const [isEditingTotalPersonnel, setIsEditingTotalPersonnel] = useState(false);
  const [tempTotalPersonnel, setTempTotalPersonnel] = useState('');

  const saveTodayCompleted = () => {
    const val = parseInt(tempTodayCompleted, 10);
    if (!isNaN(val) && val >= 0) {
      setTodayCompleted(val);
      try {
        localStorage.setItem('today_completed', String(val));
      } catch (e) {
        console.error(e);
      }
    }
    setIsEditingTodayCompleted(false);
  };

  const saveTotalPersonnel = () => {
    const val = parseInt(tempTotalPersonnel, 10);
    if (!isNaN(val) && val >= 0) {
      setTotalPersonnel(val);
      try {
        localStorage.setItem('total_personnel', String(val));
      } catch (e) {
        console.error(e);
      }
    }
    setIsEditingTotalPersonnel(false);
  };

  const getPendingDocumentsCount = () => {
    let count = 0;
    ongoingWorkflows.forEach(wf => {
      wf.steps.forEach(step => {
        if (!step.isCompleted) {
          const text = (step.title + " " + step.description + " " + (step.helpText || "")).toLowerCase();
          if (
            text.includes("evrak") || 
            text.includes("belge") || 
            text.includes("form") || 
            text.includes("sözleşme") || 
            text.includes("rapor") || 
            text.includes("beyanname") || 
            text.includes("imza") || 
            text.includes("bildirim") ||
            text.includes("taahhüt")
          ) {
            count++;
          }
        }
      });
    });
    return count;
  };

  // New template creation state
  const [newTemplateType, setNewTemplateType] = useState<'workflow' | 'document'>('workflow');
  
  // For workflows:
  const [newWfTitle, setNewWfTitle] = useState('');
  const [newWfDesc, setNewWfDesc] = useState('');
  const [newWfCategory, setNewWfCategory] = useState('tabip_uzman');
  const [newWfCritical, setNewWfCritical] = useState('');
  const [newWfSteps, setNewWfSteps] = useState<Array<{ id?: string; title: string; description: string; helpText: string }>>([
    { title: 'Evrak Kabulü', description: 'Personelin sunduğu belgeleri inceleyip teslim alın.', helpText: 'Evrak teslim tutanağını düzenleyip imzalayın.' }
  ]);

  // For documents:
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocContent, setNewDocContent] = useState('');

  const openNewTemplateModal = () => {
    setEditingWorkflow(null);
    setNewTemplateType('workflow');
    setNewWfTitle('');
    setNewWfDesc('');
    setNewWfCategory('tabip_uzman');
    setNewWfCritical('');
    setNewWfSteps([
      { title: 'Evrak Kabulü', description: 'Personelin sunduğu belgeleri inceleyip teslim alın.', helpText: 'Evrak teslim tutanağını düzenleyip imzalayın.' }
    ]);
    setNewDocTitle('');
    setNewDocDesc('');
    setNewDocContent(`T.C.
SAĞLIK BAKANLIĞI
[İl Adı] İl Sağlık Müdürlüğü

Sayı : [Evrak Sayısı]                                                              [Tarih]
Konu : [Konu]

                [GÖNDERİLECEK MAKAM ADI]
               ([İlgili Birim/Şube Adı])

İlgi : [Varsa İlgi Yazı Tarih ve Sayısı]

    [Buraya yazışma metnini giriniz. Paragraf başları 4 boşluk bırakılarak yazılmalı ve satırın en başı 4 boşlukla girintili olmalıdır.]

    Gereğini rica ederim.

                                                                            [İmza Sahibi Ad Soyad]
                                                                            [Unvan]`);
    setIsTemplateModalOpen(true);
  };

  const openNewDocumentTemplateModal = () => {
    setEditingWorkflow(null);
    setNewTemplateType('document');
    setNewDocTitle('');
    setNewDocDesc('');
    setNewDocContent(`T.C.
SAĞLIK BAKANLIĞI
[İl Adı] İl Sağlık Müdürlüğü

Sayı : [Evrak Sayısı]                                                              [Tarih]
Konu : [Konu]

                [GÖNDERİLECEK MAKAM ADI]
               ([İlgili Birim/Şube Adı])

İlgi : [Varsa İlgi Yazı Tarih ve Sayısı]

    [Buraya yazışma metnini giriniz. Paragraf başları 4 boşluk bırakılarak yazılmalı ve satırın en başı 4 boşlukla girintili olmalıdır.]

    Gereğini rica ederim.

                                                                            [İmza Sahibi Ad Soyad]
                                                                            [Unvan]`);
    setIsTemplateModalOpen(true);
  };

  const insertFormat = (type: 'tc' | 'center' | 'right-sig' | 'double-sig' | 'sayi-tarih' | 'paragraph', isEdit: boolean) => {
    let textToInsert = '';
    switch (type) {
      case 'tc':
        textToInsert = `                    T.C.
              SAĞLIK BAKANLIĞI
         [İl Adı] İl Sağlık Müdürlüğü\n`;
        break;
      case 'center':
        textToInsert = `                    [BAŞLIK VEYA GÖNDERİLEN MAKAM ADI]\n`;
        break;
      case 'right-sig':
        textToInsert = `\n                                                            [İmza Sahibi Ad Soyad]
                                                            [Unvan / Görev]
                                                            [İmza]\n`;
        break;
      case 'double-sig':
        textToInsert = `\n      Teslim Eden                                                 Teslim Alan
    [Ad Soyad/Unvan]                                            [Ad Soyad/Unvan]
         [İmza]                                                      [İmza]\n`;
        break;
      case 'sayi-tarih':
        textToInsert = `Sayı : [Sayı Girişi]                                               [Tarih]\n`;
        break;
      case 'paragraph':
        textToInsert = `    [Resmi yazışma kurallarına göre paragraf başı 4 boşluk bırakılarak yazılmalı ve iki yana yaslanmalıdır.] `;
        break;
    }

    const textareaId = isEdit ? "edit_doc_content_textarea" : "new_doc_content_textarea";
    const updateState = isEdit 
      ? (val: string) => setEditingTemplate(prev => prev ? { ...prev, content: val } : null)
      : setNewDocContent;

    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = textarea.value;
      const newVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
      updateState(newVal);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 50);
    } else {
      updateState(isEdit && editingTemplate ? editingTemplate.content + textToInsert : newDocContent + textToInsert);
    }
  };

  const openEditWorkflowModal = (wf: WorkflowTemplate) => {
    setEditingWorkflow(wf);
    setNewTemplateType('workflow');
    setNewWfTitle(wf.title);
    setNewWfDesc(wf.description);
    setNewWfCategory(wf.categoryId);
    setNewWfCritical(wf.criticalInfo ? wf.criticalInfo.join('\n') : '');
    setNewWfSteps(wf.steps.map(step => ({
      id: step.id,
      title: step.title,
      description: step.description,
      helpText: step.helpText || ''
    })));
    setIsTemplateModalOpen(true);
  };

  const handleCreateTemplate = () => {
    if (newTemplateType === 'workflow') {
      if (!newWfTitle.trim() || !newWfDesc.trim()) {
        alert('Lütfen süreç adını ve açıklamasını doldurunuz.');
        return;
      }
      
      const stepsWithIds = newWfSteps.map((step, index) => ({
        id: step.id || `s_${Date.now()}_${index}`,
        title: step.title || `Adım ${index + 1}`,
        description: step.description || '',
        helpText: step.helpText || ''
      }));

      if (editingWorkflow) {
        const updatedWf: WorkflowTemplate = {
          ...editingWorkflow,
          title: newWfTitle,
          description: newWfDesc,
          categoryId: newWfCategory,
          criticalInfo: newWfCritical.split('\n').filter(line => line.trim() !== ''),
          steps: stepsWithIds
        };
        setWorkflows(prev => {
          const updated = prev.map(w => w.id === editingWorkflow.id ? updatedWf : w);
          try {
            localStorage.setItem('isakis_workflows_v3', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
        setEditingWorkflow(null);
        setIsTemplateModalOpen(false);
        alert('İş akışı süreci başarıyla güncellendi!');
      } else {
        const newWf: WorkflowTemplate = {
          id: `wf_${Date.now()}`,
          title: newWfTitle,
          description: newWfDesc,
          icon: 'FileText',
          categoryId: newWfCategory,
          criticalInfo: newWfCritical.split('\n').filter(line => line.trim() !== ''),
          steps: stepsWithIds
        };

        setWorkflows(prev => {
          const updated = [...prev, newWf];
          try {
            localStorage.setItem('isakis_workflows_v3', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
        setIsTemplateModalOpen(false);
        alert('Yeni iş akışı süreci başarıyla oluşturuldu ve kütüphaneye eklendi!');
      }
    } else {
      if (!newDocTitle.trim() || !newDocDesc.trim() || !newDocContent.trim()) {
        alert('Lütfen şablon başlığını, açıklamasını ve belge içeriğini doldurunuz.');
        return;
      }

      const newDoc: TemplateDoc = {
        id: `t_${Date.now()}`,
        title: newDocTitle,
        description: newDocDesc,
        content: newDocContent
      };

      setLibraryTemplates(prev => {
        const updated = [...prev, newDoc];
        try {
          localStorage.setItem('library_templates', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
      setIsTemplateModalOpen(false);
      alert('Yeni belge yazışma şablonu başarıyla kütüphaneye eklendi!');
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Bu belge şablonunu silmek istediğinize emin misiniz?')) {
      setLibraryTemplates(prev => {
        const updated = prev.filter(t => t.id !== id);
        try {
          localStorage.setItem('library_templates', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  };

  const downloadAsWord = (title: string, content: string) => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${title}</title>
<style>
  @page { size: A4; margin: 2.5cm; }
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000000; }
  p { margin: 0 0 6pt 0; text-align: justify; }
</style>
</head>
<body>`;
    const footer = "</body></html>";
    
    const lines = content.split('\n');
    const processedHTML: string[] = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '') {
        processedHTML.push('<p>&nbsp;</p>');
        i++;
        continue;
      }

      const leadingSpaces = line.match(/^ +/)?.[0].length || 0;

      // 1. Check if it's Sayı and Tarih on the same line
      if (trimmed.startsWith('Sayı') && line.includes('   ')) {
        const parts = line.split(/ {3,}/);
        if (parts.length >= 2) {
          processedHTML.push(`<table width="100%" cellpadding="0" cellspacing="0" style="border: none; margin-bottom: 6pt;">
            <tr>
              <td align="left" style="font-family: 'Times New Roman', serif; font-size: 12pt;">${parts[0].trim()}</td>
              <td align="right" style="font-family: 'Times New Roman', serif; font-size: 12pt;">${parts[parts.length - 1].trim()}</td>
            </tr>
          </table>`);
          i++;
          continue;
        }
      }

      // 2. Check for two signatures on the same line (e.g. Teslim Eden      Teslim Alan)
      if (line.includes('   ') && trimmed.length > 10 && !trimmed.startsWith('Sayı')) {
        const parts = line.split(/ {5,}/);
        if (parts.length === 2) {
           processedHTML.push(`<table width="100%" cellpadding="0" cellspacing="0" style="border: none; margin-top: 12pt; margin-bottom: 12pt;">
            <tr>
              <td align="center" width="50%" style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center; line-height: 1.5;">
                ${parts[0].trim().replace(/ {2,}/g, '<br/>')}
              </td>
              <td align="center" width="50%" style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center; line-height: 1.5;">
                ${parts[1].trim().replace(/ {2,}/g, '<br/>')}
              </td>
            </tr>
          </table>`);
          i++;
          continue;
        }
      }

      // 3. Group consecutive right-aligned lines (leadingSpaces >= 40)
      // These represent a single signature block on the right.
      if (leadingSpaces >= 40) {
        const rightLines: string[] = [];
        while (i < lines.length) {
          const curLine = lines[i];
          const curLeading = curLine.match(/^ +/)?.[0].length || 0;
          const curTrimmed = curLine.trim();
          
          if (curTrimmed !== '' && curLeading < 40) {
            break;
          }
          
          if (curTrimmed !== '') {
            rightLines.push(curTrimmed);
          } else {
            rightLines.push('&nbsp;');
          }
          i++;
        }

        const signatureRows = rightLines.map(rl => `<div>${rl}</div>`).join('');
        processedHTML.push(`<table width="100%" cellpadding="0" cellspacing="0" style="border: none; margin-top: 18pt; margin-bottom: 12pt;">
          <tr>
            <td width="55%"></td>
            <td width="45%" align="center" style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; text-align: center;">
              ${signatureRows}
            </td>
          </tr>
        </table>`);
        continue;
      }

      // 4. Group consecutive centered lines (leadingSpaces >= 10 and < 40)
      // This represents centered headings like "T.C. SAĞLIK BAKANLIĞI" or subject titles
      if (leadingSpaces >= 10 && leadingSpaces < 40) {
        const centerLines: string[] = [];
        while (i < lines.length) {
          const curLine = lines[i];
          const curLeading = curLine.match(/^ +/)?.[0].length || 0;
          const curTrimmed = curLine.trim();
          
          if (curTrimmed !== '' && (curLeading < 10 || curLeading >= 40)) {
            break;
          }
          
          if (curTrimmed !== '') {
            centerLines.push(curTrimmed);
          } else {
            centerLines.push('&nbsp;');
          }
          i++;
        }

        const centerRows = centerLines.map(cl => {
          const isBold = cl.toUpperCase() === cl && cl.length > 2;
          return `<p style="text-align: center; margin: 0 0 4pt 0; line-height: 1.3; font-family: 'Times New Roman', serif; font-size: 12pt; font-weight: ${isBold ? 'bold' : 'normal'};">${cl}</p>`;
        }).join('');
        
        processedHTML.push(`<div style="margin-top: 12pt; margin-bottom: 12pt;">${centerRows}</div>`);
        continue;
      }

      // 5. Standard line
      let textIndent = '0';
      let align = 'justify';
      
      if (leadingSpaces > 0 && leadingSpaces < 10) {
        textIndent = '1.25cm'; // Resmî Yazışma paragraf başı girintisi
      }

      const htmlText = trimmed.replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
      processedHTML.push(`<p style="text-align: ${align}; text-indent: ${textIndent}; margin: 0 0 6pt 0; line-height: 1.5; font-family: 'Times New Roman', serif; font-size: 12pt;">${htmlText}</p>`);
      i++;
    }

    const formattedContent = processedHTML.join('\n');
    const html = header + formattedContent + footer;
    
    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startWorkflow = (template: WorkflowTemplate) => {
    const newActiveWorkflow: ActiveWorkflow = {
      id: `aw_${Date.now()}`,
      templateId: template.id,
      title: template.title,
      criticalInfo: template.criticalInfo,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      steps: template.steps.map(s => ({ ...s, isCompleted: false }))
    };
    setActiveWorkflow(newActiveWorkflow);
    setOngoingWorkflows(prev => {
      const updated = [newActiveWorkflow, ...prev];
      try {
        localStorage.setItem('ongoing_workflows', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setIsAssistantOpen(true);
  };

  const resumeWorkflow = (workflow: ActiveWorkflow) => {
    setActiveWorkflow(workflow);
    setIsAssistantOpen(true);
  };

  const updateStep = (stepId: string, isCompleted: boolean) => {
    if (!activeWorkflow) return;
    
    const updatedActive = {
      ...activeWorkflow,
      steps: activeWorkflow.steps.map(s => 
        s.id === stepId ? { ...s, isCompleted } : s
      )
    };
    
    setActiveWorkflow(updatedActive);

    setOngoingWorkflows(prev => {
      const updated = prev.map(w => w.id === activeWorkflow.id ? updatedActive : w);
      try {
        localStorage.setItem('ongoing_workflows', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const completeWorkflow = (id: string) => {
    setOngoingWorkflows(prev => {
      const updated = prev.filter(w => w.id !== id);
      try {
        localStorage.setItem('ongoing_workflows', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setTodayCompleted(prev => {
      const newVal = prev + 1;
      try {
        localStorage.setItem('today_completed', String(newVal));
      } catch (e) {
        console.error(e);
      }
      return newVal;
    });

    setTotalPersonnel(prev => {
      const newVal = prev + 1;
      try {
        localStorage.setItem('total_personnel', String(newVal));
      } catch (e) {
        console.error(e);
      }
      return newVal;
    });

    setActiveWorkflow(null);
  };

  const handleHelpRequested = (helpText: string) => {
    setIsAssistantOpen(true);
  };

  const isMascotOnly = typeof window !== 'undefined' && window.location.search.includes('view=mascot-only');

  if (isMascotOnly) {
    return (
      <div className="fixed inset-0 w-full h-full bg-transparent overflow-hidden">
        <DesktopRobot
          setIsAssistantOpen={() => {}}
          openNewTemplateModal={() => {}}
          workflows={[]}
          onStartWorkflow={() => {}}
          isStandalone={true}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-950 md:hidden hover:bg-slate-100 rounded-xl transition-all"
            title="Menüyü Aç"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">I</div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">İşAkış Pro <span className="text-blue-600 font-medium text-sm ml-2 hidden sm:inline">Kurumsal Asistan</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bugün</p>
            <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
            <ShieldCheck size={16} className="text-green-600" />
            <span className="text-sm font-bold text-green-700">Yerel Güvenli Mod</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div 
              className="w-72 bg-white h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">I</div>
                  <span className="font-bold text-slate-800 text-sm">İşAkış Pro Menü</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 space-y-2 overflow-y-auto">
                <button 
                  onClick={() => { setActiveView('dashboard'); setActiveWorkflow(null); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'dashboard' && !activeWorkflow ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <Activity size={18} />
                  <span>Gösterge Paneli</span>
                </button>
                <button 
                  onClick={() => { setActiveView('deadlines'); setActiveWorkflow(null); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'deadlines' && !activeWorkflow ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <Calendar size={18} />
                  <span>Yasal Süre Takibi</span>
                </button>
                <button 
                  onClick={() => { setActiveView('all-workflows'); setActiveWorkflow(null); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'all-workflows' && !activeWorkflow ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <CheckSquare size={18} />
                  <span>Tüm Süreçler</span>
                </button>
                <button 
                  onClick={() => { setActiveView('library'); setActiveWorkflow(null); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'library' && !activeWorkflow ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <FileText size={18} />
                  <span>Belge Kütüphanesi</span>
                </button>
                <button 
                  onClick={() => { setActiveView('mevzuat'); setActiveWorkflow(null); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'mevzuat' && !activeWorkflow ? 'bg-blue-50 text-blue-750 font-black border border-indigo-200 bg-indigo-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <Scale size={18} className="text-indigo-500 animate-pulse" />
                  <span className="font-extrabold text-indigo-900">Mevzuat Bilgi Bankası</span>
                </button>
                <button 
                  onClick={() => { openMascotWindow(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:brightness-110 active:scale-95"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <Sparkles size={18} className="text-amber-300 animate-pulse shrink-0" />
                    <span>Asistan Pet'i Çağır 🤖</span>
                  </div>
                  <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">AÇ</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 text-slate-800 flex-col hidden md:flex shrink-0 z-10 shadow-sm">
          <div className="p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Menü</h3>
            
            <nav className="space-y-2">
              <button 
                onClick={() => { setActiveView('dashboard'); setActiveWorkflow(null); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'dashboard' && !activeWorkflow ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Activity size={18} />
                <span>Gösterge Paneli</span>
              </button>
              <button 
                onClick={() => { setActiveView('deadlines'); setActiveWorkflow(null); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'deadlines' && !activeWorkflow ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Calendar size={18} />
                <span>Yasal Süre Takibi</span>
              </button>
              <button 
                onClick={() => { setActiveView('all-workflows'); setActiveWorkflow(null); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'all-workflows' && !activeWorkflow ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <CheckSquare size={18} />
                <span>Tüm Süreçler</span>
              </button>
              <button 
                onClick={() => { setActiveView('library'); setActiveWorkflow(null); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'library' && !activeWorkflow ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <FileText size={18} />
                <span>Belge Kütüphanesi</span>
              </button>
              <button 
                onClick={() => { setActiveView('mevzuat'); setActiveWorkflow(null); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeView === 'mevzuat' && !activeWorkflow ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Scale size={18} className="text-indigo-500" />
                <span>Mevzuat Bilgi Bankası</span>
              </button>
              <button 
                onClick={openMascotWindow}
                className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold transition-all text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] mt-2 text-left"
              >
                <Sparkles size={18} className="animate-pulse text-amber-300 shrink-0" />
                <span>Asistan Pet'i Çağır 🤖</span>
                <span className="ml-auto bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">AÇ</span>
              </button>
              <button 
                onClick={() => { setActiveView('desktop-app'); setActiveWorkflow(null); }}
                className="w-full text-center text-[10px] text-slate-400 hover:text-slate-600 font-semibold mt-2.5 transition-colors underline hover:no-underline"
              >
                ⚙️ Masaüstü Kurulum & EXE Kılavuzu
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6">
          
          {activeWorkflow ? (
            <div className="space-y-6 pb-24 max-w-5xl">
              <button 
                onClick={() => setActiveWorkflow(null)}
                className="text-blue-600 text-sm font-bold hover:underline flex items-center"
              >
                ← PANOYA DÖN
              </button>
              <WorkflowRunner 
                workflow={activeWorkflow} 
                onUpdateStep={updateStep}
                onComplete={() => completeWorkflow(activeWorkflow.id)}
                onHelpRequested={handleHelpRequested}
                onStepSelect={setSelectedStep}
              />
            </div>
          ) : activeView === 'dashboard' ? (
            <div className="space-y-8 pb-24 max-w-6xl mx-auto w-full">
              
              {/* Bento Grid Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Stats + Reminders) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Bugün Biten */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group">
                      <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <CheckCircle size={18} className="text-green-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Bugün Biten</h4>
                      </div>
                      {isEditingTodayCompleted ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="number"
                            value={tempTodayCompleted}
                            onChange={(e) => setTempTodayCompleted(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveTodayCompleted();
                              } else if (e.key === 'Escape') {
                                setIsEditingTodayCompleted(false);
                              }
                            }}
                            className="w-16 px-1.5 py-0.5 text-sm font-bold border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                            autoFocus
                          />
                          <button
                            onClick={saveTodayCompleted}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded text-xs font-bold"
                            title="Kaydet"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setIsEditingTodayCompleted(false)}
                            className="bg-slate-300 hover:bg-slate-400 text-slate-700 p-1 rounded text-xs font-bold"
                            title="İptal"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-between mt-1">
                          <p className="text-2xl font-black text-slate-800">{todayCompleted}</p>
                          <button
                            onClick={() => {
                              setTempTodayCompleted(String(todayCompleted));
                              setIsEditingTodayCompleted(true);
                            }}
                            className="text-slate-400 hover:text-blue-600 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-50"
                            title="Değeri Manuel Güncelle"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Devam Eden */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <PlayCircle size={18} className="text-blue-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Devam Eden</h4>
                      </div>
                      <p className="text-2xl font-black text-slate-800 mt-1">{ongoingWorkflows.length}</p>
                    </div>

                    {/* Bekleyen Evrak */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" title="Devam eden süreçlerdeki bekleyen belge/evrak adımları sayısı">
                      <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <FileText size={18} className="text-orange-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Bekleyen Evrak</h4>
                      </div>
                      <p className="text-2xl font-black text-slate-800 mt-1">{getPendingDocumentsCount()}</p>
                    </div>

                    {/* Toplam Prs. */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group">
                      <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <Users size={18} className="text-indigo-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Toplam Prs.</h4>
                      </div>
                      {isEditingTotalPersonnel ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="number"
                            value={tempTotalPersonnel}
                            onChange={(e) => setTempTotalPersonnel(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveTotalPersonnel();
                              } else if (e.key === 'Escape') {
                                setIsEditingTotalPersonnel(false);
                              }
                            }}
                            className="w-16 px-1.5 py-0.5 text-sm font-bold border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                            autoFocus
                          />
                          <button
                            onClick={saveTotalPersonnel}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded text-xs font-bold"
                            title="Kaydet"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setIsEditingTotalPersonnel(false)}
                            className="bg-slate-300 hover:bg-slate-400 text-slate-700 p-1 rounded text-xs font-bold"
                            title="İptal"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-between mt-1">
                          <p className="text-2xl font-black text-slate-800">{totalPersonnel}</p>
                          <button
                            onClick={() => {
                              setTempTotalPersonnel(String(totalPersonnel));
                              setIsEditingTotalPersonnel(true);
                            }}
                            className="text-slate-400 hover:text-blue-600 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-50"
                            title="Değeri Manuel Güncelle"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EKİP Bilgi ve Mevzuat Kartı (Kompakt Banner) */}
                  <div className="bg-gradient-to-r from-teal-50 via-white to-blue-50 rounded-2xl p-4 md:p-5 border border-teal-100 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/20 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 bg-teal-600/10 rounded-xl flex items-center justify-center border border-teal-500/20 text-teal-600 shadow-sm shrink-0">
                        <Activity size={18} className="animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-teal-600 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            YENİ SİSTEM GÜNCELLEMESİ
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">ÇKYS 👉 EKİP</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mt-0.5">
                          Entegre Kurumsal İşlem Platformu (EKİP) Kılavuzu
                        </h3>
                        <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                          Bakanlığın yeni EKİP sistemine dair mevzuat hatırlatmaları ve hızlı giriş bağlantıları.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEkipModalOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Mevzuat ve Linkleri Göster</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>

                  {/* Smart Calendar / Legal Tracker */}
                  <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" />
                        Yasal Süre Takipçisi
                      </h3>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        {reminders.length} Bekleyen
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {reminders.length > 0 ? (
                        reminders.map(reminder => (
                          <div key={reminder.id} className={`p-4 rounded-xl border flex gap-4 ${reminder.severity === 'high' ? 'bg-red-50/70 border-red-200' : reminder.severity === 'medium' ? 'bg-orange-50/70 border-orange-200' : 'bg-slate-50 border-slate-200'} relative group`}>
                            <div className={`mt-1 shrink-0 ${reminder.severity === 'high' ? 'text-red-500' : reminder.severity === 'medium' ? 'text-orange-500' : 'text-slate-500'}`}>
                              {reminder.severity === 'high' ? <AlertTriangle size={20} /> : <Bell size={20} />}
                            </div>
                            <div className="flex-1 pr-8">
                              <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                                <h4 className={`font-bold text-sm ${reminder.severity === 'high' ? 'text-red-900' : reminder.severity === 'medium' ? 'text-orange-900' : 'text-slate-800'}`}>
                                  {reminder.title}
                                </h4>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${reminder.severity === 'high' ? 'bg-red-200 text-red-800' : reminder.severity === 'medium' ? 'bg-orange-200 text-orange-800' : 'bg-slate-200 text-slate-700'}`}>
                                  {new Date(reminder.date).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                              <p className={`text-sm ${reminder.severity === 'high' ? 'text-red-700' : reminder.severity === 'medium' ? 'text-orange-800' : 'text-slate-600'}`}>
                                {reminder.description}
                              </p>
                            </div>
                            {/* Deletion Button */}
                            <button
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="absolute top-4 right-4 text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white/80 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                              title="Uyarılı Sil"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Yaklaşan yasal süre uyarısı bulunmuyor.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Column (Ongoing Workflows) */}
                <div className="lg:col-span-1">
                  <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-800 h-full flex flex-col">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Clock size={18} className="text-blue-500" />
                      Devam Eden Süreçler
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                      {ongoingWorkflows.length > 0 ? (
                        ongoingWorkflows.map(wf => {
                          const completed = wf.steps.filter(s => s.isCompleted).length;
                          const total = wf.steps.length;
                          const progress = Math.round((completed / total) * 100);
                          
                          return (
                            <div 
                              key={wf.id} 
                              onClick={() => resumeWorkflow(wf)}
                              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group relative"
                            >
                              <div className="flex justify-between items-start gap-2 mb-3">
                                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors pr-6">{wf.title}</h4>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteOngoingWorkflow(wf.id);
                                  }}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-50 transition-colors absolute top-3 right-3 opacity-100 md:opacity-0 group-hover:opacity-100"
                                  title="Süreci Listeden Kaldır"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs text-slate-500">{completed}/{total} Adım</span>
                                <span className="text-xs font-bold text-blue-600">{progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                              </div>
                              <div className="mt-3 text-xs text-slate-400 group-hover:text-blue-600 transition-colors flex justify-end font-medium">
                                Devam Et →
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-slate-500 py-8">
                          Devam eden süreç bulunmuyor.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              {/* Start New Workflow Section */}
              <section className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Yeni Süreç Başlat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workflows.slice(0, 7).map(wf => (
                    <div key={wf.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group relative flex flex-col justify-between min-h-[120px]" onClick={() => startWorkflow(wf)}>
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">{wf.title}</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditWorkflowModal(wf);
                            }}
                            className="text-slate-400 hover:text-blue-600 p-1 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                            title="Süreci Düzenle"
                          >
                            <Pencil size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{wf.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Create New Workflow Card */}
                  <div 
                    onClick={openNewTemplateModal}
                    className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer min-h-[100px]"
                  >
                    <div className="w-8 h-8 bg-white text-slate-400 rounded-full flex items-center justify-center mb-2 shadow-sm border border-slate-200">
                      <Plus size={16} />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">Şablon Oluştur</h4>
                  </div>
                </div>
              </section>
            </div>
          ) : activeView === 'library' ? (
            <div className="space-y-8 pb-24 max-w-6xl mx-auto w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText size={24} className="text-blue-600" />
                    Belge & Şablon Kütüphanesi
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">KVKK gereği personel bilgileri sistemde tutulmaz. Buradan boş şablonları kopyalayarak yerel bilgisayarınızda doldurabilirsiniz.</p>
                </div>
                <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                  <button
                    onClick={openNewDocumentTemplateModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-200 transition-colors"
                  >
                    <Plus size={14} /> ŞABLON / BELGE EKLE
                  </button>
                  <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold border border-blue-200 flex items-center gap-1.5">
                    <ShieldCheck size={15} /> KVKK Uyumlu
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryTemplates.map(template => (
                  <div key={template.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
                    <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-600" />
                        <h3 className="font-bold text-slate-800 line-clamp-1 text-sm" title={template.title}>{template.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button 
                          onClick={() => setEditingTemplate(template)}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-200/50 transition-colors"
                          title="Düzenle"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-200/50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 text-sm text-slate-600">
                      {template.description}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(template.content);
                          alert("Şablon panoya kopyalandı!");
                        }}
                        className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors"
                      >
                        KOPYALA
                      </button>
                      <button 
                        onClick={() => downloadAsWord(template.title, template.content)}
                        className="flex-1 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download size={14} /> WORD İNDİR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeView === 'deadlines' ? (
            <div className="space-y-8 pb-24 max-w-6xl mx-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={24} className="text-blue-600" />
                  Yasal Süre Takibi
                </h2>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
                  {reminders.length} Bekleyen
                </span>
              </div>
              {reminders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reminders.map(reminder => (
                    <div key={reminder.id} className={`p-5 rounded-2xl border flex gap-4 ${reminder.severity === 'high' ? 'bg-red-50/70 border-red-200' : reminder.severity === 'medium' ? 'bg-orange-50/70 border-orange-200' : 'bg-slate-50 border-slate-200'} relative group`}>
                      <div className={`mt-1 shrink-0 ${reminder.severity === 'high' ? 'text-red-500' : reminder.severity === 'medium' ? 'text-orange-500' : 'text-slate-500'}`}>
                        {reminder.severity === 'high' ? <AlertTriangle size={24} /> : <Bell size={24} />}
                      </div>
                      <div className="flex-1 pr-8">
                        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                          <h4 className={`font-bold text-base ${reminder.severity === 'high' ? 'text-red-900' : reminder.severity === 'medium' ? 'text-orange-900' : 'text-slate-800'}`}>
                            {reminder.title}
                          </h4>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${reminder.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' : reminder.severity === 'medium' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>
                            {new Date(reminder.date).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <p className={`text-sm ${reminder.severity === 'high' ? 'text-red-700' : reminder.severity === 'medium' ? 'text-orange-800' : 'text-slate-600'}`}>
                          {reminder.description}
                        </p>
                      </div>
                      {/* Deletion Button */}
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="absolute top-5 right-5 text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-white/80 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                        title="Hatırlatıcıyı Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Mükemmel!</h3>
                  <p className="text-sm text-slate-500">Yaklaşan herhangi bir yasal süre uyarısı bulunmamaktadır.</p>
                </div>
              )}
            </div>
          ) : activeView === 'all-workflows' ? (
            <div className="space-y-8 pb-24 max-w-6xl mx-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <CheckSquare size={24} className="text-blue-600" />
                  Tüm Süreçler
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map(wf => (
                  <div key={wf.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative" onClick={() => startWorkflow(wf)}>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        <PlayCircle size={20} className="text-blue-500 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 shrink-0" />
                        {wf.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditWorkflowModal(wf);
                          }}
                          className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                          title="Süreci Düzenle"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorkflowToDelete(wf);
                          }}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                          title="Süreci Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 flex-1">{wf.description}</p>
                    <div className="text-xs font-bold text-slate-400 flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <span>{wf.steps.length} Adım</span>
                      <span className="text-blue-600 group-hover:underline">BAŞLAT →</span>
                    </div>
                  </div>
                ))}
                
                {/* Create New Workflow Card */}
                <div 
                  onClick={openNewTemplateModal}
                  className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer min-h-[160px] group"
                >
                  <div className="w-12 h-12 bg-white text-slate-400 group-hover:text-blue-500 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-200 group-hover:border-blue-200 transition-colors">
                    <Plus size={24} />
                  </div>
                  <h4 className="font-bold text-slate-700 group-hover:text-blue-700 text-base">Yeni Süreç Şablonu Oluştur</h4>
                  <p className="text-sm text-slate-500 mt-2">Kuruma özel yeni bir iş akışı tasarlayın.</p>
                </div>
              </div>
            </div>
          ) : activeView === 'desktop-app' ? (
            <div className="space-y-8 pb-24 max-w-4xl mx-auto w-full animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Monitor size={24} className="text-indigo-600 animate-pulse" />
                    Masaüstü Uygulaması (EXE) ve Arka Plan Yönetim Merkezi
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Uygulamayı ve sevimli asistan robotumuzu doğrudan bilgisayarınızda bağımsız, şeffaf arka planlı bir Windows EXE programı olarak çalıştırın!</p>
                </div>
              </div>

              {/* Native EXE packaging card - ULTRA PREMIUM */}
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700">
                <div className="absolute right-0 bottom-0 opacity-15 translate-x-12 translate-y-12">
                  <Monitor size={360} className="text-indigo-300" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-4">
                  <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    👑 GERÇEK WINDOWS EXE UYGULAMASI
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                    Uygulamayı Tamamen Bağımsız Bir EXE Yapın!
                  </h3>
                  <p className="text-sm text-indigo-100 leading-relaxed">
                    Aradığınız kusursuz deneyim hazır! Kod tabanımıza gerçek bir <strong>Electron Desktop Engine</strong> entegrasyonu yaptık. Uygulamayı bilgisayarınıza indirdiğinizde, tek bir tıklamayla tamamen bağımsız, çerçevesiz, dilediğinizce sürükleyebileceğiniz ve <strong>Her Zaman En Üstte</strong> durabilen gerçek bir masaüstü uygulaması (.EXE) derleyebilirsiniz!
                  </p>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-3 text-xs sm:text-sm">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5">
                      🚀 3 Adımda Kolayca Kendi EXE Dosyanızı Oluşturun:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-indigo-100 pl-1 leading-normal">
                      <li>
                        Sağ üst köşedeki ayarlar/ihraç menüsünden projeyi bir <strong>ZIP Arşivi</strong> veya <strong>GitHub</strong> deposu olarak indirin.
                      </li>
                      <li>
                        İndirdiğiniz klasörün içindeki <code className="bg-slate-900/40 px-1.5 py-0.5 rounded text-white font-mono">make-exe.bat</code> (EXE Paketleme Sihirbazı) dosyasına çift tıklayın.
                      </li>
                      <li>
                        Sihirbaz gerekli tüm işlemleri otomatik yaparak size <code className="bg-slate-900/40 px-1.5 py-0.5 rounded text-white font-mono">dist_desktop</code> klasöründe taşınabilir (Portable) bir <strong>KurumsalIsAsistani.exe</strong> oluşturacaktır!
                      </li>
                    </ol>
                  </div>

                  <div className="text-[11px] text-indigo-200 bg-indigo-950/40 rounded-xl p-3 border border-indigo-800/40">
                    <strong>💡 Müjde:</strong> Sizin için hazırladığımız özel masaüstü sürümünde asistan robotumuz <strong>şeffaf arka planlıdır</strong>. Bilgisayarınızın ekranında hiçbir pencere kenarlığı olmadan serbestçe süzülür, sol tıkla basılı tutarak ekranda dilediğiniz yere sürükleyebilirsiniz! Sağ tıklayarak menüsünü yönetebilirsiniz.
                  </div>
                </div>
              </div>

              {/* Floating Standalone Mascot Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center font-bold text-3xl shrink-0 border border-indigo-100 shadow-inner animate-pulse">
                  🤖
                </div>
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <span className="bg-indigo-100 text-indigo-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Anlık Tarayıcı Widget Sürümü
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">Tarayıcıda Bağımsız Küçük Pencere (Alternatif)</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    EXE derleme işlemini yapmadan önce, şu an tarayıcı üzerinden de maskotu ana pencereden ayırıp küçük, bağımsız bir tarayıcı penceresi olarak ekranınızın köşesine yerleştirebilirsiniz.
                  </p>
                  
                  <div className="pt-1 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                    <button
                      onClick={openMascotWindow}
                      className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <Monitor size={16} />
                      WIDGET PENCERESİNİ ŞİMDİ AÇ
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    🔮
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Şeffaf & Çerçevesiz Robot</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    EXE masaüstü uygulamasında robot tamamen saydamdır. Duvar kağıdınızın üzerinde gerçekçi bir asistan gibi durur. Ekranın dilediğiniz yerine sol tuşla sürükleyebilirsiniz.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                    📌
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Her Zaman En Üstte</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Siz Word belgesi yazarken, Excel doldururken veya diğer programlarda çalışırken asistan robot her zaman en üst katmanda kalarak mevzuat ipuçları ve süre hatırlatmaları vermeye devam eder.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                    📥
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Sistem Tepsisi (Tray)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Arka planda çalışırken ekranı işgal etmez, Windows saatinin yanındaki Sistem Tepsisinde (Tray) yaşar. İkona çift tıklayarak istediğiniz an ana asistan panelini açabilirsiniz.
                  </p>
                </div>
              </div>

              {/* Standard PWA Option for mobile/chrome install */}
              <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span>📱</span> Tarayıcı Tabanlı PWA Kurulum Seçeneği
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Akıllı telefonlarınıza veya tarayıcı sekmelerinden kurtulmak amacıyla bilgisayarınıza hafif bir uygulama yüklemek isterseniz standard PWA metodunu da kullanabilirsiniz:
                </p>

                {isInstallable ? (
                  <button
                    onClick={handleInstallClick}
                    className="bg-white hover:bg-slate-50 text-indigo-700 font-bold border border-slate-200 text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    PWA Tarayıcı Kurulumunu Başlat
                  </button>
                ) : (
                  <div className="bg-white/80 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
                    <p className="font-bold text-slate-700">Mobil / Tablet & Chrome Kurulumu:</p>
                    <p className="text-slate-500 leading-relaxed">
                      Chrome veya Edge kullanıyorsanız adres çubuğundaki <strong>"Uygulamayı Yükle" ⊕</strong> simgesine tıklayın. Telefonlarda Safari için <strong>"Ana Ekrana Ekle"</strong> seçeneğini kullanabilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : activeView === 'mevzuat' ? (
            <MevzuatBankasi />
          ) : null}
        </main>
      </div>

      <Assistant 
        activeWorkflow={activeWorkflow} 
        onHelpRequested={handleHelpRequested}
        isOpen={isAssistantOpen}
        setIsOpen={setIsAssistantOpen}
        onStartWorkflow={startWorkflow}
        workflows={workflows}
      />

      <DesktopRobot
        setIsAssistantOpen={setIsAssistantOpen}
        openNewTemplateModal={openNewTemplateModal}
        workflows={workflows}
        onStartWorkflow={startWorkflow}
        activeStep={selectedStep}
      />

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  {editingWorkflow ? 'İş Akışı Şablonunu Düzenle' : 'Yeni Şablon Tasarla'}
                </h3>
                <button 
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Selector */}
              {!editingWorkflow && (
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setNewTemplateType('workflow')}
                    className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${newTemplateType === 'workflow' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    İş Akışı / Süreç Tasarla
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTemplateType('document')}
                    className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${newTemplateType === 'document' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    Belge / Yazışma Şablonu
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                {newTemplateType === 'workflow' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Süreç Başlığı</label>
                        <input 
                          type="text" 
                          placeholder="Örn: Naklen Atama Başlama Süreci" 
                          value={newWfTitle}
                          onChange={(e) => setNewWfTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Personel Sınıfı / Kategori</label>
                        <select 
                          value={newWfCategory}
                          onChange={(e) => setNewWfCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                        >
                          <option value="tabip_uzman">Tabip ve Uzman Hekim</option>
                          <option value="yardimci_saglik">Yardımcı Sağlık Personeli (Kadrolu)</option>
                          <option value="sozlesmeli_4b">Sözleşmeli Personel (4/B)</option>
                          <option value="surekli_isci">Sürekli İşçi</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</label>
                      <textarea 
                        rows={2} 
                        placeholder="İş akışının genel amacı ve kapsamı..." 
                        value={newWfDesc}
                        onChange={(e) => setNewWfDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">KVKK / Önemli Hatırlatmalar (Her satıra bir kural)</label>
                      <textarea 
                        rows={2} 
                        placeholder="Örn: Evrak asılları mutlaka görülmeli ve 'Aslı Gibidir' yapılmalıdır." 
                        value={newWfCritical}
                        onChange={(e) => setNewWfCritical(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                      ></textarea>
                    </div>

                    {/* Step Editor */}
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-700">Süreç Adımları</label>
                        <button
                          type="button"
                          onClick={() => setNewWfSteps([...newWfSteps, { title: '', description: '', helpText: '' }])}
                          className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                        >
                          <Plus size={14} /> Adım Ekle
                        </button>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto space-y-3 pr-1 border border-slate-100 p-2 rounded-xl bg-slate-50">
                        {newWfSteps.map((step, index) => (
                          <div key={index} className="bg-white p-3 rounded-xl border border-slate-200 relative space-y-2">
                            {newWfSteps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setNewWfSteps(newWfSteps.filter((_, idx) => idx !== index))}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xs"
                              >
                                Sil
                              </button>
                            )}
                            <p className="text-xs font-bold text-slate-400">Adım #{index + 1}</p>
                            <input
                              type="text"
                              placeholder="Adım Başlığı (Örn: EKİP Sistemi Girişi ve Kontrolü)"
                              value={step.title}
                              onChange={(e) => {
                                const updated = [...newWfSteps];
                                updated[index].title = e.target.value;
                                setNewWfSteps(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Adım Açıklaması (Örn: Kararnamenin düşüp düşmediğini kontrol edin)"
                              value={step.description}
                              onChange={(e) => {
                                const updated = [...newWfSteps];
                                updated[index].description = e.target.value;
                                setNewWfSteps(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <textarea
                              rows={2}
                              placeholder="Adım Yardım Metni / Mevzuat / Yol Gösterici Öneriler"
                              value={step.helpText}
                              onChange={(e) => {
                                const updated = [...newWfSteps];
                                updated[index].helpText = e.target.value;
                                setNewWfSteps(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 resize-none"
                            ></textarea>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Fast Draft Presets */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-2">
                      <span className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText size={14} /> Hazır Taslak Seçin
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle('Örnek Dilekçe');
                            setNewDocDesc('Personelin resmi talepler, izin veya mazeret bildirmek için kuruma sunabileceği örnek dilekçe.');
                            setNewDocContent(`                                                                            [Tarih]

                [KURUM / BAŞTABİPLİK ADI] BAŞTABİPLİĞİNE
                
    Kurumunuzda [Unvan/Branş] olarak görev yapmaktayım. [Gerekçe/Mazeret Belirtiniz. Örn: Sağlık durumu / Eğitim durumu / Ailevi nedenler] sebebiyle, ekte sunduğum belgeler doğrultusunda [Talep Edilen Husus. Örn: Ücretsiz izin / Görev yeri değişikliği / Tayin] hususunda;

    Gereğinin yapılmasını arz ederim.


                                                                            [Ad Soyad]
                                                                            [İmza]

TCKN: [TC Kimlik Numarası]
Telefon: [Telefon Numarası]
Adres: [Adres Bilgisi]

EKLER:
1- [Ek Belge Adı]`);
                          }}
                          className="px-2.5 py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl transition-all border border-slate-200 hover:border-blue-300 text-left flex items-center gap-1.5 shadow-sm"
                        >
                          📝 + Dilekçe Örneği
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle('Olay Tespit Tutanağı');
                            setNewDocDesc('Kurum içi çeşitli olay, durum, tutum veya aksaklıkları resmi olarak kayıt altına almak için genel tutanak şablonu.');
                            setNewDocContent(`                TUTANAKTIR

    Bugün [Tarih] günü saat [Saat]'te, [Kurum/Birim Adı]'nda görevli personel ile ilgili olarak [Olayın/Konunun Açıklaması. Örn: Göreve zamanında gelmeme / Malzeme hasarı / Görev devri esnasında yaşanan aksaklık] tespiti yapılmıştır. 

    İşbu tutanak mahallinde tanzim edilerek imza altına alınmıştır.

                                                                            [Tarih]


Tespit Eden (Ad Soyad/Unvan)                     Tespit Eden (Ad Soyad/Unvan)
İmza                                             İmza`);
                          }}
                          className="px-2.5 py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl transition-all border border-slate-200 hover:border-blue-300 text-left flex items-center gap-1.5 shadow-sm"
                        >
                          📋 + Tutanak Örneği
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle('Teslim Tesellüm Tutanağı');
                            setNewDocDesc('Demirbaş eşya, bilgisayar, oda veya hassas belgelerin personel arasında devir teslim işlemleri için tutanak şablonu.');
                            setNewDocContent(`                TESLİM TESELLÜM TUTANAĞI

    [Kurum Adı] bünyesinde kullanılmak üzere, aşağıda nitelikleri ve miktarları belirtilen demirbaş malzemeler / belgeler [Teslim Eden Ad Soyad] tarafından [Teslim Alan Ad Soyad]'a tam, eksiksiz ve çalışır vaziyette teslim edilmiştir.

MALZEME / BELGE LİSTESİ:
1- [Malzeme/Belge Adı] - [Adet/Miktar] - [Seri No / Detay]
2- [Malzeme/Belge Adı] - [Adet/Miktar] - [Seri No / Detay]

    İşbu teslim tesellüm tutanağı iki nüsha olarak düzenlenmiş ve taraflarca imza altına alınmıştır.

                                                                            [Tarih]


TESLİM EDEN                                                 TESLİM ALAN
Ad Soyad:                                                   Ad Soyad:
Unvan:                                                      Unvan:
İmza:                                                       İmza:`);
                          }}
                          className="px-2.5 py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl transition-all border border-slate-200 hover:border-blue-300 text-left flex items-center gap-1.5 shadow-sm"
                        >
                          🤝 + Teslim Tesellüm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle('Tebliğ Tebellüğ Belgesi');
                            setNewDocDesc('Görevlendirme, idari karar, savunma istemi veya resmi bir duyurunun personele elden tebliğ edildiğini kayıt altına almak için.');
                            setNewDocContent(`                TEBLİĞ TEBELLÜĞ BELGESİ

    Tebliğ Edilen Konu: [Tebliğ Konusu. Örn: Görevlendirme Onayı / İdari Karar / Savunma İstemi]
    Tebliğ Yazısı Tarih ve Sayısı: [Yazı Tarihi / Sayısı]

    Yukarıda belirtilen tebliğ konusu yazı ve ekleri, muhatabı olan [Tebellüğ Eden Personel Ad Soyad]'a [Tebliğ Tarihi] tarihinde saat [Saat]'te elden tebliğ edilmiş olup, bir sureti kendisine teslim edilmiştir.


TEBLİĞ EDEN (Kurum Yetkilisi)                             TEBELLÜĞ EDEN (Muhatap)
Ad Soyad :                                                 Ad Soyad :
Unvan    :                                                 Unvan    :
İmza     :                                                 İmza     :`);
                          }}
                          className="px-2.5 py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl transition-all border border-slate-200 hover:border-blue-300 text-left flex items-center gap-1.5 shadow-sm"
                        >
                          📢 + Tebligat Örneği
                        </button>
                      </div>
                    </div>

                    {/* File Upload / Import */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-left">
                        <h5 className="text-xs font-bold text-slate-700">Bilgisayardan Belge Yükle (.docx, .txt, .md)</h5>
                        <p className="text-[11px] text-slate-500">Kendi Word veya şablon metin dosyanızı doğrudan içe aktarabilirsiniz.</p>
                      </div>
                      <label className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors font-bold px-3 py-2 rounded-xl text-xs cursor-pointer shadow-sm flex items-center gap-1.5">
                        <Download size={13} className="rotate-180 text-slate-500" /> Dosya Seç
                        <input
                          type="file"
                          accept=".txt,.md,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                              const isDocx = file.name.toLowerCase().endsWith('.docx');

                              if (isDocx) {
                                const reader = new FileReader();
                                reader.onload = async (event) => {
                                  const arrayBuffer = event.target?.result as ArrayBuffer;
                                  try {
                                    const result = await mammoth.extractRawText({ arrayBuffer });
                                    setNewDocContent(result.value);
                                    setNewDocTitle(nameWithoutExt);
                                    setNewDocDesc(`${file.name} Word belgesinden başarıyla yüklenen şablon.`);
                                  } catch (err) {
                                    console.error(err);
                                    alert('Word belgesi okunurken bir hata oluştu: ' + (err as Error).message);
                                  }
                                };
                                reader.readAsArrayBuffer(file);
                              } else {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const text = event.target?.result as string;
                                  setNewDocContent(text);
                                  setNewDocTitle(nameWithoutExt);
                                  setNewDocDesc(`${file.name} dosyasından yüklenen belge şablonu.`);
                                };
                                reader.readAsText(file);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Şablon Başlığı</label>
                      <input 
                        type="text" 
                        placeholder="Örn: Göreve Başlama Kabul Dilekçesi" 
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</label>
                      <textarea 
                        rows={2} 
                        placeholder="Belgenin hangi durumlarda kullanılacağı açıklaması..." 
                        value={newDocDesc}
                        onChange={(e) => setNewDocDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Belge İçeriği (Resmî Yazışma Kurallarına Uygun)</label>
                      
                      {/* Resmî Yazışma Düzen Araçları Toolbar */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            ✍️ Resmî Yazışma Düzen Araçları
                          </span>
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                            Word Çıktısı Uyumlu
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => insertFormat('tc', false)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            title="Ortalanmış T.C. Resmi Yazışma Başlığı Ekle"
                          >
                            🏢 T.C. Başlığı
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormat('sayi-tarih', false)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            title="Sayı ve Tarih satırını sol ve sağa hizalı ekler"
                          >
                            📅 Sayı/Tarih
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormat('center', false)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            title="Ortalanmış Konu veya Alt Başlık ekler"
                          >
                            🎯 Başlık Ortala
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormat('paragraph', false)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            title="Resmi paragraf başı için 4 boşluk bırakır"
                          >
                            ✏️ Paragraf Girişi
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormat('right-sig', false)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                            title="Resmî Yazışma Kurallarına Uygun Sağ İmza Bloğu Ekle"
                          >
                            ✍️ Tek İmza (Sağ)
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormat('double-sig', false)}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                            title="Karşılıklı Teslim Eden / Teslim Alan Çift İmza Bloğu Ekle"
                          >
                            🤝 Çift İmza
                          </button>
                        </div>
                        
                        <div className="bg-white border border-slate-100 rounded-lg p-2 text-[10px] text-slate-500 leading-relaxed">
                          <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                            <li><strong>Başlık:</strong> En az 10 boşlukla başlayan satırlar Word çıktısında otomatik <b>ortalanır</b>.</li>
                            <li><strong>Sağ İmza:</strong> En az 40 boşlukla başlayan imzalar Word çıktısında otomatik <b>sağ tarafa yerleşip ortalanır</b>.</li>
                            <li><strong>Çift İmza:</strong> Tek satırda çoklu boşlukla ayrılan çift imzalar yan yana tablo düzenine kavuşur.</li>
                          </ul>
                        </div>
                      </div>

                      <textarea 
                        id="new_doc_content_textarea"
                        rows={10} 
                        placeholder="Belge taslağını buraya giriniz veya yukarıdan hazır örnek seçin..." 
                        value={newDocContent}
                        onChange={(e) => setNewDocContent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-mono resize-y"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                İptal
              </button>
              <button 
                type="button"
                onClick={handleCreateTemplate}
                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg"
              >
                Kaydet ve Ekle
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Pencil size={20} className="text-blue-600" />
                  Şablonu Düzenle
                </h3>
                <button 
                  onClick={() => setEditingTemplate(null)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Şablon Adı</label>
                  <input 
                    type="text" 
                    value={editingTemplate.title} 
                    onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">İçerik (Metin)</label>
                  
                  {/* Resmî Yazışma Düzen Araçları Toolbar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        ✍️ Resmî Yazışma Düzen Araçları
                      </span>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                        Word Çıktısı Uyumlu
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => insertFormat('tc', true)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        title="Ortalanmış T.C. Resmi Yazışma Başlığı Ekle"
                      >
                        🏢 T.C. Başlığı
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('sayi-tarih', true)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        title="Sayı ve Tarih satırını sol ve sağa hizalı ekler"
                      >
                        📅 Sayı/Tarih
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('center', true)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        title="Ortalanmış Konu veya Alt Başlık ekler"
                      >
                        🎯 Başlık Ortala
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('paragraph', true)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        title="Resmi paragraf başı için 4 boşluk bırakır"
                      >
                        ✏️ Paragraf Girişi
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('right-sig', true)}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        title="Resmî Yazışma Kurallarına Uygun Sağ İmza Bloğu Ekle"
                      >
                        ✍️ Tek İmza (Sağ)
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('double-sig', true)}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        title="Karşılıklı Teslim Eden / Teslim Alan Çift İmza Bloğu Ekle"
                      >
                        🤝 Çift İmza
                      </button>
                    </div>
                    
                    <div className="bg-white border border-slate-100 rounded-lg p-2 text-[10px] text-slate-500 leading-relaxed">
                      <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                        <li><strong>Başlık:</strong> En az 10 boşlukla başlayan satırlar Word çıktısında otomatik <b>ortalanır</b>.</li>
                        <li><strong>Sağ İmza:</strong> En az 40 boşlukla başlayan imzalar Word çıktısında otomatik <b>sağ tarafa yerleşip ortalanır</b>.</li>
                        <li><strong>Çift İmza:</strong> Tek satırda çoklu boşlukla ayrılan çift imzalar yan yana tablo düzenine kavuşur.</li>
                      </ul>
                    </div>
                  </div>

                  <textarea 
                    id="edit_doc_content_textarea"
                    rows={10} 
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-mono resize-y"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setEditingTemplate(null)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={() => {
                  setLibraryTemplates(prev => {
                    const updated = prev.map(t => t.id === editingTemplate.id ? editingTemplate : t);
                    try {
                      localStorage.setItem('library_templates', JSON.stringify(updated));
                    } catch (e) {
                      console.error(e);
                    }
                    return updated;
                  });
                  setEditingTemplate(null);
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      {/* EKİP Detay ve Mevzuat Açılır Penceresi (Modal) */}
      {isEkipModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto"
          onClick={() => setIsEkipModalOpen(false)}
        >
          <div 
            className="bg-gradient-to-b from-white to-slate-50/80 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative border border-teal-100/50 my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dekoratif Gradient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-100/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="p-6 md:p-8 relative z-10">
              {/* Üst Başlık ve Kapat Butonu */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-600/10 rounded-2xl flex items-center justify-center border border-teal-500/20 text-teal-600 shadow-sm shrink-0">
                    <Activity size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-teal-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        BAKANLIK GÜNCELLEMESİ
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ÇKYS 👉 EKİP</span>
                    </div>
                    <h3 className="font-black text-slate-800 text-lg md:text-xl mt-1">
                      EKİP Portalı ve Mevzuat Bilgilendirmesi
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEkipModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2.5 rounded-full transition-all cursor-pointer"
                  title="Kapat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Genel Açıklama */}
              <div className="bg-teal-50/50 border border-teal-100/60 rounded-2xl p-4 mb-6">
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                  Sağlık Bakanlığı'nın eski ÇKYS/KYS sistemlerinin yerini alan <strong>EKİP (Entegre Kurumsal İşlem Platformu)</strong>; tüm insan kaynakları, tescil, atama, sözleşme, özlük ve hizmet içi eğitim yönetimini tek bir çatıda birleştiren güncel platformdur.
                </p>
              </div>

              {/* İki Sütunlu Detay Alanı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Sol Sütun - Mevzuat */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    ⚖️ Önemli Mevzuat Hatırlatmaları
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-3 list-disc pl-4 leading-relaxed">
                    <li>
                      <strong>Tescil Zorunluluğu:</strong> Göreve başlama, ayrılış ve tescil işlemleri artık tamamen EKİP sistemi üzerinden yürütülmektedir.
                    </li>
                    <li>
                      <strong>Maaş ve SGK Entegrasyonu:</strong> EKİP sistemine başlama tarihi girilmeyen personelin aktiflik durumu oluşmayacağından maaş hesaplama ve SGK bildirim süreçleri başlatılamaz.
                    </li>
                    <li>
                      <strong>Doğruluk Sorumluluğu:</strong> EKİP'e girilen bilgilerin doğruluğundan işlemi gerçekleştiren birim sorumludur.
                    </li>
                  </ul>
                </div>

                {/* Sağ Sütun - Bağlantılar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      🔗 EKİP Resmî Hızlı Erişim Linkleri
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      EKİP portalına doğrudan erişim, kullanım kılavuzları ve resmi destek talebi oluşturma bağlantıları:
                    </p>
                  </div>

                  <div className="space-y-2.5 mt-4">
                    <a 
                      href="https://ekip.saglik.gov.tr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-between shadow-md transition-all hover:scale-[1.01]"
                    >
                      <span>🌐 EKİP Portal Girişi</span>
                      <ExternalLink size={14} />
                    </a>
                    <a 
                      href="https://ekipdestek.saglik.gov.tr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-between transition-all"
                    >
                      <span>🛠️ EKİP Destek ve Kılavuzlar</span>
                      <ExternalLink size={14} className="text-slate-400" />
                    </a>
                    <a 
                      href="https://ortakgiris.saglik.gov.tr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-between transition-all"
                    >
                      <span>🔑 Sağlık Bakanlığı Ortak Giriş</span>
                      <ExternalLink size={14} className="text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Alt Bilgi & Kapatma Paneli */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">
                  © Türkiye Cumhuriyeti Sağlık Bakanlığı Entegre Sistem Entegrasyonu Bilgilendirmesi
                </span>
                <button 
                  onClick={() => setIsEkipModalOpen(false)}
                  className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  Anladım, Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Workflow Delete Confirmation Modal */}
      {workflowToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 transform transition-all animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 md:p-8 space-y-4 text-center">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-800">Süreci Sil</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>"{workflowToDelete.title}"</strong> isimli süreci tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setWorkflowToDelete(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={confirmDeleteWorkflow}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-200 cursor-pointer"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
