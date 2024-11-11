"use client"

import { ImageGrid } from './components/imagesgrid'
const Gallery = () => {

  return (
    <div className="flex flex-col min-h-screen">    
    <title> Galería | Disco </title>
      <header className="bg-[#2a2a2a] shadow-sm grid">
      <div className="bg-[#2a2a2a] top-0 left-0 w-full  mx-auto flex items-center justify-between py-9 px-6">
      </div>
        <div className="container mx-auto px-2 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Media Gallery</h1>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[#3a3a3a] py-8">
      <ImageGrid/>
      </main>
      
    </div>
  )
}

export default Gallery