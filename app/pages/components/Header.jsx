'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from 'app/contexts/LanguageContext'
import { useTheme } from 'next-themes'
import { useAuth } from 'app/Auth/auth'
import { useCart } from 'app/contexts/cart_context'
import { MoonIcon, SunIcon, GlobeIcon, MenuIcon, LogOutIcon, UserIcon, ShoppingCartIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const { language, setLanguage, t, availableLanguages } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const googleTranslateRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadGoogleTranslate = () => {
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'es',
          includedLanguages: availableLanguages.join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, 'google_translate_element')
      }
    }

    loadGoogleTranslate()
  }, [availableLanguages])

  const toggleLanguage = (lang) => {
    setLanguage(lang)
  }

  const toggleGoogleTranslate = () => {
    if (googleTranslateRef.current) {
      const translateElement = googleTranslateRef.current.querySelector('.goog-te-combo')
      if (translateElement) {
        translateElement.focus()
        translateElement.click()
      }
    }
  }

  if (!mounted) return null

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background dark:bg-gray-900 shadow-md' : 'bg-background dark:bg-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/home">
            <h1 className="text-2xl font-bold text-foreground dark:text-gray-100">Reservas</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="rounded-full"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <GlobeIcon className="h-5 w-5 mr-2" />
                  {t('translate')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableLanguages.map((lang) => (
                  <DropdownMenuItem key={lang} onSelect={() => toggleLanguage(lang)}>
                    {t(lang)}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onSelect={toggleGoogleTranslate}>
                  {t('googleTranslate')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="rounded-full relative">
                <ShoppingCartIcon className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="rounded-full">
                    <Image
                      src={user.photo || '/default-avatar.png'}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full mr-2"
                    />
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="flex flex-col space-y-2">
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <UserIcon className="mr-2 h-4 w-4" />
                        {t('profile')}
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={logout} className="w-full justify-start">
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      {t('logout')}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('login')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="ghost" size="sm">{t('register')}</Button>
                </Link>
              </>
            )}
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
                  variant="ghost" 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  className="justify-start"
                >
                  {theme === 'dark' ? <SunIcon className="mr-2 h-5 w-5" /> : <MoonIcon className="mr-2 h-5 w-5" />}
                  {theme === 'dark' ? t('lightMode') : t('darkMode')}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start w-full">
                      <GlobeIcon className="mr-2 h-5 w-5" />
                      {t('translate')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {availableLanguages.map((lang) => (
                      <DropdownMenuItem key={lang} onSelect={() => toggleLanguage(lang)}>
                        {t(lang)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onSelect={toggleGoogleTranslate}>
                      {t('googleTranslate')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/cart">
                  <Button variant="ghost" className="justify-start relative w-full">
                    <ShoppingCartIcon className="mr-2 h-5 w-5" />
                    {t('cart')} ({cart.length})
                  </Button>
                </Link>
                {user ? (
                  <>
                    <Link href="/profile">
                      <Button variant="ghost" className="justify-start w-full">
                        <UserIcon className="mr-2 h-5 w-5" />
                        {t('profile')}
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={logout} className="justify-start w-full">
                      <LogOutIcon className="mr-2 h-5 w-5" />
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="justify-start w-full">{t('login')}</Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="ghost" className="justify-start w-full">{t('register')}</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div id="google_translate_element" ref={googleTranslateRef} className="hidden"></div>
    </header>
  )
}

export default Header