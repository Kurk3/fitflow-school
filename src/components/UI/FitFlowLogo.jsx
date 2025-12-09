function FitFlowLogo({ size = 'default', showText = true, className = '' }) {
  const sizes = {
    small: { icon: 'w-4 h-4', container: 'p-1.5', text: 'text-sm' },
    default: { icon: 'w-5 h-5', container: 'p-2', text: 'text-lg' },
    large: { icon: 'w-7 h-7', container: 'p-3', text: 'text-2xl' }
  }

  const s = sizes[size] || sizes.default

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${s.container} bg-neutral-900 rounded-lg`}>
        <svg className={`${s.icon} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
        </svg>
      </div>
      {showText && (
        <div className="hidden sm:block">
          <h1 className={`${s.text} font-bold text-neutral-900`}>FitFlow</h1>
        </div>
      )}
    </div>
  )
}

export default FitFlowLogo
