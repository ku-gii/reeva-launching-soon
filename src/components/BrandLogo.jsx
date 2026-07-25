export default function BrandLogo({ markOnly = false, className = '' }) {
  return (
    <img
      className={`brand-logo ${className}`}
      src={markOnly ? './assets/reeva-mark-final.png' : './assets/reeva-logo-final.png'}
      alt="REEVA"
      draggable="false"
    />
  )
}
