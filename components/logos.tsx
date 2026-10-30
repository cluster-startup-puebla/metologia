// Componentes de Logo SVG Placeholder
import Image from 'next/image'

export function ClusterLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 40"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="10" width="20" height="20" rx="4" />
      <rect x="25" y="5" width="15" height="15" rx="3" opacity="0.7" />
      <rect x="25" y="22" width="15" height="13" rx="3" opacity="0.5" />
      <text x="45" y="18" fontSize="10" fontWeight="600" fontFamily="system-ui">
        CLÚSTER DE
      </text>
      <text x="45" y="30" fontSize="9" fontWeight="500" fontFamily="system-ui">
        STARTUPS PUEBLA
      </text>
    </svg>
  )
}

export function SecihtiLogo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/secihti.png"
      alt="SECIHTI - Secretaría de Ciencia, Humanidades, Tecnología e Innovación"
      width={200}
      height={60}
      className={className}
      style={{ objectFit: 'contain', width: 'auto' }}
    />
  )
}
