import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Contacto() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8">Contacto</h1>
        <div className="max-w-md mx-auto bg-white/10 p-8 rounded-lg shadow-xl">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre</label>
              <Input id="name" placeholder="Tu nombre" className="bg-white/20 text-white placeholder-gray-400" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <Input id="email" type="email" placeholder="tu@email.com" className="bg-white/20 text-white placeholder-gray-400" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Mensaje</label>
              <Textarea id="message" placeholder="Tu mensaje" className="bg-white/20 text-white placeholder-gray-400" />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Enviar Mensaje
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}