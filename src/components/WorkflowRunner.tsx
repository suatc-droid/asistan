import React, { useState, useEffect } from 'react';
import { ActiveWorkflow, ActiveStep } from '../types';
import { CheckCircle, Circle, Info, HelpCircle, AlertTriangle, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkflowRunnerProps {
  workflow: ActiveWorkflow;
  onUpdateStep: (stepId: string, isCompleted: boolean) => void;
  onComplete: () => void;
  onHelpRequested: (helpText: string) => void;
  onStepSelect?: (step: ActiveStep | null) => void;
}

export function WorkflowRunner({ 
  workflow, 
  onUpdateStep, 
  onComplete, 
  onHelpRequested,
  onStepSelect
}: WorkflowRunnerProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [recentTip, setRecentTip] = useState<{ id: string; tip: string } | null>(null);

  useEffect(() => {
    if (onStepSelect) {
      if (expandedStep) {
        const step = workflow.steps.find(s => s.id === expandedStep);
        if (step) {
          onStepSelect(step);
          return;
        }
      }
      // Fallback to first uncompleted step as active context
      const firstUncompleted = workflow.steps.find(s => !s.isCompleted);
      onStepSelect(firstUncompleted || null);
    }
  }, [expandedStep, workflow.steps, onStepSelect]);

  const getTipForStep = (title: string) => {
    if (title.includes('Evrak')) return "Evrakların asıllarının görülüp, fotokopilerinin 'Aslı Gibidir' onayının yapıldığından emin olun.";
    if (title.includes('Sözleşme') || title.includes('İç Form')) return "Sözleşmelerin tüm sayfalarının memur ve yetkili amir tarafından paraflanması zorunludur.";
    if (title.includes('Banka')) return "SGK bildirgesindeki hesap bilgileriyle mutemetliğe verilen IBAN'ın aynı olması işlemleri hızlandırır.";
    if (title.includes('Sistem') || title.includes('Yetkilendirme')) return "Yeni EKİP sistemine (eski ÇKYS) başlama kaydı düşülmeden maaş hesaplaması tetiklenmez. Aynı gün girilmesi esastır.";
    if (title.includes('DYS')) return "DYS üzerinden yazılan başlama yazılarının sayı numarası tarihi ile kişinin başlama günü uyumlu olmalıdır.";
    if (title.includes('SGK')) return "İşe giriş bildirgesi geç verilirse (istisnai haller hariç) asgari ücretin 1 katından başlayan idari para cezası uygulanır.";
    if (title.includes('Maaş')) return "Personelin aile yardımı ve asgari geçim bilgilerini kanıtlayıcı belgelerle birlikte iletmeyi unutmayın.";
    return "Mevzuat gereği süreç adımlarının yasal süreler içerisinde tamamlandığını mutlaka teyit ediniz.";
  };

  const handleToggleStep = (stepId: string, currentStatus: boolean, title: string) => {
    if (!currentStatus) {
      setRecentTip({ id: stepId, tip: getTipForStep(title) });
      setTimeout(() => setRecentTip(null), 6000);
    } else {
      setRecentTip(null);
    }
    onUpdateStep(stepId, !currentStatus);
  };

  const handleGenerateDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratedDraft(`T.C. SAĞLIK BAKANLIĞI
İl Sağlık Müdürlüğü
Sayı: ...
Konu: Göreve Başlama (${workflow.title})

İLGİLİ MAKAMA
Bakanlığımızca ataması yapılan personelin evrakları incelenmiş olup, görevine başlamasında sakınca görülmemiştir.
Gereğini arz ederim.

[Otomatik oluşturuldu, lütfen DYS üzerinden sayı numarası alarak imzalayınız.]`);
  };

  const progress = Math.round(
    (workflow.steps.filter((s) => s.isCompleted).length / workflow.steps.length) * 100
  );

  const allCompleted = workflow.steps.every(s => s.isCompleted);

  return (
    <div className="bg-transparent overflow-hidden">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">Aktif Süreç</span>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">{workflow.title}</h2>
            <p className="text-slate-500 mt-1 text-sm">
              Başlama: {new Date(workflow.startedAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Tamamlanma Oranı</p>
            <p className="text-2xl font-bold text-blue-600">%{progress}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-blue-600 h-2 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>

      {/* Critical Info Box */}
      {workflow.criticalInfo && workflow.criticalInfo.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-orange-600" />
            <h3 className="text-sm font-bold text-orange-800 uppercase tracking-widest">Önemli Hatırlatmalar</h3>
          </div>
          <ul className="space-y-3">
            {workflow.criticalInfo.map((info, idx) => (
              <li key={idx} className="text-sm text-orange-800 flex items-start gap-3">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span className="leading-relaxed">{info}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Gerekli Formlar ve Belgeler</h3>
        <ul className="space-y-3">
          {workflow.steps.map((step, index) => {
            const isNext = index === 0 || workflow.steps[index - 1].isCompleted;
            const isEnabled = step.isCompleted || isNext;

            return (
              <motion.li 
                key={step.id}
                layout
                className={`p-3 rounded-xl border transition-colors ${
                  step.isCompleted ? 'bg-green-50 border-green-100' :
                  isEnabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => isEnabled && setExpandedStep(expandedStep === step.id ? null : step.id)}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      disabled={!isEnabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStep(step.id, step.isCompleted, step.title);
                      }}
                      className={`flex-shrink-0 transition-colors flex items-center justify-center ${
                        step.isCompleted ? 'w-5 h-5 bg-green-500 rounded-full text-white' : 
                        isEnabled ? 'w-5 h-5 border-2 border-slate-300 rounded-full hover:border-blue-500' : 'w-5 h-5 border-2 border-slate-200 rounded-full'
                      }`}
                    >
                      {step.isCompleted && <CheckCircle size={14} />}
                    </button>
                    
                    <span className={`text-sm font-medium ${step.isCompleted ? 'text-slate-700' : 'text-slate-700'}`}>
                      {step.title}
                    </span>
                  </div>

                  {step.isCompleted ? (
                    <span className="text-xs font-bold text-green-600">TAMAM</span>
                  ) : !isEnabled ? (
                    <span className="text-xs font-bold text-slate-400 font-mono italic">BEKLİYOR</span>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStep(step.id, false, step.title);
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      YAPILDI
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {recentTip?.id === step.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-3 bg-blue-50/80 border border-blue-200 rounded-lg p-3 flex gap-3 overflow-hidden"
                    >
                      <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Mevzuat Odaklı İpucu</p>
                        <p className="text-sm text-blue-900 leading-relaxed">{recentTip.tip}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {expandedStep === step.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 text-sm text-slate-600 border-t border-slate-100 pt-3 flex flex-col gap-2"
                  >
                    <p>{step.description}</p>
                    <div className="bg-slate-50 p-3 rounded-lg flex items-start gap-2 border border-slate-100">
                      <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-slate-600">{step.helpText}</p>
                    </div>
                    
                    {step.title.includes('DYS') && (
                      <div className="mt-2">
                        {!generatedDraft ? (
                          <button
                            onClick={handleGenerateDraft}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200"
                          >
                            <FileText size={14} /> DYS Taslağı Hazırla
                          </button>
                        ) : (
                          <div className="bg-slate-50 text-slate-700 p-4 rounded-xl border border-slate-200 text-xs font-mono relative group">
                            <button className="absolute top-2 right-2 text-slate-400 hover:text-white" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(generatedDraft); }}>Kopyala</button>
                            <pre className="whitespace-pre-wrap">{generatedDraft}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      {allCompleted && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center shadow-sm"
          >
            Süreci Tamamla ve Kapat
          </button>
        </div>
      )}
    </div>
  );
}
