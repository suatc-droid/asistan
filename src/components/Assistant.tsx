import React, { useState, useEffect } from 'react';
import { Bot, X, CheckCircle, Info, ArrowRight, AlertCircle, ChevronRight, Send, RefreshCw, MessageSquare } from 'lucide-react';
import { ActiveWorkflow, WorkflowTemplate } from '../types';
import { defaultWorkflows, defaultReminders } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

type ChatStage = 'idle' | 'asking_start' | 'selecting_category' | 'selecting_workflow' | 'running_workflow' | 'showing_help' | 'asking_custom';

interface AssistantProps {
  activeWorkflow: ActiveWorkflow | null;
  onHelpRequested: (helpText: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onStartWorkflow: (template: WorkflowTemplate) => void;
  workflows?: WorkflowTemplate[];
}

export function Assistant({ activeWorkflow, onHelpRequested, isOpen, setIsOpen, onStartWorkflow, workflows = defaultWorkflows }: AssistantProps) {
  const [chatStage, setChatStage] = useState<ChatStage>('asking_start');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [helpContent, setHelpContent] = useState<string | null>(null);
  
  const [customQuestion, setCustomQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync state with activeWorkflow
  useEffect(() => {
    if (activeWorkflow) {
      setChatStage('running_workflow');
      setAiResponse(null);
    } else if (chatStage === 'running_workflow' || chatStage === 'showing_help' || chatStage === 'asking_custom') {
      setChatStage('asking_start');
      setAiResponse(null);
    }
  }, [activeWorkflow]);

  const categories = [
    { id: 'tabip_uzman', label: 'Tabip ve Uzman Hekim' },
    { id: 'yardimci_saglik', label: 'Yardımcı Sağlık Personeli (Kadrolu)' },
    { id: 'sozlesmeli_4b', label: 'Sözleşmeli Personel (4/B)' },
    { id: 'surekli_isci', label: 'Sürekli İşçi' },
  ];

  const handleHelpClick = (text: string) => {
    setHelpContent(text);
    setChatStage('showing_help');
    onHelpRequested(text);
  };

  const handleCustomAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    
    try {
      let contextStr = 'Genel Soru';
      if (activeWorkflow) {
        contextStr = `Kullanıcı şu anda '${activeWorkflow.title}' sürecini yürütüyor.`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: customQuestion, context: contextStr }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiResponse(data.reply);
      } else {
        setAiResponse(`Sistem Hatası: ${data.error || 'Bağlantı kurulamadı.'}`);
      }
    } catch (error) {
      setAiResponse('Üzgünüm, şu an bağlantı kuramıyorum.');
    } finally {
      setIsAiLoading(false);
      setCustomQuestion('');
    }
  };

