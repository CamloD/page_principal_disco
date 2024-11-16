'use client'

import * as React from "react"
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MapPinIcon, UsersIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useSearch } from './components/search'
import { useAuth } from 'app/Auth/auth'
import datas from 'app/data/data.json'
import Header from 'app/pages/components/Header'
import Checkout from 'app/checkout/page'
import { useCart } from 'app/contexts/cart_context'

const SearchForm = ({ onSearch }) => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [guests, setGuests] = useState(1)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch({ searchQuery, startDate, endDate, guests })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex flex-col md:flex-row gap-2 p-2 bg-background dark:bg-gray-800 rounded-full shadow-lg">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search" className="sr-only">{t('search')}</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              id="search" 
              placeholder={t('whereTo')} 
              className="pl-10 py-6 rounded-full border-0 bg-transparent focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Label htmlFor="dates" className="sr-only">{t('dates')}</Label>
          <div className="relative">
            <CalendarIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            />
            <Input
              id="dates"
              placeholder={t('addDates')}
              className="pl-10 py-6 rounded-full border-0 bg-transparent focus:ring-2 focus:ring-primary"
              value={startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : ''}
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
            />
            {showCalendar && (
              <div className="absolute top-12 left-0 z-10 flex">
                <Calendar
                  mode="range"
                  selected={{ from: startDate, to: endDate }}
                  onSelect={({ from, to }) => {
                    setStartDate(from)
                    setEndDate(to)
                  }}
                  className="rounded-md border bg-white shadow-lg"
                />
                <Calendar
                  mode="range"
                  selected={{ from: startDate, to: endDate }}
                  onSelect={({ from, to }) => {
                    setStartDate(from)
                    setEndDate(to)
                  }}
                  className="rounded-md border bg-white shadow-lg ml-2"
                  month={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="guests" className="sr-only">{t('guests')}</Label>
          <div className="relative">
            <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
              <SelectTrigger className="pl-10 py-6 rounded-full border-0 bg-transparent focus:ring-2 focus:ring-primary">
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
      <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
        <SearchIcon className="h-5 w-5" />
        <span className="sr-only">{t('search')}</span>
      </Button>
    </form>
  )
}

const ListingItem = ({ listing, t, onAddToCart }) => {
  const [formattedDescription, setFormattedDescription] = useState('');

  useEffect(() => {
    const formatDescription = (description) => {
      return description.split('\n').map((str, index) => (
        <span key={index}>
          {str}
          {index < description.split('\n').length - 1 && <br />}
        </span>
      ));
    };

    setFormattedDescription(formatDescription(listing.description));
  }, [listing.description]);

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
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2 md:line-clamp-none">{formattedDescription}</p>
        <p className="text-sm font-medium">{listing.date}</p>
        <p className="text-lg font-bold mt-2">${listing.price}</p>
      </div>
      <div className="flex flex-col space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              {t('viewDetails')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1190px] text-foreground dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>{listing.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Image
                src={listing.image}
                alt={listing.title}
                width={800}
                height={600}
                className="w-full h-52 object-cover rounded-lg"
              />
              <p>{formattedDescription}</p>
              <p><strong>{t('category')}:</strong> {t(listing.category)}</p>
              <p><strong>{t('date')}:</strong> {listing.date}</p>
              <p><strong>{t('price')}:</strong> ${listing.price}</p>
            </div>
          </DialogContent>
        </Dialog>
        <Button onClick={() => onAddToCart(listing)}>
          {t('addToCart')}
        </Button>
      </div>
    </div>
  )
}

const ShoppingCart = ({ cart, removeFromCart, t }) => {
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

  const handleCheckoutComplete = () => {
    localStorage.removeItem('cart');
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 rounded-full">
          <ShoppingCartIcon className="mr-2 h-4 w-4" />
          {cart.length}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('shoppingCart')}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b">
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
        <div className="mt-4 font-bold text-lg">
          {t('total')}: ${total.toFixed(2)}
        </div>
        <Checkout cart={cart} onCheckoutComplete={handleCheckoutComplete} />
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

  useEffect(() => {
    setData(datas)
    setFilteredListings(datas.listings)
  }, [])

  const handleSearch = ({ searchQuery, startDate, endDate, guests }) => {
    const filtered = data.listings.filter(listing => 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredListings(filtered)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="container mx-auto px-4 py-32">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{t('findYourNextAdventure')}</h2>
          <SearchForm onSearch={handleSearch} />
        </div>
        
        <Tabs defaultValue="todo" className="space-y-8">
          <TabsList className="flex flex-auto justify-between overflow-x-auto bg-inherit scroll overflow-y-hidden px-4 mb-12 pb-4 items-center transition-all duration-300 ease-in-out py-8 dark:bg-inherit">
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

          {data.categories.map((category, index) => (
            <TabsContent key={index} value={category.name.toLowerCase()}>
              <div className="space-y-8">
                {filteredListings
                  .filter(listing => category.name.toLowerCase() === 'todo' || listing.category === category.name.toLowerCase())
                  .map((listing) => (
                    <ListingItem key={listing.id} listing={listing} t={t} onAddToCart={addToCart} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <ShoppingCart cart={cart} removeFromCart={removeFromCart} t={t} />
    </div>
  )
}