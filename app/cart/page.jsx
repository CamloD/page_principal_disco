'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import Header from 'app/pages/components/Header'
import { useAuth } from 'app/Auth/auth'
import { useCheckout } from 'app/contexts/checkout_context'
import { useLanguage } from 'app/contexts/LanguageContext'
import { useCart } from 'app/contexts/cart_context'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart()
  const { t } = useLanguage()
  const { user } = useAuth()
  const { startCheckout } = useCheckout() // Accedemos al contexto de Checkout
  const router = useRouter()

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const handleProceedToCheckout = () => {
    if (user) {
      startCheckout() // Iniciamos el flujo de checkout
      router.push('/checkout') // Redirigimos al usuario a la página de checkout
    } else {
      router.push('/login') // Si el usuario no está logueado, lo redirigimos al login
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{t('shoppingCart')}</h1>
        {cart.length === 0 ? (
          <><p>{t('cartEmpty')}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/">
                <Button variant="outline">{t('continueShopping')}</Button>
              </Link>
           </div>
            
          </>
        ) : (
          <>
            {cart.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="flex flex-col sm:flex-row items-center p-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="object-cover rounded-lg mr-4 mb-4 sm:mb-0"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{item.description}</p>
                    <p className="text-lg font-bold mt-2">${item.price}</p>
                  </div>
                  <Button variant="destructive" onClick={() => removeFromCart(item.id)} className="mt-4 sm:mt-0">
                    {t('remove')}
                  </Button>
                </CardContent>
              </Card>
            ))}
            <div className="mt-4 text-xl font-bold">
              {t('total')}: ${total.toFixed(2)}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <Button onClick={handleProceedToCheckout}>{t('proceedToCheckout')}</Button>
              <Button variant="outline" onClick={clearCart}>{t('clearCart')}</Button>
              <Link href="/">
                <Button variant="outline">{t('continueShopping')}</Button>
              </Link>
              
            </div>
          </>
        )}
        
      </div>
    </div>
  )
}
