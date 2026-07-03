import { WorkflowTemplate, Reminder, ActiveWorkflow } from '../types';

export const defaultWorkflows: WorkflowTemplate[] = [
  // --- TABİP VE UZMAN HEKİM ---
  {
    id: 'wf_dhy_tabip',
    title: 'DHY ile Tabip Başlayışı',
    description: 'Devlet Hizmet Yükümlülüğü kapsamında atanan tabip ve uzman hekim başlayış işlemleri.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    criticalInfo: [
      'Uzmanlık eğitimlerini SB EAH veya SB adına üniversite hastanelerinde tamamlayıp kura ile yerleşenler mazeret belgeleri dışında atamaya esas belge vermezler.',
      'Kura sonucunda MSB, İçişleri Bakanlığı ve Adalet Bakanlığı için açılan kadrolara yerleşip ataması yapılamayanlar Sağlık Bakanlığı münhallerine yerleşmiş sayılır.',
      'Aile Hekimliği Birimine atanan hekimlerin işlemleri İlçe Sağlık Müdürlüğü / TSM tarafından yürütülür ve en geç ertesi gün mesai bitimine kadar "Aile Hekimliği Hizmet Sözleşmesi" yapılır.'
    ],
    steps: [
      {
        id: 's_1',
        title: 'Evrak Teslimi Kontrolü',
        description: 'Atamaya esas gerekli resmi belgeleri kontrol edip teslim alın.',
        helpText: 'İstenen belgeler: 1) Mal Bildirim Formu, 2) Vesikalık Fotoğraf (2 adet, son 6 ay), 3) Askerlik Durum Belgesi, 4) Adli Sicil Belgesi, 5) Sağlık Raporu (Tek hekim). NOT: SB hastanesinden devredenler sadece mazeret belgesi verir.'
      },
      {
        id: 's_2',
        title: 'İç Formlar ve Sözleşmeler',
        description: 'Gizlilik, Bilgi Güvenliği ve Başlayış Formu süreçlerini yürütün.',
        helpText: '1) Başlayış Formu hekime verilecek, tüm birim sorumlularına imzalattırıp geri getirecek. 2) Gizlilik Sözleşmesi ve 3) Bilgi Güvenliği Sözleşmesi imzalatılacak.'
      },
      {
        id: 's_3',
        title: 'Banka ve Kimlik Yönlendirmesi',
        description: 'Maaş hesabı ve kimlik kartı için personeli bilgilendirin.',
        helpText: 'Hekime, Ziraat Bankası şubesinden hesap açtırması ve İl Sağlık Müdürlüğünden personel kimlik kartı çıkarması gerektiği bilgisini verin.'
      },
      {
        id: 's_4',
        title: 'Sistem Kayıtları ve Yetkilendirme',
        description: 'Panates, e-posta ve bilgi güncelleme işlemlerini yapın.',
        helpText: '1) Panates yetkisi açılacak. 2) Sistemden hekimin iletişim (tel vb.) bilgileri güncellenecek. 3) Çalışacağı birim sisteme eklenecek. 4) Yoksa saglik.gov.tr uzantılı mail adresi açılacak.'
      },
      {
        id: 's_5',
        title: 'DYS (Doküman Yönetim Sistemi) Başlayışı',
        description: 'Tüm aşamalar bittikten sonra DYS üzerinden resmi başlayışı yapın.',
        helpText: 'DYS üzerinden personelin atama kararnamesi tarih/sayısı girilerek görev başlama yazısı yazılacak ve ilgili makama onaya sunulacaktır. (Bu en son adımdır.)'
      }
    ]
  },
  {
    id: 'wf_tabip_mazeret',
    title: 'Mazeret Sonucu DHY Başlayışı',
    description: 'Mazeret (sağlık/eş durumu vb.) ataması sonucu DHY başlayışı işlemleri.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_tabip_uzman_dhy',
    title: 'DHY ile Uzman Hekim Başlayışı',
    description: 'Uzman hekim olarak DHY ataması sonucu başlayış işlemleri.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_tabip_es',
    title: 'Eş Durumu Sonucu Başlayış',
    description: 'Eş durumu ataması ile gelen tabip başlayışı işlemleri.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_tabip_illerarasi',
    title: 'İller Arası Atama Sonucu Başlayış',
    description: 'İller arası tayin ataması ile gelen tabip başlayışı.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },

  // --- KADROLU YARDIMCI SAĞLIK PERSONELİ ---
  {
    id: 'wf_kpss_saglik',
    title: 'KPSS ile Kadrolu YSP Başlayışı',
    description: 'KPSS ataması ile gelen Kadrolu Yardımcı Sağlık Personeli işlemleri.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: [
      {
        id: 's_1',
        title: 'Başlayış Formu ve Evrak Teslimi',
        description: 'Sağlık kurulu raporu, adli sicil kaydı ve diplomayı teslim alın.',
        helpText: 'KPSS ile atanan personelin evraklarının asıllarını veya onaylı örneklerini dosyasına ekleyin. Başlayış formunu doldurun.'
      },
      {
        id: 's_2',
        title: 'SGK İşe Giriş Bildirgesi',
        description: 'SGK sisteminden işe giriş bildirgesini düzenleyin.',
        helpText: 'Memur (4/C) statüsünde işe girişlerini HİTAP üzerinden ve SGK işveren portalından aynı gün içinde mutlaka yapın. Gecikme cezası uygulanabilir!'
      },
      {
        id: 's_3',
        title: 'Maaş ve Mutemetlik Bildirimi',
        description: 'Aile yardımı, asgari geçim indirimi (varsa) ve banka hesap bilgilerini alın.',
        helpText: 'Personelin maaş mutemetliğine zamanında bildirilmesi, ilk maaşının eksik veya geç yatmaması için önemlidir.'
      },
      {
        id: 's_4',
        title: 'Oryantasyon ve Kurum Tanıtımı',
        description: 'Birim sorumlusuna teslim etmeden önce temel oryantasyon formunu imzalatın.',
        helpText: 'Personel İSG eğitimini almadan sahada çalışmaya başlamamalıdır.'
      }
    ]
  },
  {
    id: 'wf_ysp_es',
    title: 'Eş Durumu Başlayış',
    description: 'Eş durumu tayini ile gelen yardımcı sağlık personeli başlayışı.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_ysp_illerarasi',
    title: 'İller Arası Tayin Sonucu Başlayış',
    description: 'İller arası tayin ile gelen yardımcı sağlık personeli başlayışı.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_ysp_mazeret',
    title: 'Öğrenim / Sağlık Mazereti Başlayışı',
    description: 'Öğrenim veya sağlık mazereti tayini sonucu başlayış işlemleri.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },

  // --- SÖZLEŞMELİ (4/B) ---
  {
    id: 'wf_4b_kpss',
    title: 'KPSS Sonucu 4B Sözleşmeli Başlayış',
    description: 'KPSS ile atanan 4/B sözleşmeli personel başlayışı.',
    icon: 'user-plus',
    categoryId: 'sozlesmeli_4b',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_4b_es',
    title: 'Eş Durumu Sonucu Başlayış',
    description: 'Eş durumu tayini ile gelen 4/B sözleşmeli personel başlayışı.',
    icon: 'user-plus',
    categoryId: 'sozlesmeli_4b',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_4b_illerarasi',
    title: 'İller Arası Tayin Sonucu Başlayış',
    description: 'İller arası tayin ile gelen 4/B sözleşmeli personel başlayışı.',
    icon: 'user-plus',
    categoryId: 'sozlesmeli_4b',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },

  // --- SÜREKLİ İŞÇİ ---
  {
    id: 'wf_isci_ilk',
    title: 'Sürekli İşçi İlk Atama Başlayış',
    description: 'İlk atama ile gelen sürekli işçi başlayışı.',
    icon: 'user-plus',
    categoryId: 'surekli_isci',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  },
  {
    id: 'wf_isci_es',
    title: 'Eş Durumu Gelen İşçi Başlayış',
    description: 'Eş durumu tayini ile gelen sürekli işçi başlayışı.',
    icon: 'user-plus',
    categoryId: 'surekli_isci',
    steps: [
      { id: 's_1', title: 'Evrak ve Süreçler Bekleniyor', description: 'Bu sürecin adımları güncellenecektir.', helpText: 'Detaylar bekleniyor.' }
    ]
  }
];

export const defaultReminders: Reminder[] = [];

export const mockStats = {
  todayCompleted: 0,
  ongoingWorkflows: 0,
  pendingDocuments: 0,
  totalPersonnel: 0
};

export const mockOngoingWorkflows: ActiveWorkflow[] = [];
