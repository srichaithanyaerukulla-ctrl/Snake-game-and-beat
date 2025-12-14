import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Wand2, Loader2 } from 'lucide-react';
import { Track } from '../types';
import Visualizer from './Visualizer';
import { generateAiTrack } from '../services/geminiService';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'AI Synthwave 01',
    // Using a reliable royalty free placeholder
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3', 
    duration: '2:45'
  },
  {
    id: '2',
    title: 'Cyber Chase',
    artist: 'AI Synthwave 02',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    duration: '3:10'
  },
  {
    id: '3',
    title: 'Digital Rain',
    artist: 'AI Synthwave 03',
    url: 'https://cdn.pixabay.com/audio/2023/10/24/audio_34d1b8c2c1.mp3',
    duration: '1:55'
  }
];

const MusicPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>(DUMMY_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]); // Re-run if track changes

  // Handle source changes
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback error after load:", e));
        }
    }
  }, [currentTrack]);


  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleGenerateTrack = async () => {
    setIsGenerating(true);
    try {
        // We ask Gemini to "beatbox" or provide a rhythmic audio sample.
        const blob = await generateAiTrack("Beatbox a fast tempo futuristic cyberpunk rhythm loop.");
        if (blob) {
            const newTrack: Track = {
                id: `ai-${Date.now()}`,
                title: `GenAI Beat #${tracks.length - 2}`,
                artist: 'Gemini 2.5 Flash',
                blob: blob,
                duration: '0:20' // Approx
            };
            setTracks(prev => [...prev, newTrack]);
            // Auto play the new track
            setCurrentTrackIndex(tracks.length);
            setIsPlaying(true);
        }
    } catch (err) {
        alert("Failed to generate track. Check API Key.");
    } finally {
        setIsGenerating(false);
    }
  };

  const getAudioSrc = (track: Track) => {
      if (track.url) return track.url;
      if (track.blob) return URL.createObjectURL(track.blob);
      return '';
  };

  return (
    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
      
      {/* Visualizer Area */}
      <div className="mb-6 bg-slate-950/50 rounded-lg p-4 h-32 flex items-center justify-center border border-slate-800 relative overflow-hidden">
        <Visualizer isPlaying={isPlaying} />
        <div className="absolute top-2 left-2 text-xs text-cyan-400 font-mono flex items-center gap-2">
            <Music size={14} />
            {currentTrack.artist}
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white tracking-wider truncate neon-text-glow">
          {currentTrack.title}
        </h3>
        <p className="text-sm text-cyan-400/70 mt-1 font-mono">
            {currentTrackIndex + 1} / {tracks.length}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button 
            onClick={prevTrack}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
            onClick={togglePlay}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-4 rounded-full shadow-[0_0_15px_#06b6d4] transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
            onClick={nextTrack}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* AI Gen Button */}
      <button 
        onClick={handleGenerateTrack}
        disabled={isGenerating}
        className="w-full py-3 rounded-lg border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:border-fuchsia-500 transition-all flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
            <>
                <Loader2 size={16} className="animate-spin" />
                Synthesizing...
            </>
        ) : (
            <>
                <Wand2 size={16} />
                Generate AI Beat
            </>
        )}
      </button>

      <audio 
        ref={audioRef} 
        src={getAudioSrc(currentTrack)} 
        onEnded={handleEnded}
        className="hidden" 
      />
    </div>
  );
};

export default MusicPlayer;