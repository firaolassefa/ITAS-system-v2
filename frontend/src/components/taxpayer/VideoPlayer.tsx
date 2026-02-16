import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Speed,
} from '@mui/icons-material';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (_: Event, value: number | number[]) => {
    const newTime = Array.isArray(value) ? value[0] : value;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSpeedChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Box sx={{ position: 'relative', mb: 2 }}>
        <video
          ref={videoRef}
          src={src}
          style={{ width: '100%', borderRadius: '8px' }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handlePlayPause}>
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>

        <Typography variant="body2">
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>

        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          sx={{ flexGrow: 1 }}
          size="small"
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => setMuted(!muted)} size="small">
            {muted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.1}
            onChange={handleVolumeChange}
            sx={{ width: 80 }}
            size="small"
          />
        </Box>

        <IconButton onClick={handleSpeedChange} size="small">
          <Speed />
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {playbackRate}x
          </Typography>
        </IconButton>

        <IconButton
          onClick={() => videoRef.current?.requestFullscreen()}
          size="small"
        >
          <Fullscreen />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default VideoPlayer;
