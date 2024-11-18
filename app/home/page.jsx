'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MapPinIcon, UsersIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from 'app/Auth/auth'
import datas from 'app/data/data.json'
import Header from 'app/pages/components/Header'
import { useCart } from 'app/contexts/cart_context'
import { format } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from 'next-themes'
import { useCheckout } from 'app/contexts/checkout_context'
import { useSearch } from './components/search'
import { useSelectedListing } from 'app/contexts/SelectedListingContext'

const SearchForm = ({ onSearch }) => {
  const { t, translateWithGoogle, isTranslating } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('')
  const [date, setDate] = useState({
    from: undefined,
    to: undefined
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const [guests, setGuests] = useState(1)
  const calendarRef = useRef(null)
  const { theme } = useTheme()
  const { searchResults, searchListings } = useSearch()

  const handleSearch = (e) => {
    e.preventDefault()
    searchListings(searchQuery)
    onSearch({ searchQuery, date, guests })
  }

  const handleTranslate = async () => {
    const translatedText = await translateWithGoogle(originalText, 'es');
    // Use the translatedText as needed
  };

  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 1) {
      searchListings(query)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const suggestions = searchResults.slice(0, 5).map(result => result.title)

  return (
    <form onSubmit={handleSearch} className="relative bg-card dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search">{t('search')}</Label>
          <div className="relative mt-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              id="search" 
              placeholder={t('whereTo')} 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={handleInputChange}
              list="search-suggestions"
            />
            <datalist id="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>
          </div>
        </div>
        <div>
          <Label htmlFor="dates">{t('dates')}</Label>
          <div className="relative mt-1">
            <CalendarIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            />
            <Input
              id="dates"
              placeholder={t('selectDates')}
              className="pl-10 w-full"
              value={date?.from && date?.to ? `${format(date.from, 'PP')} - ${format(date.to, 'PP')}` : ''}
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
            />
            {showCalendar && (
              <div ref={calendarRef} className="absolute top-full left-0 z-10 mt-2">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  className={`rounded-md border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="guests">{t('guests')}</Label>
          <div className="relative mt-1">
            <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
              <SelectTrigger className="pl-10 w-full">
                <SelectValue placeholder={t('addGuests')} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? t('guest') : t('guests')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Button type="submit" className="mt-4 w-full">
        <SearchIcon className="h-5 w-5 mr-2" />
        {t('search')}
      </Button>
    </form>
  )
}

const ListingItem = ({ listing, t, onAddToCart, view }) => {
  const router = useRouter()
  const { setSelectedListing } = useSelectedListing()

  const handleViewDetails = () => {
    setSelectedListing(listing)
    router.push('/home/details')
  }
    

  if (view === 'grid') {
    return (
      <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
        <div className="relative h-48 md:h-64">
          <Image
            src={listing.image || '/placeholder.svg'}
            alt={listing.title || t('noImageAvailable')}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{listing.title || t('untitledListing')}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{listing.description || t('noDescriptionAvailable')}</p>
          <p className="text-sm font-medium mb-2">{listing.date || t('dateNotAvailable')}</p>
          <div className="flex justify-between items-center space-x-5">
            <p className="text-lg font-bold">${listing.price || 'N/A'}</p>
            <div className='flex flex-grow space-x-2 items-end'>
              <Button variant="outline" onClick={handleViewDetails}>
                {t('viewDetails')}
              </Button>
              <Button onClick={() => onAddToCart(listing)}>
                {t('addToCart')}
              </Button>
            </div> 
          </div>
        </CardContent>
      </Card>
    )
  } else {
    return (
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-6 border-b last:border-b-0">
        <Image
          src={listing.image}
          alt={listing.title}
          width={150}
          height={150}
          className="object-cover rounded-lg"
        />
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2 md:line-clamp-none">{listing.description}</p>
          <p className="text-sm font-medium">{listing.date}</p>
          <p className="text-lg font-bold mt-2">${listing.price}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={handleViewDetails}>
            {t('viewDetails')}
          </Button>
          <Button onClick={() => onAddToCart(listing)}>
            {t('addToCart')}
          </Button>
        </div>
      </div>
    )
  }
}

const ShoppingCart = ({ cart, removeFromCart, t }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const { startCheckout } = useCheckout()
  const { user } = useAuth()
  const router = useRouter()
  const { theme } = useTheme()

  const handleProceedToCheckout = () => {
    if (user) {
      startCheckout()
      router.push('/checkout') 
    } else {
      router.push('/login') 
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 rounded-full z-50">
          <ShoppingCartIcon className="mr-2 h-4 w-4" />
          {cart.length}
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <DialogHeader>
          <DialogTitle>{t('shoppingCart')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                <div className="flex-grow pr-4">
                  <h4 className="font-semibold line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">${item.price}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>
                  {t('remove')}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 font-bold text-lg">
          {t('total')}: ${total.toFixed(2)}
        </div>
        <Button onClick={handleProceedToCheckout} className="w-full mt-4">{t('proceedToCheckout')}</Button>
      </DialogContent>
    </Dialog>
  )
}

export default function HomePage() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const { cart, addToCart, removeFromCart } = useCart()
  const [data, setData] = useState({ categories: [], listings: [] })
  const [filteredListings, setFilteredListings] = useState([])
  const [view, setView] = useState('grid')
  const { searchListings, searchResults } = useSearch()

  useEffect(() => {
    setData(datas)
    setFilteredListings([])
  }, [])

  const handleSearch = ({ searchQuery, date, guests }) => {
    const filtered = searchResults.filter(listing => {
      const listingDate = new Date(listing.date)
      return (!date.from || listingDate >= date.from) && (!date.to || listingDate <= date.to)
    })
    setFilteredListings(filtered)
  }

  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 w-full">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">{t('findYourNextAdventure')}</h1>
        <div className="mb-12">
          <SearchForm onSearch={handleSearch} />
        </div>
        
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === 'list' ? 'grid' : 'list')}
          >
            {view === 'list' ? t('gridView') : t('listView')}
          </Button>
        </div>

        <Tabs defaultValue="todo" className="space-y-8">
          <ScrollArea className="w-full">
            <TabsList className="flex justify-start gap-2 mb-8 p-1 min-w-max">
              {data.categories.map((category, index) => (
                <TabsTrigger
                  key={index}
                  value={category.name.toLowerCase()}
                  className="px-4 py-2 rounded-full text-sm transition-colors duration-300 ease-in-out hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {t(category.name.toLowerCase())}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {data.categories.map((category, index) => (
            <TabsContent key={index} value={category.name.toLowerCase()}>
              <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
                {(filteredListings.length > 0 ? filteredListings : data.listings)
                  .filter(listing => category.name.toLowerCase() === 'todo' || listing.category === category.name.toLowerCase())
                  .map((listing) => (
                    <ListingItem key={listing.id} listing={listing} t={t} onAddToCart={addToCart} view={view} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <ShoppingCart cart={cart} removeFromCart={removeFromCart} t={t} />
    </div>
  )
}