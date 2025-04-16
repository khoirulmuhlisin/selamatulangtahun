
import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, Volume1, VolumeX, Pause, Play, Music2, Disc, FastForward, Rewind, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface MusicPlayerProps {
  audioSrc?: string;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  // Default to first song in library
  audioSrc = "", 
  autoPlay = true 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>(0);

  // Updated song library with proper matching of titles and audio files
  const songLibrary = [
    {
      title: "A Thousand Years (Instrumental)",
      src: "/thousand.mp3", 
      artist: "Christina Perri"
    },
    {
      title: "Perfect (Instrumental)",
      src: "perfect.mp3", 
      artist: "Ed Sheeran"
    },
    {
      title: "You Are the Reason (Instrumental)",
      src: "reason.mp3", 
      artist: "Column Scott"
    },
  ];

  // Function to update progress bar
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  // Initialize audio when component mounts or song changes
  useEffect(() => {
    const currentSong = songLibrary[currentSongIndex];
    setLoading(true);
    
    if (audioRef.current) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
      audioRef.current = null;
    }
    
    // Create new audio element with current song
    const newAudio = new Audio(currentSong.src);
    newAudio.volume = isMuted ? 0 : volume;
    newAudio.loop = false; // Set to false to enable auto-next
    audioRef.current = newAudio;
    
    // Event listeners for audio
    newAudio.addEventListener('loadedmetadata', () => {
      setDuration(newAudio.duration);
      setLoading(false);
    });
    
    newAudio.addEventListener('ended', () => {
      changeSong('next');
    });
    
    newAudio.addEventListener('error', (e) => {
      console.error("Audio error:", e);
      toast.error("Failed to load audio", {
        description: "Trying next song...",
        position: "bottom-center",
      });
      // Try next song if this one fails
      setTimeout(() => changeSong('next'), 1000);
    });
    
    // Handle autoplay
    if (autoPlay) {
      const playPromise = newAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            animationRef.current = requestAnimationFrame(updateProgress);
            toast(`Now playing: ${currentSong.title}`, {
              description: `By: ${currentSong.artist}`,
              position: "bottom-left",
              duration: 3000,
            });
          })
          .catch(error => {
            console.log("Autoplay prevented:", error);
            setIsPlaying(false);
            setLoading(false);
            // Show a toast to notify user to interact with page for music
            toast("Click to enable music", {
              description: "Interact with the page to enable autoplay",
              position: "bottom-center",
              duration: 5000,
              action: {
                label: "Play Music",
                onClick: () => togglePlay()
              }
            });
          });
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('error', () => {});
        cancelAnimationFrame(animationRef.current);
        audioRef.current = null;
      }
    };
  }, [currentSongIndex, autoPlay]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || loading) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          animationRef.current = requestAnimationFrame(updateProgress);
        }).catch(error => {
          console.error("Play error:", error);
          toast.error("Couldn't play audio", {
            description: "Try clicking the player again",
            position: "bottom-center",
          });
        });
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const changeSong = (direction: 'next' | 'prev') => {
    if (loading) return;
    
    if (direction === 'next') {
      setCurrentSongIndex((prev) => (prev + 1) % songLibrary.length);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songLibrary.length) % songLibrary.length);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast("Lagu ditambahkan ke favorit! ❤️", {
        position: "bottom-center",
        duration: 2000
      });
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  const currentSong = songLibrary[currentSongIndex];

  return (
    <motion.div 
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.button
        className={`flex items-center justify-center w-12 h-12 rounded-full ${loading ? 'bg-gray-200' : 'bg-white/90'} backdrop-blur-md shadow-lg border border-birthday-pink-light/50 text-birthday-pink magical-border`}
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 132, 183, 0.7)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowControls(!showControls)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {loading ? (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Music size={22} />
          </motion.div>
        ) : isPlaying ? (
          <Disc size={22} className="animate-spin" style={{ animationDuration: '3s' }} />
        ) : (
          <Music2 size={22} />
        )}
      </motion.button>

      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="absolute bottom-14 right-0 p-4 rounded-lg bg-white/95 backdrop-blur-md shadow-xl border border-birthday-pink-light/30 w-80"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-3">
              <motion.div 
                className="text-sm font-medium text-gray-700 mb-1 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Disc size={16} className={`mr-1 ${isPlaying && !loading ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                <span className="truncate">{currentSong.title}</span>
              </motion.div>
              <motion.div 
                className="text-xs text-gray-500 text-center mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentSong.artist}
              </motion.div>
              <div className="text-xs text-birthday-pink/70 text-center mb-2 italic">
                ♫ Instrumen Romantis ♫
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <Slider
                disabled={loading}
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleProgressChange}
                className={`${loading ? 'opacity-50' : ''}`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <motion.button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-birthday-pink/10 text-birthday-pink"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 132, 183, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeSong('prev')}
                disabled={loading}
              >
                <Rewind size={16} />
              </motion.button>

              <motion.button
                className={`flex items-center justify-center w-12 h-12 rounded-full ${loading ? 'bg-gray-300' : 'bg-birthday-pink'} text-white`}
                whileHover={!loading ? { scale: 1.1, backgroundColor: "rgba(255, 132, 183, 0.9)" } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                onClick={togglePlay}
                disabled={loading}
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="flex h-3 w-3">⏳</span>
                  </motion.div>
                ) : isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play size={22} className="ml-1" />
                )}
              </motion.button>

              <motion.button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-birthday-pink/10 text-birthday-pink"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 132, 183, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeSong('next')}
                disabled={loading}
              >
                <FastForward size={16} />
              </motion.button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-birthday-pink transition-colors"
                disabled={loading}
              >
                {getVolumeIcon()}
              </button>
              <Slider
                disabled={loading}
                value={[volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className={`${loading ? 'opacity-50' : ''}`}
              />
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <motion.button
                className={`flex items-center justify-center w-8 h-8 rounded-full ${isLiked ? 'bg-birthday-rose/20 text-birthday-rose' : 'bg-gray-100 text-gray-400'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                disabled={loading}
              >
                <Heart size={16} fill={isLiked ? "#FF6B95" : "none"} />
              </motion.button>
              
              <motion.div
                className="text-xs text-gray-500"
              >
                Song {currentSongIndex + 1} of {songLibrary.length}
              </motion.div>
            </div>
            
            <motion.div
              className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-birthday-pink to-birthday-purple"
                animate={{
                  width: ["0%", "100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MusicPlayer;
