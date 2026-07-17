import { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Instagram, 
  MessageCircle, 
  Play, 
  ArrowRight, 
  X, 
  Check, 
  ChevronRight, 
  Phone, 
  Calendar, 
  UserCheck, 
  Award, 
  Lock,
  Volume2,
  VolumeX
} from "lucide-react";

// Types for the quiz answers
type QuizAnswers = {
  [key: number]: string;
};

// Custom type for gallery item
interface GalleryItem {
  id: number;
  url: string;
  category: "otomodelacao" | "harmonizacao";
  title?: string;
}

export default function App() {
  // Navigation states
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);
  const [quizStep, setQuizStep] = useState(0); // 0: Gate/Intro, 1-4: Questions, 5: Analisando Loading, 6: Results Page
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Iniciando análise...");
  const [activeTab, setActiveTab] = useState<"otomodelacao" | "harmonizacao">("otomodelacao");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // References for scroll navigation
  const aboutRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Gallery array structured for easy expansion by the expert later
  const galleryItems: GalleryItem[] = [
    // Category 1: Otomodelação & Estética Geral (Before/After)
    { id: 1, url: "https://i.imgur.com/TI2rQO3.png", category: "otomodelacao", title: "Otomodelação Avançada" },
    { id: 2, url: "https://i.imgur.com/ocyB2H0.png", category: "otomodelacao", title: "Harmonia das Orelhas" },
    { id: 3, url: "https://i.imgur.com/wAYL87A.png", category: "otomodelacao", title: "Procedimento Minimamente Invasivo" },
    { id: 4, url: "https://i.imgur.com/LQ7tD4S.png", category: "otomodelacao", title: "Simetria Facial" },
    { id: 5, url: "https://i.imgur.com/EyC9gwd.png", category: "otomodelacao", title: "Correção Estética Natural" },
    
    // Category 2: Harmonização de ❤️ (Green hearts)
    { id: 6, url: "https://i.imgur.com/GOTdz3z.png", category: "harmonizacao", title: "Estética Facial de Alta Performance" },
    { id: 7, url: "https://i.imgur.com/IakuGY6.png", category: "harmonizacao", title: "Proporções Áureas com Naturalidade" },
    { id: 8, url: "https://i.imgur.com/POHK4Xw.png", category: "harmonizacao", title: "Realce de Ângulos e Detalhes" },
    { id: 9, url: "https://i.imgur.com/PZXSPNt.png", category: "harmonizacao", title: "Método Exclusivo Alexia Lima" }
    // NOTE: More links can be appended here seamlessly by duplicating the structures above.
  ];

  // Backstage items for custom auto-sliding gallery
  const backstageItems = [
    { id: 1, url: "https://i.imgur.com/hoHBi6m.png", desc: "Estudo estético personalizado de cada paciente" },
    { id: 2, url: "https://i.imgur.com/Rzdm02l.png", desc: "Consultório moderno e confortável no coração de São Luís" },
    { id: 3, url: "https://i.imgur.com/TI2rQO3.png", desc: "Materiais premium e foco em assepsia avançada" },
    { id: 4, url: "https://i.imgur.com/ocyB2H0.png", desc: "Análise minuciosa de proporções faciais" },
    { id: 5, url: "https://i.imgur.com/wAYL87A.png", desc: "Atendimento acolhedor e privativo de alta classe" }
  ];

  // Questions for the customized quiz
  const quizQuestions = [
    {
      id: 1,
      question: "Qual é o seu principal objetivo estético hoje?",
      options: [
        "Corrigir o incômodo com orelhas de abano (Otomodelação)",
        "Realçar os traços e rejuvenescer de forma natural (Estética)",
        "Ambos os objetivos - harmonização global e correção"
      ]
    },
    {
      id: 2,
      question: "O que você prioriza ao realizar um procedimento?",
      options: [
        "Naturalidade extrema, sem parecer que fiz procedimentos",
        "Rapidez, conforto e pós-procedimento muito tranquilo",
        "Atendimento personalizado diretamente com a especialista"
      ]
    },
    {
      id: 3,
      question: "Você já realizou algum procedimento estético anteriormente?",
      options: [
        "Sim, e quero fazer novos retoques ou novos procedimentos",
        "Não, seria minha primeira vez e busco segurança total"
      ]
    },
    {
      id: 4,
      question: "Qual é o seu maior medo ou receio hoje?",
      options: [
        "Ficar com um resultado artificial ou exagerado",
        "Sentir dor forte ou ter uma recuperação complicada",
        "Não receber assistência e acompanhamento após a sessão"
      ]
    }
  ];

  // Handle WhatsApp Link Generation and Redirection
  const getWhatsAppLink = (type: "assessment" | "direct" | "compromisso") => {
    const baseUrl = "https://api.whatsapp.com/send/?phone=559484058820";
    
    if (type === "assessment") {
      const q1 = answers[1] || "Não respondido";
      const q2 = answers[2] || "Não respondido";
      const q3 = answers[3] || "Não respondido";
      const q4 = answers[4] || "Não respondido";
      
      const text = `Olá Dra. Alexia! Acabei de realizar o meu Quiz de Avaliação Personalizada no site:\n\n` +
                   `✦ *Objetivo:* ${q1}\n` +
                   `✦ *Prioridade:* ${q2}\n` +
                   `✦ *Histórico:* ${q3}\n` +
                   `✦ *Receio principal:* ${q4}\n\n` +
                   `Meu resultado deu *Perfil Compatível / Paciente Ideal*. Quero enviar minha avaliação e agendar minha consulta em São Luís!`;
                   
      return `${baseUrl}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
    } else if (type === "compromisso") {
      const text = "Olá Dra. Alexia! Gostaria de conversar e tirar algumas dúvidas sobre a Otomodelação e procedimentos estéticos, sem compromisso.";
      return `${baseUrl}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
    } else {
      // Direct message fallback from prompt
      return "https://api.whatsapp.com/send/?phone=559484058820&text=Ol%C3%A1%21+Vim+pelo+site+da+cl%C3%ADnica+e+me+interessei+na+Otomodela%C3%A7%C3%A3o+em+S%C3%A3o+Lu%C3%ADs.&type=phone_number&app_absent=0";
    }
  };

  // Custom function to handle smooth scrolling to sections
  const scrollToSection = (ref: { current: HTMLElement | null }) => {
    setIsOverlayOpen(false); // Close overlay if open
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Run analyzing progress bar when quizStep transitions to 5
  useEffect(() => {
    if (quizStep === 5) {
      setLoadingProgress(0);
      const texts = [
        "Iniciando análise das respostas...",
        "Calculando grau de compatibilidade facial...",
        "Avaliando objetivos de naturalidade e segurança...",
        "Cruzando com a metodologia Dra. Alexia Lima...",
        "Perfil gerado com sucesso!"
      ];
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 2;
        setLoadingProgress(currentProgress);
        
        // Update helper texts based on progress thresholds
        if (currentProgress < 25) {
          setLoadingText(texts[0]);
        } else if (currentProgress < 50) {
          setLoadingText(texts[1]);
        } else if (currentProgress < 75) {
          setLoadingText(texts[2]);
        } else if (currentProgress < 95) {
          setLoadingText(texts[3]);
        } else {
          setLoadingText(texts[4]);
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setQuizStep(6); // Go to Results Page
          }, 300);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [quizStep]);

  const selectAnswer = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    if (questionId < quizQuestions.length) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizStep(5); // Move to analyzing screen
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-white">
      
      {/* BACKGROUND FLOATING ORNAMENTS FOR LUXURY ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* ================= QUIZ OVERLAY & RESULTS PAGE (GATEKEEPER) ================= */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div 
            id="quiz-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xl bg-primary-dark/85 overflow-y-auto"
          >
            {/* COMPACT CARD OPTIMIZED FOR MOBILE */}
            <motion.div 
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-lg bg-primary-light rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gold/15 flex flex-col my-auto max-h-[96vh] sm:max-h-[90vh]"
            >
              
              {/* TOP STRIP - GOLD EMBELLISHMENTS */}
              <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-gold-light via-gold to-gold-dark" />

              {/* FLOATING EXPERT HEADER WITH NAME & MOLDED FRAME (VISIBLE ON ALL QUIZ STEPS) */}
              <div className="p-3 sm:p-5 pb-2.5 sm:pb-3 border-b border-zinc-900 bg-black/40 flex items-center gap-3 sm:gap-4 relative">
                
                {/* Floating Rounded Portrait of Expert */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gold shadow-lg relative bg-zinc-950 flex items-center justify-center">
                    <img 
                      src="https://i.imgur.com/Rzdm02l.png" 
                      alt="Dra. Alexia Lima" 
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-zinc-950 text-white rounded-full p-0.5 sm:p-1 border border-gold">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold animate-pulse" />
                  </div>
                </div>

                {/* Identity Text */}
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                    Alexia Lima
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gold font-medium tracking-wider uppercase">
                    Estética & Otomodelação
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-400">São Luís • MA</p>
                </div>

                {/* Direct Close Button in corner */}
                <button 
                  onClick={() => setIsOverlayOpen(false)}
                  className="absolute right-3 sm:right-4 top-3 sm:top-4 text-zinc-400 hover:text-white transition-colors p-1.5 sm:p-2 rounded-full hover:bg-zinc-900"
                  title="Acessar o site diretamente"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* MAIN OVERLAY CONTENT ROUTER */}
              <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-between max-h-[calc(100vh-140px)] sm:max-h-[75vh] overflow-y-auto">
                
                {/* STEP 0: WELCOME SCREEN */}
                {quizStep === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4 sm:space-y-5 text-center py-1 sm:py-2"
                  >
                    <div className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-gold/10 text-gold text-[10px] sm:text-xs font-semibold rounded-full border border-gold/25">
                      ✨ Avaliação Estética Personalizada
                    </div>
                    
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-bold tracking-tight leading-snug">
                      Descubra o método ideal para realçar sua <span className="text-gold font-serif italic">beleza natural</span>
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
                      Antes de entrar, passe por uma rápida avaliação em 4 perguntas ou converse diretamente com a Dra. Alexia Lima.
                    </p>

                    {/* ACTION TRIGGERS */}
                    <div className="space-y-2.5 pt-2 sm:pt-3">
                      <button 
                        onClick={() => setQuizStep(1)}
                        className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gold hover:bg-gold-light text-black font-extrabold text-xs sm:text-sm md:text-base rounded-2xl shadow-lg shadow-gold/10 hover:shadow-gold/20 transition-all flex items-center justify-center gap-2 group cursor-pointer btn-premium-pulse"
                      >
                        <span>Fazer Avaliação Estética (1 min) 💚</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setIsOverlayOpen(false)}
                          className="py-2.5 sm:py-3 px-2 sm:px-4 bg-transparent hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 font-medium text-[11px] sm:text-xs rounded-xl transition-all cursor-pointer text-center"
                        >
                          Ir Direto para o Site
                        </button>
                        <a 
                          href={getWhatsAppLink("compromisso")}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="py-2.5 sm:py-3 px-2 sm:px-4 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 font-medium text-[11px] sm:text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1 sm:gap-1.5"
                        >
                          <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEPS 1 TO 4: ACTIVE QUESTIONS */}
                {quizStep >= 1 && quizStep <= 4 && (
                  <motion.div 
                    key={quizStep}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: -25 }}
                    className="space-y-4 sm:space-y-5"
                  >
                    {/* Header Progress indicator */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between items-center text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                        <span>Passo {quizStep} de 4</span>
                        <span className="text-gold">{Math.round((quizStep / 4) * 100)}% concluído</span>
                      </div>
                      <div className="w-full h-1 sm:h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-gold to-white"
                          initial={{ width: `${Math.round(((quizStep - 1) / 4) * 100)}%` }}
                          animate={{ width: `${Math.round((quizStep / 4) * 100)}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Question text */}
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
                      {quizQuestions[quizStep - 1].question}
                    </h3>

                    {/* Options list */}
                    <div className="space-y-2 sm:space-y-3 pt-0.5 sm:pt-1">
                      {quizQuestions[quizStep - 1].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(quizStep, option)}
                          className="w-full p-3 sm:p-4 text-left border border-zinc-800 hover:border-gold bg-[#0d0d0d] hover:bg-gold/5 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-zinc-300 font-medium transition-all duration-200 active:scale-[0.98] focus:ring-2 focus:ring-gold/30 flex items-start gap-2.5 sm:gap-3 cursor-pointer group"
                        >
                          <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 rounded-full border border-gold/30 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gold group-hover:bg-gold group-hover:text-black transition-all">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="leading-tight text-zinc-300 group-hover:text-white transition-colors">{option}</span>
                        </button>
                      ))}
                    </div>

                    {/* Skip button footer inside quiz */}
                    <div className="pt-3 sm:pt-4 border-t border-zinc-900 flex justify-between items-center">
                      <button 
                        onClick={() => {
                          if (quizStep > 1) {
                            setQuizStep(prev => prev - 1);
                          } else {
                            setQuizStep(0);
                          }
                        }}
                        className="text-[11px] sm:text-xs text-zinc-500 hover:text-white transition-colors font-medium"
                      >
                        Voltar
                      </button>
                      
                      <button 
                        onClick={() => setIsOverlayOpen(false)}
                        className="text-[11px] sm:text-xs text-gold font-semibold hover:underline"
                      >
                        Pular avaliação e ver site ✦
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: LOADING BAR ("ANALISANDO...") */}
                {quizStep === 5 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4 sm:py-8 space-y-4 sm:space-y-6"
                  >
                    <div className="relative inline-flex items-center justify-center p-2.5 sm:p-3 rounded-full bg-gold/10">
                      <Sparkles className="w-6 h-6 sm:w-8 h-8 text-gold animate-spin" style={{ animationDuration: '3s' }} />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                        {loadingText}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-400">
                        Processando dados anatômicos de forma exclusiva...
                      </p>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {/* Interactive Progress Bar */}
                      <div className="w-full h-2.5 sm:h-3 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                        <div 
                          className="h-full bg-gradient-to-r from-gold via-gold-dark to-white rounded-full transition-all duration-100"
                          style={{ width: `${loadingProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] sm:text-xs text-gold font-mono font-bold">{loadingProgress}%</span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 text-left max-w-xs mx-auto">
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400">
                        <Check className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${loadingProgress >= 25 ? 'text-green-500' : 'text-zinc-700'}`} />
                        <span className={loadingProgress >= 25 ? 'text-white font-medium' : ''}>Análise de simetria natural</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400">
                        <Check className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${loadingProgress >= 50 ? 'text-green-500' : 'text-zinc-700'}`} />
                        <span className={loadingProgress >= 50 ? 'text-white font-medium' : ''}>Critérios de segurança de São Luís</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400">
                        <Check className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${loadingProgress >= 75 ? 'text-green-500' : 'text-zinc-700'}`} />
                        <span className={loadingProgress >= 75 ? 'text-white font-medium' : ''}>Compatibilidade do Método Alexia Lima</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: PERSUASIVE RESULTS PAGE ("PERFIL COMPATÍVEL") */}
                {quizStep === 6 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-3 sm:space-y-4 py-1 sm:py-2"
                  >
                    {/* Header Banner - Compact & Striking */}
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-950/40 text-emerald-400 text-[10px] sm:text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                        <UserCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
                        <span>Perfil Compatível. Você é a Paciente ideal.</span>
                      </div>
                      
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight pt-0.5 sm:pt-1">
                        Avaliação Finalizada com Sucesso!
                      </h3>
                    </div>

                    {/* Sophisticated Expert Highlight Card (From peito para cima, with high class design) */}
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-gold/20 bg-primary-dark max-h-[120px] sm:max-h-[160px] flex items-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary/80 to-transparent z-10" />
                      
                      {/* Expert Portrait in the Background Right */}
                      <img 
                        src="https://i.imgur.com/Rzdm02l.png" 
                        alt="Dra. Alexia Lima" 
                        className="absolute right-0 top-0 w-1/2 h-full object-cover object-top filter contrast-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive text container over dark gradient */}
                      <div className="relative z-20 p-3 sm:p-4 text-left w-2/3 space-y-0.5 sm:space-y-1.5">
                        <p className="text-[9px] sm:text-[11px] text-gold font-bold tracking-wider uppercase">Método de Atendimento</p>
                        <p className="text-[10px] sm:text-xs text-white leading-normal sm:leading-relaxed font-light">
                          "Com base nas suas respostas, o Método da <strong className="text-gold font-serif font-semibold">Dra. Alexia Lima</strong> consegue entregar exatamente a naturalidade e segurança que você procura."
                        </p>
                      </div>
                    </div>

                    {/* THE THREE REQUIRED ACTION BUTTONS */}
                    <div className="space-y-2 pt-1">
                      
                      {/* BUTTON 1: ENVIAR MINHA AVALIAÇÃO A DRA */}
                      <a 
                        href={getWhatsAppLink("assessment")}
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setIsOverlayOpen(false)}
                        className="w-full py-3 sm:py-3.5 px-4 sm:px-5 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-105 text-white font-bold text-[12px] sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer btn-premium-pulse"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0" />
                        <span>1. ENVIAR MINHA AVALIAÇÃO À DRA.</span>
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </a>

                      {/* BUTTON 2: CHAMAR NO WHATSAPP SEM COMPROMISSO */}
                      <a 
                        href={getWhatsAppLink("compromisso")}
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setIsOverlayOpen(false)}
                        className="w-full py-2.5 sm:py-3 px-4 sm:px-5 bg-transparent hover:bg-zinc-900 text-white font-semibold text-[11px] sm:text-xs rounded-xl border border-gold/30 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" />
                        <span>2. CHAMAR NO WHATSAPP SEM COMPROMISSO</span>
                      </a>

                      {/* BUTTON 3: NÃO ENVIAR E CONTINUAR NO SITE */}
                      <button 
                        onClick={() => setIsOverlayOpen(false)}
                        className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-[10px] sm:text-xs rounded-lg transition-all uppercase tracking-wider text-center"
                      >
                        3. NÃO ENVIAR E CONTINUAR NO SITE
                      </button>

                    </div>
                  </motion.div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ================= STICKY SLOW-RUNNING NAVIGATION TICKER (LOGRADOURO) ================= */}
      <div className="sticky top-0 z-40 bg-primary text-gold border-b border-gold-dark/20 overflow-hidden py-2 shadow-md">
        <div className="relative w-full flex items-center">
          
          {/* Infinite Marquee Loop of scroll directions */}
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs md:text-sm font-semibold tracking-wide select-none">
            
            {/* Ticker Set 1 */}
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>SOBRE MIM</span> <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(resultsRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>PROVA VISUAL</span> <Heart className="w-3.5 h-3.5 text-rose-400" />
            </button>
            <button onClick={() => scrollToSection(resultsRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>HARMONIZAÇÃO DE 💚</span> <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(trustRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>DIFERENCIAIS</span> <ShieldCheck className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>COMO FUNCIONA</span> <Clock className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(contactRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>ONDE NOS ENCONTRAR</span> <MapPin className="w-3.5 h-3.5 text-gold-light" />
            </button>

            {/* Repeated Ticker Set 2 for seamless wrap scrolling */}
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>SOBRE MIM</span> <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(resultsRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>PROVA VISUAL</span> <Heart className="w-3.5 h-3.5 text-rose-400" />
            </button>
            <button onClick={() => scrollToSection(resultsRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>HARMONIZAÇÃO DE 💚</span> <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(trustRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>DIFERENCIAIS</span> <ShieldCheck className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>COMO FUNCIONA</span> <Clock className="w-3.5 h-3.5 text-gold-light" />
            </button>
            <button onClick={() => scrollToSection(contactRef)} className="hover:text-white transition-colors flex items-center gap-2 focus:outline-none cursor-pointer">
              <span>ONDE NOS ENCONTRAR</span> <MapPin className="w-3.5 h-3.5 text-gold-light" />
            </button>
          </div>
          
        </div>
      </div>


      {/* ================= SITE HEADER / FLOATING HERO ACCENTS ================= */}
      <header className="py-4 px-6 md:px-12 bg-transparent border-b border-gold-light/10 max-w-7xl mx-auto flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white">
            Alexia <span className="text-gold italic font-serif">Lima</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setAnswers({});
              setQuizStep(0);
              setIsOverlayOpen(true);
            }} 
            className="px-3.5 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold font-semibold text-xs rounded-full border border-gold/30 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-gold" />
            <span>Refazer Avaliação</span>
          </button>
          <a 
            href="https://www.instagram.com/alexiaclinic/reels/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 text-white hover:text-gold hover:scale-105 transition-all"
            title="Siga no Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </header>


      {/* ================= 1. HERO SECTION (PRIMEIRA DOBRA) ================= */}
      <section className="relative py-12 md:py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden">
        
        {/* Left Side: Editorial Typography & Transforming Headline */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full border border-gold/25 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Estética Facial & Otomodelação Avançada</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-tight leading-tight">
            Eu sou <span className="text-gold italic font-serif">Alexia Lima</span>. <br />
            <span className="text-zinc-300 font-sans font-semibold text-2xl md:text-4xl block mt-2">
              Meu propósito é revelar a sua beleza com naturalidade e segurança absoluta.
            </span>
          </h1>

          <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            Sem cirurgia agressiva, sem transformações artificiais. Desenvolvi uma metodologia exclusiva focada em harmonizar seus traços únicos, respeitando quem você é. Recupere o orgulho de se olhar no espelho.
          </p>

          {/* Core Call-to-action details */}
          <div className="space-y-3 pt-2">
            <a 
              href={getWhatsAppLink("direct")}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex py-4 px-8 bg-gold hover:bg-gold-light text-black font-extrabold text-base md:text-lg rounded-2xl shadow-xl shadow-gold/10 hover:shadow-gold/20 transition-all items-center gap-3 cursor-pointer btn-premium-pulse"
            >
              <MessageCircle className="w-5 h-5 text-black" />
              <span>Agendar consulta gratuita no WhatsApp</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </a>
            
            <p className="text-xs text-zinc-400 flex items-center gap-1.5 pl-2 font-medium">
              <Check className="w-4 h-4 text-gold" />
              <span>Sua primeira conversa é 100% sem compromisso</span>
            </p>
          </div>
        </div>

        {/* Right Side: Stunning portrait of Alexia Lima in Gold Arched Frame */}
        <div className="lg:col-span-5 relative flex justify-center items-center z-10">
          <div className="relative w-full max-w-[340px] md:max-w-[400px]">
            
            {/* Ambient luxury shadows & rings */}
            <div className="absolute inset-0 bg-gradient-to-t from-gold-dark/10 to-transparent rounded-t-[140px] rounded-b-3xl -m-4 blur-xl pointer-events-none" />
            <div className="absolute -inset-1 border border-gold-dark/20 rounded-t-[150px] rounded-b-[40px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
            
            {/* The Arched Container */}
            <div className="relative bg-[#0a0a0a] p-2 rounded-t-[140px] rounded-b-[30px] border-2 border-gold shadow-2xl overflow-hidden aspect-[4/5]">
              <img 
                src="https://i.imgur.com/Rzdm02l.png" 
                alt="Alexia Lima - Especialista" 
                className="w-full h-full object-cover object-top rounded-t-[130px] rounded-b-[20px] filter contrast-102 hover:scale-103 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Badge overlay indicating locality & specialization */}
            <div className="absolute -bottom-4 -left-4 bg-[#0c0c0c] text-white p-3.5 rounded-2xl shadow-xl border border-gold/30 flex items-center gap-2">
              <div className="p-1.5 bg-gold/20 rounded-full text-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gold uppercase tracking-wider font-bold">Método Próprio</p>
                <p className="text-xs font-semibold text-white">Resultados Reais</p>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* ================= VIDEO PRESENTATION OF PROCEDURE (HIGHLY PROMINENT) ================= */}
      <section className="bg-primary py-16 px-6 md:px-12 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Video Container left side */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center">
            <h3 className="text-gold-light font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
              Demonstração de Procedimento
            </h3>
            
            <div className="relative aspect-[9/16] max-w-[350px] mx-auto w-full rounded-3xl overflow-hidden border-2 border-gold shadow-2xl bg-black">
              <video
                ref={videoRef}
                src="https://i.imgur.com/bTYKggt.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                referrerPolicy="no-referrer"
              />
              
              {/* Luxury Floating Sound Control Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-white p-3 rounded-full border border-gold/40 shadow-xl flex items-center gap-2 transition-all cursor-pointer z-10 hover:scale-105 active:scale-95"
                title={isMuted ? "Ativar Som" : "Mudar para Mudo"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-5 h-5 text-gold animate-pulse shrink-0" />
                    <span className="text-xs font-bold tracking-wider uppercase pr-1">Ativar Som</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold tracking-wider uppercase pr-1">Mudo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description copy right side */}
          <div className="lg:col-span-6 text-left space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              A harmonia perfeita nasce da <br />
              <span className="text-gold italic font-serif">atenção ao detalhe</span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-200 leading-relaxed font-light">
              Descubra como a beleza pode ser realçada com técnica, sensibilidade e propósito. Resultados naturais e transformadores. Aperte o play e sinta a diferença de ser cuidada por quem entende que sua beleza é única, e merece atenção especial.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-primary-light/40 px-4 py-2.5 rounded-xl border border-gold-light/10">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                <span className="text-xs font-semibold tracking-wide text-gray-100">Sem incisões cirúrgicas</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-light/40 px-4 py-2.5 rounded-xl border border-gold-light/10">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                <span className="text-xs font-semibold tracking-wide text-gray-100">Retorno imediato às atividades</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ================= 2. QUEM SOU EU SECTION (AUTORIDADE PESSOAL) ================= */}
      <section id="sobre-mim" ref={aboutRef} className="py-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-b border-gold-light/10">
        
        {/* Photo with double gold frame & authority badges */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
          <div className="relative w-full max-w-[340px] md:max-w-[380px]">
            <div className="absolute inset-0 border-2 border-gold rounded-3xl translate-x-3 translate-y-3 pointer-events-none" />
            <div className="relative bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-xl border border-gold/20 aspect-[3/4]">
              <img 
                src="https://i.imgur.com/hoHBi6m.png" 
                alt="Dra. Alexia Lima em Atendimento" 
                className="w-full h-full object-cover object-center filter contrast-101 hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Elegant card overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary via-primary/60 to-transparent p-5 text-white text-left">
                <p className="text-[10px] text-gold uppercase tracking-widest font-bold">Dra. Alexia Lima</p>
                <p className="text-xs text-zinc-300">“Dedicação plena à naturalidade e à autoconfiança de cada paciente.”</p>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative and personal bullets */}
        <div className="lg:col-span-7 order-1 lg:order-2 text-left space-y-6">
          <span className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-gold" />
            Minha Trajetória & Visão
          </span>
          
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold tracking-tight">
            Estética com alma: <br />
            <span className="text-gold italic font-serif">Quem cuida de você</span>
          </h2>

          <div className="space-y-4 text-sm md:text-base text-zinc-300 leading-relaxed">
            <p>
              Sou apaixonada por realçar a essência de cada pessoa. Minha especialidade em Otomodelação e Estética Facial avançada foi meticulosamente desenvolvida para fugir de qualquer tipo de resultado artificial. Não acredito em rostos padronizados ou procedimentos exagerados.
            </p>
            <p>
              Em meu consultório, cada paciente é tratado de forma exclusiva e individualizada. Dedico tempo para compreender seus anseios e planejar cada milímetro da intervenção com máxima precisão, garantindo um processo confortável, seguro e com um suporte pós-procedimento impecável.
            </p>
          </div>

          {/* Personal differentials bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm flex items-start gap-3">
              <span className="text-gold font-serif text-xl font-bold">✦</span>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Atendimento Exclusivo</h4>
                <p className="text-xs text-zinc-400">Atenção exclusiva e total do planejamento ao acompanhamento pós-procedimento.</p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm flex items-start gap-3">
              <span className="text-gold font-serif text-xl font-bold">✦</span>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Técnicas Minimamente Invasivas</h4>
                <p className="text-xs text-zinc-400">Resultados duradouros e surpreendentes com o máximo conforto durante a sessão.</p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm flex items-start gap-3">
              <span className="text-gold font-serif text-xl font-bold">✦</span>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Otomodelação de Alta Precisão</h4>
                <p className="text-xs text-zinc-400">Modelagem estética das orelhas sem necessidade de internação ou cirurgias agressivas.</p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm flex items-start gap-3">
              <span className="text-gold font-serif text-xl font-bold">✦</span>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Comprometimento Real</h4>
                <p className="text-xs text-zinc-400">O seu bem-estar, sua autoestima e segurança são as minhas prioridades inegociáveis.</p>
              </div>
            </div>

          </div>
        </div>

      </section>


      {/* ================= 3. RESULTADOS REAIS & HARMONIZAÇÃO DE CORAÇÃO (PROVA VISUAL FORTE) ================= */}
      <section id="prova-visual" ref={resultsRef} className="py-20 px-6 md:px-12 bg-[#070707] border-b border-gold-light/10">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              Galeria de Transformações
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold tracking-tight">
              Galeria de Resultados Reais 
            </h2>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Explore o antes e depois de pacientes reais da Dra. Alexia Lima. Clique na foto para ampliar a imagem e observar os detalhes naturais de cada procedimento.
            </p>
          </div>

          {/* Premium Category Selector Tabs */}
          <div className="flex justify-center p-1 bg-zinc-950 rounded-full border border-zinc-800 max-w-md mx-auto shadow-sm">
            <button
              onClick={() => setActiveTab("otomodelacao")}
              className={`flex-1 py-3 px-5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "otomodelacao" 
                  ? "bg-gold text-black shadow-md" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Otomodelação & Estética
            </button>
            <button
              onClick={() => setActiveTab("harmonizacao")}
              className={`flex-1 py-3 px-5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "harmonizacao" 
                  ? "bg-gold text-black shadow-md" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Harmonização de ❤️</span>
            </button>
          </div>

          {/* Auto-sliding Horizontal Gallery Row */}
          <div className="relative w-full overflow-hidden py-6">
            {/* Left & Right Elegant Ambient Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#070707] via-[#070707]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#070707] via-[#070707]/80 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee flex gap-5 hover:[animation-play-state:paused] py-2">
              {/* First Set */}
              <div className="flex gap-5 shrink-0">
                {(() => {
                  const baseFiltered = galleryItems.filter(item => item.category === activeTab);
                  const activeItems = baseFiltered.length < 8 ? [...baseFiltered, ...baseFiltered] : baseFiltered;
                  return activeItems.map((item, idx) => (
                    <div 
                      key={`set1-${item.id}-${idx}`} 
                      onClick={() => setLightboxImage(item.url)}
                      className="w-64 h-64 sm:w-80 sm:h-80 shrink-0 relative rounded-2xl overflow-hidden shadow-lg border border-zinc-950 bg-black cursor-zoom-in transition-all duration-300 hover:shadow-2xl hover:scale-102"
                    >
                      <img 
                        src={item.url} 
                        alt={item.title || "Resultado Estético"} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-primary-dark/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <div className="bg-black/90 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-1 border border-gold/30">
                          <Sparkles className="w-3.5 h-3.5 text-gold" />
                          <span>Ampliar Resultado</span>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Second identical set for seamless loop */}
              <div className="flex gap-5 shrink-0">
                {(() => {
                  const baseFiltered = galleryItems.filter(item => item.category === activeTab);
                  const activeItems = baseFiltered.length < 8 ? [...baseFiltered, ...baseFiltered] : baseFiltered;
                  return activeItems.map((item, idx) => (
                    <div 
                      key={`set2-${item.id}-${idx}`} 
                      onClick={() => setLightboxImage(item.url)}
                      className="w-64 h-64 sm:w-80 sm:h-80 shrink-0 relative rounded-2xl overflow-hidden shadow-lg border border-zinc-950 bg-black cursor-zoom-in transition-all duration-300 hover:shadow-2xl hover:scale-102"
                    >
                      <img 
                        src={item.url} 
                        alt={item.title || "Resultado Estético"} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-primary-dark/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <div className="bg-black/90 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-1 border border-gold/30">
                          <Sparkles className="w-3.5 h-3.5 text-gold" />
                          <span>Ampliar Resultado</span>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Discreet Legal Notice */}
          <p className="text-xs text-zinc-500 italic max-w-xl mx-auto pt-4 leading-relaxed">
            *Nota: Os resultados apresentados são individuais e podem variar de pessoa para pessoa. Cada tratamento requer uma avaliação detalhada em consultório para definição do plano ideal.
          </p>

        </div>
      </section>


      {/* ================= 4. POR QUE CONFIAR EM MIM SECTION ================= */}
      <section id="diferenciais" ref={trustRef} className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-12">
        
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold" />
            Padrão de Atendimento Premium
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold tracking-tight">
            Por que confiar em meu trabalho?
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            O seu rosto merece responsabilidade, preparo e segurança. Entenda os pilares que guiam cada procedimento que realizo.
          </p>
        </div>

        {/* Beautiful Bento-like cards of Differentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          
          <div className="p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Avaliação Sincera & Honestidade</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Só recomendo e executo procedimentos que realmente tragam simetria, harmonia e que valorizem a sua estrutura facial de verdade. Se não houver necessidade real, serei a primeira a te orientar.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Atendimento Comigo, do Início ao Fim</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sem substitutos. Toda a sua jornada — desde o diagnóstico minucioso, marcação, sessão e o acompanhamento pós-procedimento — é conduzida pessoalmente por mim.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Clareza e Segurança Absoluta</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Você saberá exatamente o que esperar de cada passo. Utilizo apenas materiais da mais alta qualidade biológica e segurança aprovada, seguindo os maiores rigoros de assepsia.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Foco Obsessivo em Naturalidade</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Meu objetivo não é transformar você em outra pessoa, mas sim polir os seus melhores traços. Um excelente procedimento é aquele que ninguém sabe que foi feito, apenas que você está radiante.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Suporte Exclusivo Pós-Sessão</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Minha responsabilidade com você vai muito além do consultório. Tenha acesso a um canal direto e prioritário de mensagens para esclarecer qualquer dúvida ou receber orientações em tempo real.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Absoluta Confidencialidade</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Seu atendimento e suas informações são tratados com o mais alto sigilo de privacidade. O consultório é um ambiente acolhedor, confortável e totalmente privativo.
            </p>
          </div>

        </div>

      </section>


      {/* ================= 5. CTA INTERMEDIÁRIO ================= */}
      <section className="bg-[#0a0a0a] text-white py-16 px-6 md:px-12 text-center relative overflow-hidden">
        {/* Subtle geometric circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Deseja alinhar suas expectativas diretamente com quem entende?
          </h2>
          <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Seja para tirar dúvidas sobre valores, tempo de recuperação da otomodelação ou indicações estéticas faciais, sinta-se à vontade para nos enviar uma mensagem.
          </p>
          <div className="pt-4">
            <a 
              href={getWhatsAppLink("direct")}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex py-4 px-8 bg-gold hover:bg-gold-light text-black font-extrabold text-base md:text-lg rounded-2xl shadow-xl shadow-gold/10 transition-all items-center gap-3 cursor-pointer btn-premium-pulse"
            >
              <MessageCircle className="w-5 h-5 text-black" />
              <span>Converse Comigo no WhatsApp</span>
            </a>
            <p className="text-xs text-gold/60 mt-3 font-medium">Conversa inicial informativa e sem compromisso</p>
          </div>
        </div>
      </section>


      {/* ================= 6. COMO FUNCIONA A PRIMEIRA CONSULTA ================= */}
      <section id="como-funciona" ref={howItWorksRef} className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-12 border-b border-gold-light/10">
        
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-gold font-bold text-xs uppercase tracking-widest">Simplificando o Processo</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold tracking-tight">
            Como funciona a sua jornada?
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            De forma simples, transparente e descomplicada. Sem jargões clínicos ou burocracia.
          </p>
        </div>

        {/* 3 Step Process Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          <div className="relative p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm text-left space-y-4">
            <span className="absolute top-4 right-6 font-serif text-4xl font-extrabold text-gold/20">01</span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Contato & Triagem Inicial</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ao clicar nos botões do WhatsApp, você será direcionada para conversar comigo ou com minha equipe de recepção. Coletamos suas principais queixas de forma amigável.
            </p>
          </div>

          <div className="relative p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm text-left space-y-4">
            <span className="absolute top-4 right-6 font-serif text-4xl font-extrabold text-gold/20">02</span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Consulta de Avaliação Detalhada</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              No dia agendado, faremos uma análise clínica e fotográfica minuciosa de sua estrutura e anatomia facial, entendendo as proporções e alinhando suas reais expectativas.
            </p>
          </div>

          <div className="relative p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-900 shadow-sm text-left space-y-4">
            <span className="absolute top-4 right-6 font-serif text-4xl font-extrabold text-gold/20">03</span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">Planejamento & Sessão</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Com o plano aprovado, realizamos o procedimento estético ou a otomodelação em ambiente acolhedor, com acompanhamento e direcionamento de cuidados pós-sessão de ponta.
            </p>
          </div>

        </div>

      </section>


      {/* ================= 7. MAIS PROVAS SECTION (EXPERT + BASTIDORES) ================= */}
      <section className="py-20 bg-[#070707] overflow-hidden border-b border-gold-light/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-4 text-left space-y-6">
            <span className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold" />
              Sintonia e Confiança
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold tracking-tight">
              Bastidores de um Atendimento Único
            </h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              A verdadeira sofisticação está no cuidado atento e nos bastidores de um serviço feito sob medida para você. Veja um pouco mais sobre nosso padrão de excellence e acolhimento.
            </p>
            <div className="pt-2">
              <a 
                href="https://www.instagram.com/alexiaclinic/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold font-bold hover:text-white transition-all underline"
              >
                <span>Acompanhar bastidores no Instagram</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 overflow-hidden relative py-4">
            {/* Left & Right Elegant Ambient Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#070707] via-[#070707]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#070707] via-[#070707]/80 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee flex gap-5 hover:[animation-play-state:paused] py-2">
              {/* First Set */}
              <div className="flex gap-5 shrink-0">
                {backstageItems.map((item, idx) => (
                  <div 
                    key={`back1-${item.id}-${idx}`} 
                    className="w-72 h-56 sm:w-96 sm:h-72 shrink-0 relative rounded-3xl overflow-hidden shadow-lg border border-zinc-950 bg-black group"
                  >
                    <img 
                      src={item.url} 
                      alt={item.desc} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent p-5 flex items-end">
                      <p className="text-white text-xs font-semibold tracking-wide">✦ {item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second identical set for seamless loop */}
              <div className="flex gap-5 shrink-0">
                {backstageItems.map((item, idx) => (
                  <div 
                    key={`back2-${item.id}-${idx}`} 
                    className="w-72 h-56 sm:w-96 sm:h-72 shrink-0 relative rounded-3xl overflow-hidden shadow-lg border border-zinc-950 bg-black group"
                  >
                    <img 
                      src={item.url} 
                      alt={item.desc} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent p-5 flex items-end">
                      <p className="text-white text-xs font-semibold tracking-wide">✦ {item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ================= EXTRA: MAP & CLINIC LOCATION ================= */}
      <section id="onde-nos-encontrar" ref={contactRef} className="py-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Details Left */}
        <div className="lg:col-span-5 text-left space-y-6">
          <span className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <MapPin className="w-4.5 h-4.5 text-gold" />
            Localização Privilegiada
          </span>
          
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold tracking-tight">
            Onde estamos localizados?
          </h2>
          
          <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
            Oferecemos um espaço aconchegante, moderno, extremamente higienizado e discreto no coração de <strong>São Luís - MA</strong>. Nossa clínica possui estacionamento e segurança privada para garantir seu total bem-estar.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gold/10 rounded-xl text-gold shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">São Luís - Maranhão</h4>
                <p className="text-xs text-zinc-400">Agendamentos privativos de Otomodelação e Estética Avançada.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gold/10 rounded-xl text-gold shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Atendimento com Hora Marcada</h4>
                <p className="text-xs text-zinc-400">Segunda a Sexta-feira: 09h às 19h. Sábados: 09h às 13h.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a 
              href={getWhatsAppLink("direct")}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex py-3 px-6 bg-gold hover:bg-gold-light text-black font-extrabold text-sm rounded-xl items-center gap-2 cursor-pointer shadow-md shadow-gold/5"
            >
              <MessageCircle className="w-4 h-4 text-black" />
              <span>Como Chegar / Reservar Horário</span>
            </a>
          </div>
        </div>

        {/* Map Container Right */}
        <div className="lg:col-span-7 w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden border-2 border-gold/30 shadow-2xl relative bg-black">
          
          {/* Beautiful styled OpenStreetMap Map Embed pointing to beautiful business area in São Luís, MA */}
          <iframe 
            title="Mapa São Luís"
            src="https://maps.google.com/maps?q=S%C3%A3o%20Lu%C3%ADs%20-%20MA&t=&z=14&ie=UTF8&iwloc=&output=embed" 
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
            loading="lazy"
            allowFullScreen
          />
          
        </div>

      </section>


      {/* ================= 8. CTA FINAL (DECISÃO) ================= */}
      <section className="py-24 px-6 md:px-12 bg-primary text-white text-center relative overflow-hidden">
        
        {/* Luxury golden backgrounds */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
 
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <div className="inline-block px-4 py-1.5 bg-gold/10 text-gold text-xs font-bold rounded-full border border-gold/30 uppercase tracking-widest">
            ✦ Dê o Primeiro Passo Hoje ✦
          </div>

          <h2 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-tight leading-tight max-w-3xl mx-auto">
            Sua beleza merece ser realçada pela mão de quem <span className="text-gold italic font-serif">entende de naturalidade</span>.
          </h2>

          <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-xl mx-auto">
            O primeiro atendimento é focado em tirar todas as suas dúvidas sobre custos, processos e expectativas de forma leve, humana e transparente.
          </p>

          <div className="pt-4 space-y-4">
            <a 
              href={getWhatsAppLink("direct")}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex py-4 px-10 bg-gold hover:bg-gold-light text-black font-extrabold text-base md:text-lg rounded-2xl shadow-2xl shadow-gold/10 transition-all items-center gap-3 cursor-pointer btn-premium-pulse"
            >
              <MessageCircle className="w-5.5 h-5.5 text-black" />
              <span>Agendar Minha Consulta de Avaliação Gratuita</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </a>
            
            <p className="text-xs text-gold/70 font-semibold tracking-wide uppercase">
              ✦ PRIMEIRA CONSULTA SEM COMPROMISSO ✦
            </p>
          </div>

        </div>
      </section>


      {/* ================= 9. RODAPÉ SIMPLES ================= */}
      <footer className="py-12 bg-primary-dark text-white border-t border-gold-light/10 text-center px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Beautiful handwritten cursive visual signature representation */}
          <div className="space-y-1">
            <p className="font-serif text-3xl md:text-4xl text-gold italic tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Alexia Lima
            </p>
            <p className="text-[10px] md:text-xs text-zinc-400 font-semibold tracking-widest uppercase">
              Estética & Otomodelação Avançada • São Luís / MA
            </p>
          </div>

          <div className="flex justify-center gap-6 text-xs text-zinc-400">
            <a href="https://www.instagram.com/alexiaclinic/reels/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-gold" />
              <span>@alexiaclinic</span>
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>São Luís - MA</span>
            </span>
          </div>

          <div className="pt-6 border-t border-zinc-800 max-w-xs mx-auto text-[10px] text-zinc-500 space-y-1.5">
            <p>© {new Date().getFullYear()} Alexia Lima. Todos os direitos reservados.</p>
            <p className="font-light">Desenvolvido com sofisticação e foco absoluto em conversão premium.</p>
          </div>

        </div>
      </footer>


      {/* ================= LIGHTBOX MODAL FOR BEFORE-AFTER GALLERY ================= */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white hover:text-gold bg-zinc-900/40 p-3 rounded-full hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-gold-dark/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={lightboxImage} 
                alt="Resultado ampliado" 
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-gold text-[11px] md:text-xs px-4 py-2 rounded-full font-bold tracking-wider shadow-lg">
                Resultado de Otomodelação / Estética Avançada
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
