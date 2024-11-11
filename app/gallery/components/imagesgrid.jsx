'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Play, Search, Image as ImageIcon, Info } from 'lucide-react'
import { Lightbox } from './lightbox'
import { useSwipeable } from 'react-swipeable'
import { motion } from 'framer-motion'
import { getImageMetadata } from './lib/mediaUtils'

const mediaItems = [
  { id: 1, src: 'https://picsum.photos/1200/800?random=1', type: 'image', alt: "Image 1", description: "A beautiful landscape with mountains and a lake" },
  { id: 2, src: 'https://picsum.photos/600/800?random=2', type: 'image', alt: "Image 2" },
  { id: 3, src: 'https://videos.pexels.com/video-files/5862131/5862131-hd_1920_1080_24fps.mp4', type: 'video', alt: "Video 1" },
  { id: 4, src: 'https://picsum.photos/1200/800?random=3', type: 'image', alt: "Image 3" },
  { id: 5, src: 'https://videos.pexels.com/video-files/3940071/3940071-uhd_2560_1440_30fps.mp4', type: 'video', alt: "Video 2" },
  { id: 6, src: 'https://picsum.photos/1200/800?random=4', type: 'image', alt: "Image 4" },
  { id: 7, src: 'https://picsum.photos/600/800?random=5', type: 'image', alt: "Image 5" },
  { id: 8, src: 'https://picsum.photos/1200/800?random=6', type: 'image', alt: "Image 6" },
  { id: 9, src: 'https://videos.pexels.com/video-files/27034803/12052488_2560_1440_30fps.mp4', type: 'video', alt: "Video 3" },
  { id: 10, src: 'https://picsum.photos/1200/800?random=7', type: 'image', alt: "Image 7" },
  { id: 11, src: 'https://picsum.photos/600/800?random=8', type: 'image', alt: "Image 8" },
  { id: 12, src: 'https://picsum.photos/1200/800?random=9', type: 'image', alt: "Image 9" },
  { id: 13, src: 'video/video.mp4', type:  'video', alt: "Video 4" },
  { id: 14, src: 'images/image3.jpg', type: 'image', alt: "Image 10" },
  { id: 15, src: 'https://picsum.photos/1200/800?random=10', type: 'image', alt: "Image 11" },
  { id: 16, src: 'https://picsum.photos/600/800?random=11', type: 'image', alt: "Image 12" },
  { id: 17, src: 'https://videos.pexels.com/video-files/5862131/5862131-hd_1920_1080_24fps.mp4', type: 'video', alt: "Video 5" },
  { id: 18, src: 'https://picsum.photos/1200/800?random=12', type: 'image', alt: "Image 13" },
  { id: 19, src: 'https://videos.pexels.com/video-files/3940071/3940071-uhd_2560_1440_30fps.mp4', type: 'video', alt: "Video 6" },
  { id: 20, src: 'https://picsum.photos/1200/800?random=13', type: 'image', alt: "Image 14" },
  { id: 21, src: 'https://picsum.photos/600/800?random=14', type: 'image', alt: "Image 15" },
  { id: 22, src: 'https://picsum.photos/1200/800?random=15', type: 'image', alt: "Image 16" },
  { id: 23, src: 'https://videos.pexels.com/video-files/26309582/11946486_1440_2560_30fps.mp4', type: 'video', alt: "Video 7" },
  { id: 24, src: 'https://picsum.photos/1200/800?random=16', type: 'image', alt: "Image 17" },
  { id: 25, src: 'https://picsum.photos/600/800?random=17', type: 'image', alt: "Image 18" },
  { id: 26, src: 'https://picsum.photos/1200/800?random=18', type: 'image', alt: "Image 19" },
  { id: 27, src: 'video/video_banner.mp4', type:  'video', alt: "Video 8" },
  { id: 28, src: 'images/image4.jpg', type: 'image', alt: "Image 20" },
]

function VideoThumbnail({ src, alt }) {
  const videoRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (isHovered && videoRef.current && !hasError) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error)
        setHasError(true)
      });
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovered, hasError])

  return (
    <div 
      className="relative w-full h-full bg-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={alt}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50">
          <p className="text-white">Error al cargar el video</p>
        </div>
      )}
    </div>
  )
}

export function ImageGrid() {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const gridRef = useRef(null)
  const [isGridMounted, setIsGridMounted] = useState(false)

  useEffect(() => {
    setIsGridMounted(true)
  }, [])

  const handleDrag = (_, info) => {
    const dragDistance = info.offset.x
    const gridWidth = gridRef.current.offsetWidth
    const threshold = gridWidth * 0.2 // 20% del ancho de la cuadrícula

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Desplazamiento a la derecha
        gridRef.current.scrollBy({ left: -gridWidth, behavior: 'smooth' })
      } else {
        // Desplazamiento a la izquierda
        gridRef.current.scrollBy({ left: gridWidth, behavior: 'smooth' })
      }
    } else {
      // Si el desplazamiento es menor que el umbral, volver a la posición original
      gridRef.current.scrollBy({ left: -dragDistance, behavior: 'smooth' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-2">
      {isGridMounted && (
        <motion.div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-x-hidden px-1 sm:px-6 lg:px-8 py-4"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDrag={handleDrag}
        >
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedIndex(index)}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <VideoThumbnail src={item.src} alt={item.alt} />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                {item.type === 'image' ? (
                  <Search className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                ) : (
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-1">
                {item.type === 'image' ? (
                  <ImageIcon className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      {selectedIndex >= 0 && (
        <Lightbox
          mediaItems={mediaItems}
          selectedId={selectedIndex}
          onClose={() => setSelectedIndex(-1)}
          onNavigate={setSelectedIndex}
        />
      )}
    </div>
  )
}