import { ClusterLogo, SecihtiLogo } from '@/components/logos'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Aviso de Privacidad | Cluster',
  description: 'Aviso de privacidad para la batería de evaluación de madurez digital',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <ClusterLogo className="h-8 text-foreground" />
        <SecihtiLogo className="h-6 text-muted-foreground" />
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Aviso de Privacidad
          </h1>
          <p className="text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-8">
          {/* Intro */}
          <section className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF149320' }}
              >
                <Shield className="w-6 h-6" style={{ color: '#FF1493' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  Tu privacidad es importante
                </h2>
                <p className="text-muted-foreground">
                  En Cluster, nos comprometemos a proteger tu información personal y a ser
                  transparentes sobre cómo la utilizamos.
                </p>
              </div>
            </div>
          </section>

          {/* Responsable */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5" style={{ color: '#FF1493' }} />
              Identidad del Responsable
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cluster, con domicilio en [Dirección fiscal], es responsable del tratamiento
              de los datos personales que nos proporciones, los cuales serán protegidos
              conforme a lo dispuesto por la Ley Federal de Protección de Datos Personales
              en Posesión de los Particulares.
            </p>
          </section>

          {/* Datos recabados */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Eye className="w-5 h-5" style={{ color: '#FF1493' }} />
              Datos Personales Recabados
            </h2>
            <p className="text-muted-foreground mb-4">
              Para llevar a cabo las finalidades descritas, recabamos los siguientes datos:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#FF1493' }} />
                <span>Respuestas a las preguntas de la evaluación de madurez digital</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#FF1493' }} />
                <span>Información agregada y anónima sobre patrones de respuesta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#FF1493' }} />
                <span>Datos técnicos del dispositivo (navegador, sistema operativo)</span>
              </li>
            </ul>
          </section>

          {/* Finalidades */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Finalidades del Tratamiento
            </h2>
            <p className="text-muted-foreground mb-4">
              Los datos personales que recabamos serán utilizados para:
            </p>
            <div className="grid gap-3">
              {[
                'Generar tu diagnóstico personalizado de madurez digital',
                'Proporcionar recomendaciones específicas para tu empresa',
                'Mejorar continuamente nuestro instrumento de evaluación',
                'Realizar análisis estadísticos agregados y anónimos',
                'Contactarte en caso de que solicites información adicional',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: '#FF1493' }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seguridad */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Lock className="w-5 h-5" style={{ color: '#FF1493' }} />
              Medidas de Seguridad
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Hemos implementado medidas de seguridad administrativas, técnicas y físicas
              para proteger tus datos personales contra daño, pérdida, alteración,
              destrucción o uso no autorizado. Los datos se almacenan de forma segura
              y el acceso está restringido únicamente al personal autorizado.
            </p>
          </section>

          {/* Derechos ARCO */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Derechos ARCO
            </h2>
            <p className="text-muted-foreground mb-4">
              Tienes derecho a conocer qué datos personales tenemos de ti, para qué los
              utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es tu
              derecho solicitar la corrección de tu información personal en caso de que esté
              desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos
              de nuestros registros o bases de datos cuando consideres que la misma no está
              siendo utilizada conforme a los principios, deberes y obligaciones previstas
              en la normativa (Cancelación); así como oponerte al uso de tus datos personales
              para fines específicos (Oposición).
            </p>
            <p className="text-muted-foreground">
              Para ejercer cualquiera de estos derechos, puedes contactarnos a través del
              correo electrónico:{' '}
              <a
                href="mailto:privacidad@cluster.mx"
                className="underline hover:text-foreground transition-colors"
                style={{ color: '#FF1493' }}
              >
                privacidad@cluster.mx
              </a>
            </p>
          </section>

          {/* Modificaciones */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Modificaciones al Aviso de Privacidad
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de efectuar en cualquier momento modificaciones o
              actualizaciones al presente aviso de privacidad. Estas modificaciones estarán
              disponibles en esta misma página. Te recomendamos revisar periódicamente este
              aviso.
            </p>
          </section>

          {/* Contacto */}
          <section className="p-6 rounded-2xl bg-muted/50">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Si tienes alguna duda sobre este aviso de privacidad, puedes contactarnos:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-foreground">
                <span className="text-muted-foreground">Email: </span>
                <a
                  href="mailto:privacidad@cluster.mx"
                  className="underline"
                  style={{ color: '#FF1493' }}
                >
                  privacidad@cluster.mx
                </a>
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Teléfono: </span>
                [Número de contacto]
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Dirección: </span>
                [Dirección fiscal completa]
              </p>
            </div>
          </section>
        </div>

        {/* Back to evaluation */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button
              size="lg"
              className="px-8 py-6 rounded-2xl text-white"
              style={{ backgroundColor: '#FF1493' }}
            >
              Regresar a la evaluación
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 mt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Clúster Startups Puebla · Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
