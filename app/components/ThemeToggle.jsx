'use client'

import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
      className="rounded-full"
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
  )
}