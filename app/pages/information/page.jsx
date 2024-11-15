import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Informacion() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-12">Información</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/10 border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">Horario</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Jueves a Sábado: 22:00 - 06:00</p>
              <p>Domingo: 20:00 - 02:00</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Calle Fiesta 123</p>
              <p>Ciudad Nocturna, CP 12345</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">Dress Code</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Elegante y moderno. No se permiten zapatillas deportivas ni camisetas sin mangas.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Para reservas de mesas VIP, llama al +1 234 567 890 o envía un email a reservas@neonnights.com</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}