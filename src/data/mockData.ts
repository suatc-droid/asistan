import { WorkflowTemplate, Reminder, ActiveWorkflow } from '../types';

const standardSteps = [
  {
    id: 's_std_1',
    title: 'Evrak Kontrolü ve Kabul',
    description: 'Atamaya esas belgeleri ve kimlik doğrulamasını kontrol edin.',
    helpText: 'İlgili atama türüne uygun belgeleri (diploma, tescil belgesi, sağlık raporu, adli sicil kaydı vb.) teslim alarak özlük dosyasına ekleyin.'
  },
  {
    id: 's_std_2',
    title: 'İç Formlar ve Sözleşmeler',
    description: 'Başlayış formu, Gizlilik sözleşmesi ve Bilgi Güvenliği formunu tamamlatın.',
    helpText: 'Aşağıdaki belgelerin imzalanmasını sağlayın:\n1- Başlayış formu\n2- Gizlilik Sözleşmesi\n3- Bilgi güvenliği formu'
  },
  {
    id: 's_std_3',
    title: 'Tebligat İşlemleri',
    description: 'Atama kararı tebliğ edilerek resmi sisteme işlenmelidir.',
    helpText: 'Aşağıdaki işlemleri sırasıyla gerçekleştirin:\n1- Atama kararı Tebligatı yapılacak\n2- EKİP sisteminden Tebligatlar kısmına yüklenecek'
  },
  {
    id: 's_std_4',
    title: 'Sistemlerin Açılması ve Güncelleme',
    description: 'Personelin kurumsal hesaplarını tanımlayın ve sistem bilgilerini güncelleyin.',
    helpText: 'Aşağıdaki teknik adımları uygulayın:\n1- PANATES sistemi açılacak\n2- saglik.gov.tr mail açılacak (eğer yoksa)\n3- EKİP\'ten kişi bilgileri güncellenecektir\n4- DYS açılması için yazı yazılacak İSM\'ye'
  },
  {
    id: 's_std_5',
    title: 'Banka ve Kimlik Bilgilendirmesi',
    description: 'Maaş hesabı ve kimlik kartı işlemlerini yapması için personeli yönlendirin.',
    helpText: 'Aşağıdaki bilgilendirmeyi yapın:\n1- Personele, Ziraat Bankası şubesinden hesap açtırması ve İl Sağlık Müdürlüğünden personel kimlik kartı çıkarması gerektiği bilgisini verin.'
  }
];

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
    steps: standardSteps
  },
  {
    id: 'wf_tabip_mazeret',
    title: 'Mazeret Sonucu DHY Başlayışı',
    description: 'Mazeret (sağlık/eş durumu vb.) ataması sonucu DHY başlayışı işlemleri.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: standardSteps
  },
  {
    id: 'wf_tabip_uzman_dhy',
    title: 'DHY ile Uzman Hekim Başlayışı',
    description: 'Uzman hekim olarak DHY ataması sonucu başlayış işlemleri.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: standardSteps
  },
  {
    id: 'wf_tabip_es',
    title: 'Eş Durumu Sonucu Başlayış',
    description: 'Eş durumu ataması ile gelen tabip başlayışı işlemleri.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: standardSteps
  },
  {
    id: 'wf_tabip_illerarasi',
    title: 'İller Arası Atama Sonucu Başlayış',
    description: 'İller arası tayin ataması ile gelen tabip başlayışı.',
    icon: 'user-plus',
    categoryId: 'tabip_uzman',
    steps: standardSteps
  },

  // --- KADROLU YARDIMCI SAĞLIK PERSONELİ ---
  {
    id: 'wf_kpss_saglik',
    title: 'KPSS ile Kadrolu YSP Başlayışı',
    description: 'KPSS ataması ile gelen Kadrolu Yardımcı Sağlık Personeli işlemleri.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: standardSteps
  },
  {
    id: 'wf_ysp_es',
    title: 'Eş Durumu Başlayış',
    description: 'Eş durumu tayini ile gelen yardımcı sağlık personeli başlayışı.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: standardSteps
  },
  {
    id: 'wf_ysp_illerarasi',
    title: 'İller Arası Tayin Sonucu Başlayış',
    description: 'İller arası tayin ile gelen yardımcı sağlık personeli başlayışı.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: standardSteps
  },
  {
    id: 'wf_ysp_mazeret',
    title: 'Öğrenim / Sağlık Mazereti Başlayışı',
    description: 'Öğrenim veya sağlık mazereti tayini sonucu başlayış işlemleri.',
    icon: 'user-plus',
    categoryId: 'yardimci_saglik',
    steps: standardSteps
  },

  // --- SÖZLEŞMELİ (4/B) ---
  {
    id: 'wf_4b_kpss',
    title: 'KPSS Sonucu 4B Sözleşmeli Başlayış',
    description: 'KPSS ile atanan 4/B sözleşmeli personel başlayışı.',
    icon: 'user-plus',
    categoryId: 'sozlesmeli_4b',
    steps: standardSteps
  },
  {
    id: 'wf_4b_es',
    title: 'Eş Durumu Sonucu Başlayış',
    description: 'Eş durumu tayini ile gelen 4/B sözleşmeli personel başlayışı.',
    icon: 'user-plus',
    categoryId: 'sozlesmeli_4b',
    steps: standardSteps
  },
  {
    id: 'wf_4b_illerarasi',
    title: 'İller Arası Tayin Sonucu Başlayış',
    description: 'İller arası tayin ile gelen 4/B sözleşmeli personel başlayışı.',
    icon: 'user-plus',
    categoryId: 'sozlesmeli_4b',
    steps: standardSteps
  },

  // --- SÜREKLİ İŞÇİ ---
  {
    id: 'wf_isci_ilk',
    title: 'Sürekli İşçi İlk Atama Başlayış',
    description: 'İlk atama ile gelen sürekli işçi başlayışı.',
    icon: 'user-plus',
    categoryId: 'surekli_isci',
    steps: standardSteps
  },
  {
    id: 'wf_isci_es',
    title: 'Eş Durumu Gelen İşçi Başlayış',
    description: 'Eş durumu tayini ile gelen sürekli işçi başlayışı.',
    icon: 'user-plus',
    categoryId: 'surekli_isci',
    steps: standardSteps
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
