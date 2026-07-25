import { forwardRef } from 'react'

const SceneFrame = forwardRef(function SceneFrame(
  { image, className = '', children, label },
  ref,
) {
  return (
    <section
      ref={ref}
      className={`scene-frame ${className}`}
      aria-label={label}
      style={{ '--scene-image': `url("${image}")` }}
    >
      <div className="ambient-backdrop" />
      <div className="art-stage">
        <img className="art-image" src={image} alt="" draggable="false" />
        <div className="art-glaze" />
        {children}
      </div>
    </section>
  )
})

export default SceneFrame
