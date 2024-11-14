/* eslint-disable react-hooks/exhaustive-deps */
"use client"; 

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from "next/image"
import MobileNav from './MobileNav';
import { useLanguage } from '../contexts/LanguageContext'
import Nav from './Nav';
import { CalendarIcon, MapPinIcon, UsersIcon, MoonIcon, SunIcon, GlobeIcon, SearchIcon, MenuIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

const Header = () => {
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerShadow, setHeaderShadow] = useState('shadow-sm');
  const headerRef = useRef(null);
  const { theme, setTheme } = useTheme()
  

  const updateHeaderHeight = () => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);

    }
  };

  const handleScroll = () => {

      const scrollTop = window.scrollY;
      setIsScrolled(window.scrollY > headerHeight - 30);
      setHeaderShadow(scrollTop > headerHeight - 30 ? 'shadow-xl' : 'shadow-sm');
  };

  useEffect(() => {
    

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      updateHeaderHeight();
      handleScroll();
    }); 
    updateHeaderHeight(); 
     handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', () => {
        updateHeaderHeight();
        handleScroll();
      });
    };
  }, [handleScroll, headerHeight]);

  const initialColor = 'rgba(26, 26, 26, 0)'; 
  const scrolledColor = 'rgba(26, 26, 26, 0.97)';

  const headerStyle = {
    backgroundColor: isScrolled ? scrolledColor : initialColor,
    transition: 'background-color 0.3s ease',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%', 
    zIndex: 2
  };


  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
    
  }
  return (
    
    <header className="shadow-md fixed top-0 left-0 w-full bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 transition-colors duration-300 z-50">
      <div className=" container mx-auto px-1 pt-5 pb-0">
        <div className="flex justify-between items-center pb-7 pt-4">
          <Link href="/home">
            <h1 className="text-3xl md:text-4xl font-bold text-center">Reservas</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <div className="flex fixed right-0 p-4 ">
              <div className="items-center space-x-4 flex">
                <Button 
                  variant="outline" 
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
              </div>

              <div className="flex items-center space-x-1 pl-5">
                <Link href="/login" rel="noopener noreferrer">
                  <Button variant="ghost" className="rounded-full w-[115.2px]">{t('login')}</Button>
                </Link>
                <Link href="/register" rel="noopener noreferrer">
                  <Button variant="ghost" className="rounded-full w-[115.2px]">{t('register')}</Button>
                </Link>
              </div>
            </div>

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
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  className="rounded-full w-full justify-start"
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
        </div>
      </div>
    </header>

    
  )
}
export default Header