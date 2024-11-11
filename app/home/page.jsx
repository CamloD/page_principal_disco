'use client'

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Plus, 
  X, 
  Facebook, 
  Twitter, 
  Instagram, 
  Phone,
  ChevronDown
} from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const initialPages = [
  {
    title: "Home",
    logo: "/placeholder.svg?height=80&width=80",
    url: "https://camlod.github.io/page-disco/home"
  },
  {
    title: "YouTube",
    logo: "/placeholder.svg?height=80&width=80",
    url: "https://www.youtube.com/"
  },
  {
    title: "Gallery",
    logo: "/placeholder.svg?height=80&width=80",
    url: "https://camlod.github.io/page-disco/gallery"
  },
  {
    title: "Events",
    logo: "/placeholder.svg?height=80&width=80",
    url: "/events"
  },
  {
    title: "VIP",
    logo: "/placeholder.svg?height=80&width=80",
    url: "/vip"
  }
]

export default function Component() {
  const [pages, setPages] = useState(initialPages)
  const [currentPage, setCurrentPage] = useState(0)
  const [showIframe, setShowIframe] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newPageUrl, setNewPageUrl] = useState('')

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % pages.length)
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)

  const toggleIframe = () => setShowIframe(!showIframe)

  const addNewPage = () => {
    if (newPageTitle && newPageUrl) {
      setPages([...pages, {
        title: newPageTitle,
        logo: "/placeholder.svg?height=80&width=80",
        url: newPageUrl
      }])
      setNewPageTitle('')
      setNewPageUrl('')
    }
  }

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">


      <main className="flex-grow container mx-auto py-8 px-4 max-w-full">
        <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Explora Nuestras Páginas
        </h1>
        
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {pages.map((page, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`flex flex-col items-center transition-all duration-300 transform hover:scale-105 ${
                  currentPage === index ? 'bg-purple-100 scale-105' : ''
                }`}
                onClick={() => setCurrentPage(index)}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-2 overflow-hidden shadow-lg">
                  <Image
                    src={page.logo}
                    alt={`${page.title} logo`}
                    width={70}
                    height={70}
                    className="rounded-full"
                  />
                </div>
                <span className="text-sm font-medium">{page.title}</span>
              </Button>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex flex-col items-center transition-all duration-300 transform hover:scale-105">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-2 shadow-lg">
                    <Plus className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-medium">Add Page</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Page</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Page Title"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                  />
                  <Input
                    placeholder="Page URL"
                    value={newPageUrl}
                    onChange={(e) => setNewPageUrl(e.target.value)}
                  />
                  <Button onClick={addNewPage}>Add Page</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="bg-white shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" size="icon" onClick={prevPage} className="text-gray-600 hover:bg-gray-100 transition-all duration-300">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-3xl font-bold text-purple-600">
                {pages[currentPage].title}
              </h2>
              <Button variant="outline" size="icon" onClick={nextPage} className="text-gray-600 hover:bg-gray-100 transition-all duration-300">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col md:flex-row items-center mb-8 space-y-4 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-xl">
                <Image
                  src={pages[currentPage].logo}
                  alt={`${pages[currentPage].title} logo`}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">{pages[currentPage].title}</h3>
                <div className="flex space-x-4">
                  <Button asChild variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50 transition-all duration-300">
                    <Link href={pages[currentPage].url} target="_blank" rel="noopener noreferrer">
                      Visit Page <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button onClick={toggleIframe} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
                    {showIframe ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
              </div>
            </div>
            {showIframe && (
              <div className="mt-6 rounded-lg overflow-hidden border-2 border-purple-300 shadow-2xl relative w-full">
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 flex justify-between items-center">
                  <span className="font-semibold">{pages[currentPage].title} Preview</span>
                  <Button variant="ghost" size="sm" onClick={toggleIframe} className="text-white hover:bg-white/20">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <iframe
                  src={pages[currentPage].url}
                  className="w-full h-[80vh] mt-10"
                  title={`Preview of ${pages[currentPage].title}`}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Neon Nights Disco</h3>
              <p className="text-gray-400">The ultimate nightlife experience</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Twitter className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Instagram className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            © 2023 Neon Nights Disco. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}