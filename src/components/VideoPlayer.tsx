import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, ArrowLeft, SkipForward, HelpCircle, Check, Subtitles, Settings, Sparkles, CheckCircle2 } from 'lucide-react';
import { Movie } from '../types';

interface VideoPlayerProps {
  movie: Movie;
  showSuccessOverlay: boolean;
  onClose: () => void;
  onAddLog: (message: string, type: 'info' | 'success' | 'warn') => void;
}

export default function VideoPlayer({ movie, showSuccessOverlay, onClose, onAddLog }: VideoPlayerProps) {
  const [showSuccess, setShowSuccess] = useState(showSuccessOverlay);
  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // Fallback duration in seconds
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSkipIntro, setShowSkipIntro] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English [CC]');
  const [selectedQuality, setSelectedQuality] = useState('1080p Ultra');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Countdown timer for Payment Success
  useEffect(() => {
    if (showSuccess) {
      onAddLog('Unlocking premium content stream...', 'success');
      onAddLog(`Starting background stream cache: ${movie.title}`, 'info');
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowSuccess(false);
            // Trigger automatic playback of HTML5 video after countdown
            setIsPlaying(true);
            onAddLog(`Playback initialized automatically for: ${movie.title}`, 'success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showSuccess]);

  // Handle actual HTML5 video auto-play
  useEffect(() => {
    if (!showSuccess && videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Autoplay blocked or failed, waiting for user click.', err);
        });
    }
  }, [showSuccess]);

  // Track progress of HTML5 video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Remove "Skip Intro" after 15 seconds
      if (video.currentTime > 15) {
        setShowSkipIntro(false);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 120);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [showSuccess]);

  // Hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      onAddLog('Stream paused by user.', 'info');
    } else {
      video.play();
      setIsPlaying(true);
      onAddLog('Stream resumed by user.', 'info');
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const seekValue = parseFloat(e.target.value);
    video.currentTime = seekValue;
    setCurrentTime(seekValue);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const vol = parseFloat(e.target.value);
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const handleSkipIntro = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 25; // Skip first 25 seconds
    setCurrentTime(25);
    setShowSkipIntro(false);
    onAddLog('Skipped cinematic introduction sequence.', 'info');
  };

  const handleFullscreen = () => {
    const container = document.getElementById('full-player-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleManualSkipSuccess = () => {
    setShowSuccess(false);
    setIsPlaying(true);
    onAddLog(`Playback initialized automatically for: ${movie.title}`, 'success');
  };

  return (
    <div
      id="full-player-container"
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      <AnimatePresence>
        {/* STEP 6: Payment Success Countdown overlay */}
        {showSuccess && (
          <motion.div
            key="payment-success-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-center p-6 space-y-8"
          >
            {/* Success Glowing Badge */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="h-20 w-20 rounded-full bg-zinc-900 border border-white/20 text-white flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="h-12 w-12 animate-pulse text-emerald-400" />
              </motion.div>
              {/* Particle effects */}
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-3 max-w-md">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Payment Authorized!
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Your prestige subscription is now active on <strong className="text-white font-medium">{movie.title}</strong>.
              </p>
              <div className="text-[10px] tracking-widest uppercase text-zinc-300 bg-white/5 px-4 py-2 rounded-none inline-block border border-white/10 font-bold">
                ⚡ Zero-Friction Complete: <strong>3 clicks to play</strong>
              </div>
            </div>

            {/* Countdown animation */}
            <div className="flex flex-col items-center space-y-2">
              <div className="h-16 w-16 rounded-full border-4 border-zinc-800 border-t-white animate-spin flex items-center justify-center text-xl font-bold text-white relative">
                <span className="absolute transform rotate-[-360deg] animate-none font-sans font-bold">
                  {countdown}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold font-mono">Stream starting...</span>
            </div>

            {/* Manual bypass CTA */}
            <button
              onClick={handleManualSkipSuccess}
              className="px-8 py-3.5 bg-white hover:bg-neutral-200 text-black rounded-none text-xs font-bold tracking-widest uppercase shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Play Immediately</span>
              <Play className="h-3.5 w-3.5 fill-black text-black" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 7: HTML5 Video player screen */}
      {!showSuccess && (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={movie.videoUrl}
            onClick={togglePlay}
            preload="auto"
            className="w-full h-full object-contain"
          />

          {/* Subtitles Overlay simulator */}
          {isPlaying && currentTime > 3 && currentTime < 10 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-4 py-2.5 rounded-none max-w-md text-center text-xs uppercase tracking-widest text-white/90">
              [DENSE ELECTRONIC AMBIENT MUSIC PLAYING]
            </div>
          )}
          {isPlaying && currentTime >= 10 && currentTime < 18 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-4 py-2.5 rounded-none max-w-md text-center text-xs text-white tracking-wide font-light">
              <strong className="text-zinc-400 font-bold uppercase mr-1">{movie.cast[1] || 'Evelyn Cole'}:</strong> "We need to get out of the sector. Now."
            </div>
          )}

          {/* Custom Interactive Player Controls overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70 flex flex-col justify-between p-6 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Bar Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 bg-white/5 border border-white/15 hover:bg-white/10 text-white rounded-none px-4 py-2 text-xs font-bold tracking-wider uppercase transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Browse</span>
              </button>

              <div className="text-center">
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">Now Playing • prestige</span>
                <h1 className="text-sm font-semibold tracking-wide text-white">{movie.title}</h1>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="text-[9px] bg-zinc-900 border border-white/20 font-bold text-white px-2.5 py-1 rounded-none uppercase tracking-widest">
                  {selectedQuality}
                </span>
                <span className="text-[10px] tracking-wider uppercase text-zinc-400 font-medium">Dolby Atmos</span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4">
              {/* Skip Intro Button */}
              {showSkipIntro && isPlaying && (
                <div className="flex justify-end pr-4">
                  <button
                    onClick={handleSkipIntro}
                    className="flex items-center space-x-2 bg-black/95 hover:bg-neutral-900 border border-white/20 px-5 py-3 rounded-none text-xs text-white font-bold tracking-widest uppercase shadow-xl transition active:scale-95 cursor-pointer"
                  >
                    <span>Skip Intro</span>
                    <SkipForward className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              {/* Progress Slider Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono font-medium tracking-wider">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="relative group flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/10 rounded-none appearance-none cursor-pointer accent-white focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-between pt-1">
                {/* Left controls */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="h-10 w-10 flex items-center justify-center bg-white rounded-full text-black hover:bg-gray-200 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-5 w-5 fill-black" /> : <Play className="h-5 w-5 fill-black pl-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                        setCurrentTime(videoRef.current.currentTime);
                        onAddLog('Sought back 10 seconds.', 'info');
                      }
                    }}
                    className="p-2 text-zinc-400 hover:text-white transition"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                    <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
                      {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-24 h-1 bg-white/10 appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-4">
                  {/* Subtitle simulation */}
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white transition py-1">
                      <Subtitles className="h-4 w-4" />
                      <span className="hidden sm:inline">{selectedLanguage}</span>
                    </button>
                    {/* Tiny popup */}
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-zinc-950 border border-zinc-850 rounded-none p-1.5 text-[10px] w-28 z-30">
                      {['English [CC]', 'Spanish', 'Off'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            onAddLog(`Subtitles changed to: ${lang}`, 'info');
                          }}
                          className="w-full text-left px-2 py-1 hover:bg-white/5 rounded-none text-zinc-400 hover:text-white flex items-center justify-between"
                        >
                          <span>{lang}</span>
                          {selectedLanguage === lang && <Check className="h-3 w-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality simulator */}
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white transition py-1">
                      <Settings className="h-4 w-4 animate-spin-hover" />
                      <span className="hidden sm:inline">{selectedQuality}</span>
                    </button>
                    {/* Tiny popup */}
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-zinc-950 border border-zinc-850 rounded-none p-1.5 text-[10px] w-28 z-30">
                      {['1080p Ultra', '720p', 'Auto'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuality(q);
                            onAddLog(`Video quality adjusted to: ${q}`, 'info');
                          }}
                          className="w-full text-left px-2 py-1 hover:bg-white/5 rounded-none text-zinc-400 hover:text-white flex items-center justify-between"
                        >
                          <span>{q}</span>
                          {selectedQuality === q && <Check className="h-3 w-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleFullscreen} className="p-2 text-zinc-400 hover:text-white transition" title="Fullscreen">
                    <Maximize2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
