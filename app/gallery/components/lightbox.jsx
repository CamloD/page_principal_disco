/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Download, Info, Volume2, VolumeX, Play, Pause, Minimize, Maximize, Settings, PictureInPicture2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { getImageMetadata, getVideoMetadata } from './lib/mediaUtils'
import { useMediaQuery } from './hooks/useMediaQuery'

export function Lightbox({ mediaItems, selectedId, onClose, onNavigate }) {
  const [showInfo, setShowInfo] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(selectedId)
  const [direction, setDirection] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [metadata, setMetadata] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [previousVolume, setPreviousVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 })
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [videoQuality, setVideoQuality] = useState('auto')
  const [showDropdown, setShowDropdown] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const dropdownRef = useRef(null)
  const controlsTimeoutRef = useRef(null)
  const lastKeyPressTime = useRef(0)
  const lastVolumeChangeTime = useRef(0)
  const keyPressDelay = 200 // milliseconds
  const volumeChangeDelay = 20 // milliseconds

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  
  useEffect(() => {
    if (isFullscreen) {
      setShowInfo(false)
    }
  }, [isFullscreen])

  useEffect(() => {
    const fetchMetadata = async () => {
      const currentItem = mediaItems[currentIndex]
      if (currentItem.type === 'image') {
        const data = await getImageMetadata(currentItem.src)
        setMetadata(data)
      } else if (currentItem.type === 'video') {
        const data = await getVideoMetadata(currentItem.src)
        setMetadata(data)
      } else {
        setMetadata(null)
      }
    }
    fetchMetadata()
  }, [currentIndex, mediaItems])

  const handleInteraction = useCallback((e) => {
    e.stopPropagation()
    showControlsTemporarily()
    
    const containerWidth = containerRef.current.offsetWidth
    const interactionX = e.clientX || (e.touches && e.touches[0].clientX)
    
    if (interactionX < containerWidth / 3) {
      handlePrevious()
    } else if (interactionX > containerWidth * 2 / 3) {
      handleNext()
    } else if (mediaItems[currentIndex].type === 'video') {
      togglePlayPause()
    }
  }, [currentIndex, mediaItems])

  const handleDragStart = useCallback((e) => {
    if (isMobile) {
      setIsDragging(true)
      setDragStart(e.touches[0].clientX)
    }
  }, [isMobile])

  const handleDragEnd = useCallback((e) => {
    if (isMobile && isDragging) {
      setIsDragging(false)
      const dragEnd = e.changedTouches[0].clientX
      const dragDistance = dragEnd - dragStart
      if (Math.abs(dragDistance) > window.innerWidth / 4) {
        if (dragDistance > 0) {
          handlePrevious()
        } else {
          handleNext()
        }
      }
      showControlsTemporarily()
    }
  }, [isMobile, isDragging, dragStart])

  const handlePrevious = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + mediaItems.length) % mediaItems.length
      if (isPlaying) {
        setIsPlaying(false)
      }
      return newIndex
    })
  }, [mediaItems.length, isPlaying])

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % mediaItems.length
      if (isPlaying) {
        setIsPlaying(false)
      }
      return newIndex
    })
  }, [mediaItems.length, isPlaying])

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    const currentTime = new Date().getTime()
    if (currentTime - lastVolumeChangeTime.current < volumeChangeDelay) {
      return
    }
    lastVolumeChangeTime.current = currentTime

    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false
        setVolume(previousVolume)
      } else {
        videoRef.current.muted = true
        setPreviousVolume(volume)
        setVolume(0)
      }

      if (isMuted && previousVolume < 0.1) {
        setVolume(0.5)
        handleVolumeChange([0.5])
      }
      setIsMuted(!isMuted)
    }
  }, [isMuted, volume, previousVolume])

  const handleVolumeChange = useCallback((newVolume) => {
    if (videoRef.current) {
      const volumeValue = newVolume[0]
      videoRef.current.volume = volumeValue
      setVolume(volumeValue)
      setIsMuted(volumeValue === 0)
      if (volumeValue > 0) {
        setPreviousVolume(volumeValue)
      }
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen()
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      exitFullscreen()
    }
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    setIsFullscreen(false)
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleDurationChange = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }, [])

  const handleSeek = useCallback((newTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime[0]
      setCurrentTime(newTime[0])
    }
  }, [])

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }, [])

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isMobile) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying, isMobile])

  const handleDownload = useCallback(() => {
    const currentItem = mediaItems[currentIndex]
    const link = document.createElement('a')
    link.href = currentItem.src
    link.download = `download_${currentItem.id}.${currentItem.type === 'video' ? 'mp4' : 'jpg'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [mediaItems, currentIndex])

  const handleQualityChange = useCallback((quality) => {
    setVideoQuality(quality)
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const isPaused = videoRef.current.paused
      videoRef.current.src = `${mediaItems[currentIndex].src}?quality=${quality}`
      videoRef.current.currentTime = currentTime
      if (!isPaused) {
        videoRef.current.play()
      }
    }
    setShowDropdown(false)
  }, [mediaItems, currentIndex])

  const togglePictureInPicture = useCallback(() => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
      } else {
        videoRef.current.requestPictureInPicture()
      }
    }
  }, [])

  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentTime = new Date().getTime()
      if (currentTime - lastKeyPressTime.current < keyPressDelay) {
        return
      }
      lastKeyPressTime.current = currentTime

      if (e.key === 'Escape') {
        e.preventDefault()
        if (isFullscreen) {
          exitFullscreen()
        } else {
          onClose()
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === ' ' && mediaItems[currentIndex].type === 'video') {
        e.preventDefault()
        togglePlayPause()
      } else if (e.key === 'm' && mediaItems[currentIndex].type === 'video') {
        e.preventDefault()
        toggleMute()
      } else if (e.key === 'f') {
        e.preventDefault()
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handlePrevious, handleNext, currentIndex, mediaItems, isFullscreen, togglePlayPause, toggleMute, toggleFullscreen, exitFullscreen])

  useEffect(() => {
    onNavigate(currentIndex)
  }, [currentIndex, onNavigate])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const currentItem = mediaItems[currentIndex]

  const renderMediaItem = (item, isActive = false) => {
    const mobileScale = showInfo ? 0.82 : 0.90
    const desktopScale = showInfo ? 0.92 : 0.98
    const scale = isMobile ? mobileScale : desktopScale

    return item.type === 'image' ? (
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={item.src}
          alt={item.alt}
          width={1400}
          height={1000}
          className={`max-w-full max-h-[90vh] object-contain transition-transform duration-300 ${isActive ? '' : 'pointer-events-none'}`}
          style={{ transform: `scale(${scale})`, willChange: 'transform' }}
          draggable={false}
        />
      </div>
    ) : (
      <div 
        className="relative max-h-[90vh] flex items-center justify-center"
        style={{ transform: `scale(${scale})`, willChange: 'transform' }}
      >
        <video
          ref={videoRef}
          src={item.src}
          className={`max-w-full max-h-[90vh] object-contain transition-transform duration-300 ${isActive ? '' : 'pointer-events-none'}`}
          style={{ willChange: 'transform' }}
          onClick={(e) => {
            e.stopPropagation()
            togglePlayPause()
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onVolumeChange={() => setVolume(videoRef.current.volume)}
          muted={isMuted}
          onMouseMove={showControlsTemporarily}
          onLoadedMetadata={(e) => {
            setVideoSize({
              width: e.target.videoWidth,
              height: e.target.videoHeight,
            })
          }}
        />
        <div 
          className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-black/50 w-full h-full transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <div className="flex-grow"
            onClick={(e) => {
              e.stopPropagation()
              togglePlayPause()
            }}
          />
          <div className="px-4 pb-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-green-700 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-green-700 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
            />
          </div>
          <div className="flex items-center gap-3 px-4 pb-4 text-white [&_svg]:text-white">
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9 hover:bg-black/50"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
            </Button>
            <div
              className="flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Button
                size="icon"
                variant="ghost"
                className="w-9 h-9 hover:bg-black/50"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="w-6 h-6 fill-white" /> : <Volume2 className="w-6 h-6 fill-white" />}
              </Button>
              {showVolumeSlider && (
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(newVolume) => {
                    const volumeValue = newVolume[0] / 100
                    handleVolumeChange([volumeValue])
                    setVolume(volumeValue)
            
                    if (volumeValue > 0) {
                      setIsMuted(false)
                      setPreviousVolume(volumeValue)
                    } else {
                      setIsMuted(true)
                    }
                  }}
                  className="w-20 ml-2 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-green-800 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-green-800 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
                />
              )}
            </div>
            <div className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-9 h-9 hover:bg-black/50"
                  onClick={toggleDropdown}
                >
                  <Settings className="w-6 h-6" />
                </Button>
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute bottom-full right-0 mb-2 w-48 rounded-md shadow-lg bg-black/80 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={() => handleQualityChange('auto')}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-white/10"
                        role="menuitem"
                      >
                        Auto
                      </button>
                      <button
                        onClick={() => handleQualityChange('1080p')}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-white/10"
                        role="menuitem"
                      >
                        1080p
                      </button>
                      <button
                        onClick={() => handleQualityChange('720p')}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-white/10"
                        role="menuitem"
                      >
                        720p
                      </button>
                      <button
                        onClick={() => handleQualityChange('480p')}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-white/10"
                        role="menuitem"
                      >
                        480p
                      </button>
                      <button
                        onClick={handleDownload}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-white/10"
                        role="menuitem"
                      >
                        Descargar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {!isMobile && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-9 h-9 hover:bg-black/50"
                  onClick={togglePictureInPicture}
                >
                  <PictureInPicture2 className="w-6 h-6" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="w-9 h-9 hover:bg-black/50"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 ${isFullscreen ? 'bg-black' : 'bg-black bg-opacity-90'} flex items-center justify-center z-50`}
        onClick={handleInteraction}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onMouseMove={showControlsTemporarily}
      >
        <div
          ref={containerRef}
          className={`relative w-full h-full ${isFullscreen ? 'max-w-full max-h-full' : 'max-w-7xl'} mx-auto flex ${isMobile ? 'flex-col' : 'flex-row'}`}
        >
          <motion.div 
            className={`relative ${showInfo ? (isMobile ? 'w-full h-[64%] p-4' : 'w-3/4 h-full') : 'w-full h-full'} transition-all duration-300 ease-in-out flex justify-center items-center z-30`}
          >
            <div className={`absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-30 ${isFullscreen ? 'hidden' : ''} ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close lightbox">
                <X size={24} />
              </button>
              <div className="flex space-x-4">
                <button className="text-white hover:text-gray-300" aria-label="Download" onClick={handleDownload}>
                  <Download size={24} />
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInfo(!showInfo)
                  }}
                  aria-label="Toggle information"
                >
                  <Info size={24} />
                </Button>
              </div>
            </div>
  
            <div className="w-full h-full flex items-center justify-center relative">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={{
                    enter: (direction) => ({
                      x: direction > 0 ? '100%' : '-100%',
                      opacity: 0,
                    }),
                    center: {
                      zIndex: 1,
                      x: 0,
                      opacity: 1,
                    },
                    exit: (direction) => ({
                      zIndex: 0,
                      x: direction < 0 ? '100%' : '-100%',
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 500, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={handleInteraction}
                >
                  {renderMediaItem(currentItem, true)}
                </motion.div>
              </AnimatePresence>
            </div>
  
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                className="text-white hover:text-gray-300"
                aria-label="Previous image"
              >
                <ChevronLeft size={48} />
              </button>
            </div>
            <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="text-white hover:text-gray-300"
                aria-label="Next image"
              >
                <ChevronRight size={48} />
              </button>
            </div>
          </motion.div>
  
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: isMobile ? '100%' : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isMobile ? '100%' : 0 }} 
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed ${isMobile ? 'bottom-0 left-0 w-full h-[36%]' : 'top-0 right-0 w-1/4 h-full'} bg-white p-6 z-40`}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">{currentItem.alt}</h2>
                {metadata && (
                  <div className="space-y-2">
                    {currentItem.type === 'image' ? (
                      <>
                        <p><strong>Fecha:</strong> {metadata.dateTaken}</p>
                        <p><strong>Dispositivo:</strong> {metadata.device}</p>
                        <p><strong>Ubicación:</strong> {metadata.location}</p>
                        <p><strong>Nombre del archivo:</strong> {metadata.fileName}</p>
                        <p><strong>Dimensiones:</strong> {metadata.dimensions}</p>
                        <p><strong>Tamaño del archivo:</strong> {metadata.fileSize}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Duración:</strong> {metadata.duration}</p>
                        <p><strong>Formato:</strong> {metadata.format}</p>
                        <p><strong>Resolución:</strong> {metadata.resolution}</p>
                        <p><strong>Nombre del archivo:</strong> {metadata.fileName}</p>
                        <p><strong>Tamaño del archivo:</strong> {metadata.fileSize}</p>
                      </>
                    )}
                  </div>
                )}
                <p className="text-gray-600 mt-4">{currentItem.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}