'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useLanguage } from 'app/contexts/LanguageContext'
import { useCart } from 'app/contexts/cart_context'
import { useSelectedListing } from 'app/contexts/SelectedListingContext'
import Header from 'app/pages/components/Header'


export default function ListingDetails({ params }) {
  const router = useRouter()
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const { selectedListing } = useSelectedListing()

  useEffect(() => {
    if (!selectedListing) {
      router.push('/') 
    }
  }, [selectedListing, router])

  if (!selectedListing) {
    return null 
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 w-full">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{selectedListing.title}</h1>
          <div className="relative h-[40vh] mb-6">
            <Image
              src={selectedListing.image}
              alt={selectedListing.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <p className="text-lg mb-4">{selectedListing.description}</p>
          <p className="text-xl font-bold mb-4">${selectedListing.price}</p>
          <p className="text-md mb-6">{selectedListing.date}</p>
          <Button onClick={() => addToCart(selectedListing)} className="w-full md:w-auto">
            {t('addToCart')}
          </Button>
        </div>
      </main>
    </div>
  )
}