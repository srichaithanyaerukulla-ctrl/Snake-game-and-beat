import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { Gamepad2 } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/50">
            <Gamepad2 className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 neon-text-glow">
              NEON ARCADE
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-widest">SNAKE X BEATS</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
            <p className="text-xs text-slate-500 font-mono">POWERED BY GEMINI 2.5</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-6 lg:p-12 z-10">
        
        {/* Game Section (Center on Desktop) */}
        <section className="order-1 lg:order-2 flex-1 flex justify-center w-full max-w-xl">
           <div className="relative">
                {/* Decorative border elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-fuchsia-500" />
                
                <SnakeGame />
           </div>
        </section>

        {/* Music Player Section (Side on Desktop) */}
        <section className="order-2 lg:order-1 flex-1 flex justify-center lg:justify-end w-full max-w-md">
           <MusicPlayer />
        </section>

        {/* Empty third column for balance or future features */}
        <section className="hidden lg:block lg:order-3 flex-1">
             <div className="max-w-xs p-6 border border-white/5 rounded-xl bg-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-fuchsia-400 mb-2 uppercase tracking-widest">Controls</h3>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                    <li className="flex justify-between">
                        <span>MOVE</span>
                        <span className="text-cyan-400">[ARROW KEYS]</span>
                    </li>
                    <li className="flex justify-between">
                        <span>PAUSE GAME</span>
                        <span className="text-cyan-400">[SPACE]</span>
                    </li>
                    <li className="flex justify-between">
                        <span>SKIP TRACK</span>
                        <span className="text-cyan-400">[NEXT BTN]</span>
                    </li>
                    <li className="mt-4 pt-4 border-t border-white/10 text-slate-500 italic">
                        "Generate AI Beat" creates a unique rhythm using Gemini 2.5 Flash TTS.
                    </li>
                </ul>
             </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-600 font-mono z-10">
        &copy; 2025 NEON ARCADE. GEMINI API DEMO.
      </footer>
    </div>
  );
};

export default App;