  const getAssistantMessage = () => {
    if (chatStage === 'asking_start') {
      const activeRemindersCount = defaultReminders.filter(r => !r.isCompleted).length;
      return (
        <div className="space-y-4">
          <p className="text-sm">Günaydın! Bugün <strong className="text-orange-400">{activeRemindersCount}</strong> yaklaşan işiniz bulunuyor.</p>
          {activeRemindersCount > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
              <ul className="space-y-2">
                {defaultReminders.filter(r => !r.isCompleted).map(r => (
                  <li key={r.id} className="flex items-start gap-2 text-slate-700">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="leading-tight">{r.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm text-slate-500 mt-2">Yeni bir işlem başlatmak ister misiniz?</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button 
              onClick={() => setChatStage('selecting_category')}
              className="py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg"
            >
              EVET, BAŞLA
            </button>
            <button 
              onClick={() => setChatStage('asking_custom')}
              className="py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <MessageSquare size={14} /> DANIŞ
            </button>
          </div>
        </div>
      );
    }

    if (chatStage === 'asking_custom') {
      return (
        <div className="space-y-3">
          <p className="text-sm">Bana mevzuat veya süreçlerle ilgili soru sorabilirsiniz:</p>
          
          {aiResponse ? (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {aiResponse}
            </div>
          ) : (
            <form onSubmit={handleCustomAsk} className="relative">
              <input 
                type="text" 
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Örn: Tebligat hazırlarken nelere dikkat etmeliyim?"
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={!customQuestion.trim() || isAiLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {isAiLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </form>
          )}

          <button 
            onClick={() => {
              setChatStage('asking_start');
              setAiResponse(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-700 mt-2 flex items-center gap-1 w-full justify-center py-2"
          >
            ← Ana Menüye Dön
          </button>
        </div>
      );
    }

    if (chatStage === 'selecting_category') {
      return (
        <div className="space-y-3">
          <p className="text-sm">Personelin sınıfı nedir?</p>
          <div className="space-y-2">
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setChatStage('selecting_workflow');
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-white border border-slate-200 transition-colors text-xs text-left"
              >
                <span>{cat.label}</span>
                <ChevronRight size={14} className="text-slate-500" />
              </button>
            ))}
          </div>
          <button 
            onClick={() => setChatStage('asking_start')}
            className="text-xs text-slate-500 hover:text-slate-700 mt-2 flex items-center gap-1"
          >
            ← Geri Dön
          </button>
        </div>
      );
    }

    if (chatStage === 'selecting_workflow') {
      const categoryWorkflows = workflows.filter(w => w.categoryId === selectedCategory);
      
      return (
        <div className="space-y-3">
          <p className="text-sm">Hangi işlem yapılacak?</p>
          <div className="space-y-2">
            {categoryWorkflows.length > 0 ? categoryWorkflows.map(wf => (
              <button 
                key={wf.id}
                onClick={() => {
                  onStartWorkflow(wf);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-xs text-left text-blue-700 font-medium shadow-lg"
              >
                <span>{wf.title}</span>
                <ArrowRight size={14} />
              </button>
            )) : (
              <p className="text-xs text-slate-500 italic p-2 bg-white/50 rounded-lg">Bu kategoriye ait işlem bulunamadı.</p>
            )}
          </div>
          <button 
            onClick={() => setChatStage('selecting_category')}
            className="text-xs text-slate-500 hover:text-slate-700 mt-2 flex items-center gap-1"
          >
            ← Kategori Seçimine Dön
          </button>
        </div>
      );
    }

    if (chatStage === 'showing_help') {
      return (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-blue-400">İşte yapmanız gerekenler:</p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700">
            {helpContent}
          </div>
          <button 
            onClick={() => setChatStage('running_workflow')}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors mt-2"
          >
            ANLADIM, GERİ DÖN
          </button>
        </div>
      );
    }

    if (chatStage === 'running_workflow' && activeWorkflow) {
      const currentStep = activeWorkflow.steps.find(s => !s.isCompleted);
      
      if (!currentStep) {
        return <p className="text-sm text-green-400">Harika! "{activeWorkflow.title}" sürecinin tüm adımlarını tamamladınız.</p>;
      }

      return (
        <div className="space-y-3">
          <p className="text-sm">Şu an <strong className="text-slate-800">{activeWorkflow.title}</strong> sürecini yürütüyorsunuz.</p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
            <p className="font-semibold mb-1 text-slate-700">Sıradaki Adım: <span className="text-blue-400">{currentStep.title}</span></p>
            <p className="text-slate-500 text-xs">{currentStep.description}</p>
          </div>
          
          {aiResponse ? (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {aiResponse}
              <button 
                onClick={() => setAiResponse(null)}
                className="block text-xs text-blue-400 hover:text-blue-300 mt-3"
              >
                Kapat
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500">Nasıl yapacağınızı bilmiyorsanız veya mevzuat danışmak istiyorsanız seçin:</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button 
                  onClick={() => handleHelpClick(currentStep.helpText)}
                  className="py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg"
                >
                  NASIL YAPILIR?
                </button>
                <button 
                  onClick={() => setChatStage('asking_custom')}
                  className="py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <MessageSquare size={14} /> DANIŞ
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-105 transition-all z-50"
          >
            <Bot size={28} />
            {activeWorkflow && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Assistant Panel HUD */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-transparent flex flex-col shrink-0 z-50 pointer-events-auto"
          >
            {/* Virtual Robot HUD */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 shadow-2xl relative overflow-hidden group">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10 bg-slate-50 p-1.5 rounded-full hover:bg-slate-200"
              >
                <X size={16} />
              </button>
              
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
              <div className="flex justify-center mb-6 mt-2">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center relative">
                  <div className="w-12 h-6 bg-white rounded-full flex items-center justify-around px-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-1 w-8 h-1 bg-white/20 rounded-full"></div>
                </div>
              </div>
              <h4 className="text-center text-slate-800 font-bold mb-1">Kurumsal Asistan</h4>
              <p className="text-center text-blue-400 text-xs font-mono uppercase tracking-tighter">AI Assistant v2.4</p>
              
              <div className="mt-6 bg-white/80 rounded-xl p-4 border border-slate-200 text-slate-800">
                {getAssistantMessage()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
