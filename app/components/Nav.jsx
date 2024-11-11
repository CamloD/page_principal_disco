"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/router';
import { Phone, ChevronDown} from 'lucide-react'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const links = [
    {
        name: "home",
        path: "/home",
    },
    {
        name: "gallery",
        path: "/gallery",
    }, 
    {
        name: "contact",
        path: "/contact",
    },   
    {
        name: "información",
        path: "/information",
    },   
]

const Naveg = () => {
    const pathName = usePathname();
    return (
        <nav className="hidden md:flex items-center space-x-6">
            {links.map((link, index) => {
                return (
                    <Link
                        href={link.path}
                        key={index}
                        className={`${link.path == pathName && "text-sky-300 border-b-2 border-sky-600"} capitalize hover:text-purple-300 transition-colors`}>
                        {link.name}
                    </Link>
                );
            })}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hover:bg-purple-700">
                        <Phone className="mr-2 h-4 w-4" />
                        Teléfono
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            <span>+1 234 567 890</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            <span>+1 987 654 321</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
            </DropdownMenu>
        </nav>
  );
};

export default Naveg