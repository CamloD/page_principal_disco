'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from 'app/contexts/LanguageContext'
import { useCart } from 'app/contexts/cart_context'
import { useSelectedListing } from 'app/contexts/SelectedListingContext'
import Header from 'app/pages/components/Header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Star, ArrowLeft, Music, Utensils, Briefcase } from 'lucide-react'
import { useTheme } from 'next-themes'

const CategoryIcon = ({ category }) => {
  switch (category.toLowerCase()) {
    case 'hoteles':
      return <MapPin className="h-5 w-5" />
    case 'discotecas':
      return <Music className="h-5 w-5" />
    case 'restaurantes':
      return <Utensils className="h-5 w-5" />
    case 'eventos':
      return <Calendar className="h-5 w-5" />
    case 'servicios':
      return <Briefcase className="h-5 w-5" />
    default:
      return <Star className="h-5 w-5" />
  }
}

export default function ListingDetails() {
  const router = useRouter()
  const { t, translateWithGoogle, isTranslating } = useLanguage();
  const { addToCart } = useCart()
  const { selectedListing } = useSelectedListing()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!selectedListing) {
      router.push('/') // Redirect to home if no listing is selected
    }
  }, [selectedListing, router])

  if (!selectedListing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t('loading')}</p>
      </div>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="p-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <div className="relative h-[50vh]">
              <Image
                src={selectedListing.image || '/placeholder.svg'}
                alt={selectedListing.title || t('noImageAvailable')}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">{selectedListing.title || t('untitledListing')}</CardTitle>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <CategoryIcon category={selectedListing.category} />
                    <span className="ml-2 capitalize">{selectedListing.category || t('categoryNotAvailable')}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg">
                  ${selectedListing.price || 'N/A'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-2">{t('description')}</h3>
                  <p className="text-muted-foreground mb-4">{selectedListing.description || t('noDescriptionAvailable')}</p>
                  
                  {selectedListing.category === 'hoteles' && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">{t('amenities')}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">WiFi</Badge>
                        <Badge variant="outline">{t('parking')}</Badge>
                        <Badge variant="outline">{t('airConditioning')}</Badge>
                        <Badge variant="outline">{t('restaurant')}</Badge>
                      </div>
                    </div>
                  )}

                  {selectedListing.category === 'discotecas' && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">{t('musicGenres')}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Pop</Badge>
                        <Badge variant="outline">Electronic</Badge>
                        <Badge variant="outline">Hip Hop</Badge>
                        <Badge variant="outline">Latin</Badge>
                      </div>
                    </div>
                  )}

                  {selectedListing.category === 'restaurantes' && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">{t('cuisine')}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{t('italian')}</Badge>
                        <Badge variant="outline">{t('mexican')}</Badge>
                        <Badge variant="outline">{t('japanese')}</Badge>
                        <Badge variant="outline">{t('american')}</Badge>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-2xl font-bold mb-4">
                        ${selectedListing.price || 'N/A'} 
                        <span className="text-sm font-normal text-muted-foreground">
                          {selectedListing.category === 'hoteles' ? ` ${t('perNight')}` : ''}
                        </span>
                      </p>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{selectedListing.date || t('dateNotAvailable')}</span>
                        </div>
                        {selectedListing.category === 'hoteles' && (
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <span>2 {t('guests')}</span>
                          </div>
                        )}
                      </div>
                      <Button onClick={() => addToCart(selectedListing)} className="w-full mt-4">
                        {t('addToCart')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}