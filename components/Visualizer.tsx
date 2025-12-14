import React from 'react';

const Visualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="flex items-end justify-center space-x-1 h-16 w-full opacity-80">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-cyan-400 rounded-t-sm transition-all duration-300 ease-in-out ${
            isPlaying ? 'animate-pulse' : 'h-1'
          }`}
          style={{
            height: isPlaying ? `${Math.random() * 100}%` : '5%',
            animationDuration: `${0.2 + Math.random() * 0.5}s`,
            boxShadow: '0 0 10px #06b6d4'
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;