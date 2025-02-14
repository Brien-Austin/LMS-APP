import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  RotateCcw,
  FastForward,
} from 'lucide-react';
import { Slider } from './slider';

const VideoPlayer = ({ 
  src, 
  className = '',
  onTimeUpdate,
  onComplete,
  setChapterCompleted
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (newTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoRef.current?.parentElement?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleFastForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      setCurrentTime(currentTime);
      onTimeUpdate?.(currentTime, duration);
      
      const completionThreshold = 0.8; // 80%
      const requiredWatchTime = duration * completionThreshold;
      
      if (currentTime >= requiredWatchTime && !hasReachedThreshold) {
        setHasReachedThreshold(true);
        setChapterCompleted(true);
      }
      
      if (currentTime >= duration) {
        onComplete?.();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onTimeUpdate, onComplete, hasReachedThreshold, setChapterCompleted]);

  return (
    <Card className={`w-full max-w-4xl mx-auto overflow-hidden ${className}`}>
      <div className="relative aspect-video bg-black group">
        <video 
          ref={videoRef}
          className="w-full h-full"
          src={src}
          onClick={togglePlay}
        />
        
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors group-hover:opacity-100"
            type="button"
          >
            <Play className="w-4 h-4 text-white" />
          </button>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity opacity-0 group-hover:opacity-100">
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration}
              step={1}
              className="w-full"
              onValueChange={(value) => handleSeek(value[0])}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={togglePlay}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  type="button"
                >
                  {isPlaying ? 
                    <Pause className="lg:w-5 lg:h-5 sm:w-3 sm:h-3 text-white" /> : 
                    <Play className="lg:w-5 lg:h-5 sm:w-3 sm:h-3 text-white" />
                  }
                </button>
                
                <button 
                  onClick={handleRewind}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  type="button"
                >
                  <RotateCcw className="lg:w-5 lg:h-5 sm:w-3 sm:h-3 text-white" />
                </button>
                
                <button 
                  onClick={handleFastForward}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  type="button"
                >
                  <FastForward className="lg:w-5 lg:h-5 sm:w-3 sm:h-3 text-white" />
                </button>
                
                <div 
                  className="flex items-center gap-2 relative"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button 
                    onClick={() => handleVolumeChange({ target: { value: isMuted ? '1' : '0' } })}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    type="button"
                  >
                    {isMuted ? 
                      <VolumeX className="lg:w-5 lg:h-5 sm:w-3 sm:h-3 text-white" /> : 
                      <Volume2 className="lg:w-5 lg:h-5 sm:w-3 sm:h-3 text-white" />
                    }
                  </button>
                  
                  <div className={`absolute bottom-full left-0 mb-2 bg-black/80 p-2 rounded-md transition-opacity ${showVolumeSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 appearance-none bg-white/20 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="text-white lg:text-sm sm:text-[10px] whitespace-nowrap">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleFullscreen}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  type="button"
                >
                  <Maximize className="lg:w-5 lg:h-5 sm:w-3 sm:h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
