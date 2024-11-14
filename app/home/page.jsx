'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CalendarIcon, MapPinIcon, UsersIcon, MoonIcon, SunIcon, GlobeIcon, SearchIcon, MenuIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from 'next-themes'
import datas from '../data/data.json'


const SearchForm = () => {
  const { t } = useLanguage()

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-2 p-2 bg-background dark:bg-gray-800 rounded-full shadow-lg">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="location" className="sr-only">{t('location')}</Label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="location" placeholder={t('whereTo')} className="pl-10 py-6 rounded-full border-0 bg-transparent focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="dates" className="sr-only">{t('dates')}</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="dates" placeholder={t('addDates')} className="pl-10 py-6 rounded-full border-0 bg-transparent focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="guests" className="sr-only">{t('guests')}</Label>
          <div className="relative">
            <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select>
              <SelectTrigger className="pl-10 py-6 rounded-full border-0 bg-transparent focus:ring-2 focus:ring-primary">
                <SelectValue placeholder={t('addGuests')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 {t('guest')}</SelectItem>
                <SelectItem value="2">2 {t('guests')}</SelectItem>
                <SelectItem value="3">3 {t('guests')}</SelectItem>
                <SelectItem value="4">4+ {t('guests')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
        <SearchIcon className="h-5 w-5" />
        <span className="sr-only">{t('search')}</span>
      </Button>
    </div>
  )
}

const ListingCard = ({ listing, t }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 bg-card dark:bg-gray-800 cursor-pointer">
          <div className="relative">
            <Image
              src={listing.image}
              alt={listing.title}
              width={800}
              height={600}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4 bg-background dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold">
              ${listing.price}
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{listing.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{listing.description}</p>
            <p className="text-sm font-medium">{listing.date}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              {t('viewDetails')}
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] text-foreground dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>{listing.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Image
            src={listing.image}
            alt={listing.title}
            width={800}
            height={600}
            className="w-full h-64 object-cover rounded-lg"
          />
          <p >{listing.description}</p>
          <p><strong>{t('category')}:</strong> {t(listing.category)}</p>
          <p><strong>{t('date')}:</strong> {listing.date}</p>
          <p><strong>{t('price')}:</strong> ${listing.price}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage()
  const [data, setData] = useState({ categories: [], listings: [] })
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  useEffect(() => {
    setData(datas);
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <Link href="/home">
            <h1 className="text-3xl md:text-4xl font-bold text-center">Reservas</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="rounded-full"
            >
              {theme === 'light' ? (
                <>
                  <SunIcon className="h-5 w-5" />
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5" />
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full">
              <GlobeIcon className="h-5 w-5" />
              <span className="sr-only">{t('changeLanguage')}</span>
            </Button>
            <Link href="/login" rel="noopener noreferrer">
              <Button variant="ghost" className="rounded-full">{t('login')}</Button>
            </Link>
            <Link href="/register" rel="noopener noreferrer">
              <Button variant="primary" className="rounded-full">{t('register')}</Button>
            </Link>

          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTheme(theme === 'light' ? 'light' : 'dark')} 
                  className="rounded-full w-full justify-start"
                >
                  {theme === 'light' ? (
                    <>
                      <SunIcon className="h-5 w-5 mr-2" />
                      {t('lightMode')}
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5 mr-2" />
                      {t('darkMode')}
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={toggleLanguage} className="rounded-full w-full justify-start">
                  <GlobeIcon className="h-5 w-5 mr-2" />
                  {t('changeLanguage')}
                </Button>
                <Link href="/login" rel="noopener noreferrer">
                  <Button variant="ghost" className="rounded-full">{t('login')}</Button>
                </Link>
                <Link href="/register" rel="noopener noreferrer">
                  <Button variant="primary" className="rounded-full">{t('register')}</Button>
                </Link>

              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{t('findYourNextAdventure')}</h2>
          <SearchForm />
        </div>


        <Tabs defaultValue="todo" className="space-y-8">
          <TabsList className="flex flex-auto justify-between overflow-x-auto bg-inherit scroll overflow-hidden px-4 mb-12 pb-4 items-center transition-all duration-300 ease-in-out py-8">
            {data.categories.map((category, index) => (
              <TabsTrigger
                key={index}
                value={category.name.toLowerCase()}
                className="px-4 md:px-6 py-6 md:py-3 rounded-full text-sm md:text-base transition-colors duration-300 ease-in-out hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:ring-4"
              >
                {t(category.name.toLowerCase())}
              </TabsTrigger>
            ))}
          </TabsList>

          {data.categories.map((category, index) => {
            const filteredListings = data.listings.filter(listing =>
              category.name.toLowerCase() === 'todo' || listing.category === category.name.toLowerCase()
            )

            return (
              <TabsContent key={index} value={category.name.toLowerCase()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} t={t} />
                  ))}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}