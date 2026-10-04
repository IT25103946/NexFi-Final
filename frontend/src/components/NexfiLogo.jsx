export default function NexfiLogo({ className = '', size = 'md', showText = true }) {
  const sizeClasses = {
    sm: { container: 'h-8 gap-1.5', text: 'text-lg', svgSize: 32 },
    md: { container: 'h-10 gap-2', text: 'text-2xl sm:text-3xl', svgSize: 40 },
    lg: { container: 'h-12 gap-2.5', text: 'text-3xl sm:text-4xl', svgSize: 44 },
    xl: { container: 'h-16 gap-3', text: 'text-4xl sm:text-5xl', svgSize: 52 },
  }

  const currentSize = sizeClasses[size] || sizeClasses.md

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      <div className="relative logo-glow float-3d">
        <svg
          className="relative drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]"
          width={currentSize.svgSize}
          height={currentSize.svgSize}
          viewBox="0 0 100 100"
          fill="none"
        >
          <defs>
            <linearGradient id="coinGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="arrowGrad" x1="0" y1="100" x2="100" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          {/* 3D Coin Base */}
          <circle cx="45" cy="55" r="32" fill="url(#coinGrad)" opacity="0.95" />
          <circle
            cx="45"
            cy="55"
            r="22"
            stroke="#ffffff"
            strokeWidth="3"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.6"
          />
          <text
            x="45"
            y="66"
            fontFamily="Poppins, system-ui"
            fontWeight="900"
            fontSize="32"
            fill="#ffffff"
            textAnchor="middle"
          >
            $
          </text>
          {/* 3D Upward Growth Arrow */}
          <path
            d="M25 75 L55 45 L70 60 L90 20 L70 20 M90 20 L90 40"
            stroke="url(#arrowGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <div className="relative flex flex-col justify-center">
          <span
            className={`font-logo font-black tracking-tight ${currentSize.text} select-none`}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 50%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 20px rgba(16, 185, 129, 0.35), 0 0 60px rgba(34, 211, 238, 0.2)',
              letterSpacing: '0.05em',
            }}
          >
            NEXFI
          </span>
        </div>
      )}
    </div>
  )
}
