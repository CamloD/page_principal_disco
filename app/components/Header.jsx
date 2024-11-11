/* eslint-disable react-hooks/exhaustive-deps */
"use client"; 

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import Image from "next/image"
import MobileNav from './MobileNav';
import Nav from './Nav';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerShadow, setHeaderShadow] = useState('shadow-sm');
  const headerRef = useRef(null);

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
  return (
    <header className="bg-purple-800 text-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="/placeholder.svg?height=50&width=50"
              alt="Neon Nights Disco Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-2xl font-bold">Neon Nights Disco</span>
          </div>
         <Nav/>
           <div className="md:hidden">
                <MobileNav />
            </div>
        </div>
      </header>
    
  )
}
function Music2Icon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="18" r="4" />
        <path d="M12 18V2l7 4" />
      </svg>
    )
  }
export default Header