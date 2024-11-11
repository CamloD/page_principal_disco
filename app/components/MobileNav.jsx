"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlignJustify, XIcon } from "lucide-react";
import { usePathname } from 'next/navigation';

const links = [
  {
    name: "home",
    path: "/home",
  },
  {
    name: "gallery",
    path: "/gallery",
  },

];

const MobileNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Botón de menú para abrir el panel lateral */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <AlignJustify className="w-6 h-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close menu"
        />
      )}
      <div
        className={`fixed z-50 inset-y-0 right-0 h-full w-3/4 bg-[#121212] text-white shadow-lg border-0 flex flex-col transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } sm:max-w-sm`}
        style={{ backgroundColor: 'rgba(18, 18, 18, 0.95)' }} // Aplicando fondo semi-translúcido
      >
        <div className='relative w-full h-full bg-opacity-90 p-5'>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white"
            aria-label="Close menu"
          >
            <XIcon className="w-6 h-6" />
          </Button>
          <div className="mt-9 mb-5 text-center text-2xl grid gap-6 p-6">
            <Link href="/home" prefetch={false} className="flex items-center justify-center space-x-2">
              <Music2Icon className="h-6 w-6" />
              <h1 className="text-2xl font-bold uppercase">Discoteca</h1>
            </Link>
          </div>
          <nav className="flex flex-col justify-center items-center gap-4 p-4">
            {links.map((link, index) => (
              <Link
                href={link.path}
                key={index}
                className={`${
                  link.path === pathname
                    ? 'text-lg font-medium text-sky-300 border-b-2 border-sky-600'
                    : 'text-xl capitalize hover:text-blue-400'
                } capitalize transition-all`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

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
  );
}

export default MobileNav;
