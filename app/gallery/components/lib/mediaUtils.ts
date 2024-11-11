export async function getImageMetadata(src: string) {
  // Esta es una función simulada. En una aplicación real, 
  // aquí obtendrías los metadatos reales de la imagen.
  return {
    dateTaken: new Date().toLocaleString(),
    device: "iPhone 12 Pro",
    location: "New York, NY",
    fileName: src.split('/').pop() || 'unknown.jpg',
    dimensions: "3024 x 4032",
    fileSize: "2.5 MB"
  }
}

export async function getVideoMetadata(src: string) {
  // Esta es una función simulada. En una aplicación real, 
  // aquí obtendrías los metadatos reales del video.
  return {
    duration: "00:03:24",
    format: "MP4",
    resolution: "1920x1080..",
    fileName: src.split('/').pop() || 'unknown.mp4',
    fileSize: "15.7 MB"
  }
}