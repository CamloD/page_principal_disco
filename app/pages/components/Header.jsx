/* eslint-disable react-hooks/exhaustive-deps */
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
import { CalendarIcon, MapPinIcon, UsersIcon, MoonIcon, SunIcon, GlobeIcon, SearchIcon, MenuIcon, LogOutIcon, UserIcon, ShoppingCartIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


const Header = () => {
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [headerShadow, setHeaderShadow] = useState('shadow-sm')
  const headerRef = useRef(null)
  const { theme, setTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)
  const { user, logout } = useAuth()
  const { cart } = useCart()

  const updateHeaderHeight = () => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight
      setHeaderHeight(height)
    }
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY
    setIsScrolled(window.scrollY > headerHeight - 30)
    setHeaderShadow(scrollTop > headerHeight - 30 ? 'shadow-xl' : 'shadow-sm')
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    setIsClient(true)
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', () => {
      updateHeaderHeight()
      handleScroll()
    })
    updateHeaderHeight()
    handleScroll()

    if (storedTheme) {
      setTheme(storedTheme)
    } else {     
      setTheme('light')
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', () => {
        updateHeaderHeight()
        handleScroll()
      })
    }
  }, [handleScroll, headerHeight, setTheme])

  useEffect(() => {
    const loadGoogleTranslate = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'en,es,fr,de,it,pt',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    };

    if (typeof window !== 'undefined') {
      loadGoogleTranslate();
    }
  }, []);

  if (!isClient || theme === null) {
    return null
  }

  const initialColor = 'rgba(26, 26, 26, 0)'
  const scrolledColor = 'rgba(26, 26, 26, 0.97)'

  const headerStyle = {
    backgroundColor: isScrolled ? scrolledColor : initialColor,
    transition: 'background-color 0.3s ease',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 2
  }

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <header ref={headerRef} className={`fixed top-0 left-0 w-full bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 transition-colors duration-300 z-50 ${headerShadow}`}>
      <div className="container mx-auto px-1 pt-5 pb-2">
        <div className="flex justify-between items-center pb-5 pt-2">
          <Link href="/home">
            <h1 className="text-3xl md:text-4xl font-bold text-center pt-2">Reservas</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <div className="flex right-0 pt-2">
              <div className="items-center space-x-4 flex">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  className="rounded-full"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full">
                  <GlobeIcon className="h-5 w-5" />
                  <span className="sr-only">{t('changeLanguage')}</span>
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <GlobeIcon className="h-5 w-5 mr-2" />
                      {t('translate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <div id="google_translate_element" className="google-translate-container"></div>
                  </PopoverContent>
                </Popover>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <ShoppingCartIcon className="h-5 w-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-1 pl-5">
                {user ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <Image
                          src={user.photo || '/default-avatar.png'}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span>{user.name}</span>
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
                    <Link href="/login" rel="noopener noreferrer">
                      <Button variant="ghost" className="rounded-full w-[115.2px]">{t('login')}</Button>
                    </Link>
                    <Link href="/register" rel="noopener noreferrer">
                      <Button variant="ghost" className="rounded-full w-[115.2px]">{t('register')}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="text-foreground dark:text-gray-100">
              <SheetHeader className="text-foreground dark:text-gray-100">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col items-center space-y-4 mt-4 text-foreground dark:text-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  className="rounded-full w-full justify-center"
                >
                  {theme === 'dark' ? (
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
                <Button variant="outline" onClick={toggleLanguage} className="rounded-full justify-center">
                  <GlobeIcon className="h-5 w-5 mr-2" />
                  {language === 'es' ? 'EN' : 'ES'}
                </Button>
                <div id="google_translate_element_mobile" className="google-translate-container"></div>
                <Link href="/cart">
                  <Button variant="outline" className="rounded-full justify-center relative">
                    <ShoppingCartIcon className="h-5 w-20 mr-1" />
                    Cart ({cart.length})
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </Link>
                {user ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={user.photo || '/default-avatar.png'}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span>{user.name}</span>
                    </div>
                    <Link href="/profile">
                      <Button variant="ghost" className="rounded-full">{t('profile')}</Button>
                    </Link>
                    <Button variant="ghost" onClick={logout} className="rounded-full">{t('logout')}</Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" rel="noopener noreferrer">
                      <Button variant="ghost" className="rounded-full">{t('login')}</Button>
                    </Link>
                    <Link href="/register" rel="noopener noreferrer">
                      <Button color="cyan" variant="ghost" className="rounded-full">{t('register')}</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header