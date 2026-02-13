
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import FloatingHearts from './components/FloatingHearts';
import RomanticMessage from './components/RomanticMessage';
import StoryScreen from './components/StoryScreen';
import SuccessScreen from './components/SuccessScreen';

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'story' | 'question' | 'success'>('intro');
  // Iniciamos el botón No un poco desplazado hacia abajo para que sea visible
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 80 });
  const [yesScale, setYesScale] = useState(1);
  const [noAttempts, setNoAttempts] = useState(0);
  const [isNoHidden, setIsNoHidden] = useState(false);

  const handleYes = () => {
    const scalar = 2;
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ff69b4', '#ffffff', '#ffd700'],
      shapes: ['circle'],
      scalar
    });
    setStep('success');
  };

  const moveNoButton = () => {
    if (isNoHidden) return;

    const newAttempts = noAttempts + 1;
    setNoAttempts(newAttempts);

    // Después de 6 intentos, se esconde detrás del "SÍ"
    if (newAttempts >= 6) {
      setIsNoHidden(true);
      setNoButtonPos({ x: 0, y: 0 }); 
      return;
    }

    // Movimiento aleatorio frenético por la pantalla
    const randomX = (Math.random() - 0.5) * (window.innerWidth * 0.7);
    const randomY = (Math.random() - 0.5) * (window.innerHeight * 0.5);
    setNoButtonPos({ x: randomX, y: randomY });
    
    // El botón SÍ crece para facilitar el click
    setYesScale(prev => Math.min(prev + 0.3, 4));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fffafa] flex items-center justify-center p-4 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-rose-100/40 via-transparent to-transparent pointer-events-none" />
      
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)", transition: { duration: 0.6 } }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 w-full max-w-2xl max-h-[90vh] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 md:p-14 border border-white/50 flex flex-col overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center mb-6 shrink-0">
               <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    filter: ["drop-shadow(0 0 0px #f43f5e)", "drop-shadow(0 0 15px #f43f5e)", "drop-shadow(0 0 0px #f43f5e)"]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Heart className="w-16 h-16 text-rose-500 fill-rose-500" />
                </motion.div>
              <Sparkles className="text-rose-300 w-8 h-8 mt-2 animate-pulse" />
            </div>
            
            <div className="overflow-y-auto custom-scrollbar pr-1">
              <RomanticMessage onComplete={() => setStep('story')} />
            </div>
          </motion.div>
        )}

        {step === 'story' && (
          <StoryScreen onComplete={() => setStep('question')} />
        )}

        {step === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center bg-white/70 backdrop-blur-lg p-8 md:p-16 rounded-[3rem] shadow-2xl border border-white w-full max-w-lg flex flex-col items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block mb-8"
            >
              <Heart className="w-20 h-20 text-rose-500 fill-rose-500" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-rose-900 mb-12 font-bold leading-tight">
              ¿Quieres ser mi <br/>
              <span className="font-romantic text-6xl text-rose-600 block mt-2">San Valentín?</span>
            </h1>

            <div className="flex flex-col items-center justify-center min-h-[300px] w-full relative">
              {/* Botón NO que huye */}
              <motion.button
                animate={{ 
                  x: noButtonPos.x, 
                  y: noButtonPos.y,
                  opacity: isNoHidden ? 0 : 1,
                  scale: isNoHidden ? 0 : 1,
                  pointerEvents: isNoHidden ? 'none' : 'auto'
                }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute bg-white text-rose-300 px-8 py-3 rounded-full font-medium text-lg border border-rose-100 shadow-md z-10"
              >
                No... 🥺
              </motion.button>

              {/* Botón SÍ (El único destino posible) */}
              <motion.button
                style={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.05 }}
                whileTap={{ scale: yesScale * 0.95 }}
                onClick={handleYes}
                className="bg-rose-600 text-white px-12 py-5 rounded-full font-bold text-2xl shadow-xl shadow-rose-300 transition-all z-20 relative"
              >
                ¡SÍ! ❤️
              </motion.button>

              <AnimatePresence>
                {noAttempts > 0 && !isNoHidden && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-16 text-rose-400 italic font-medium absolute bottom-0"
                  >
                    {noAttempts < 3 ? "¡Casi lo logras! 😜" : noAttempts < 5 ? "¡No te escapas! ❤️" : "¡Ya casi es mío! 😉"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 'success' && <SuccessScreen />}
      </AnimatePresence>
    </div>
  );
};

export default App;
