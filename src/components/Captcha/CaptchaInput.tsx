const CaptchaInput = () => {
  return (
    <>
      <svg
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
        }}
      >
        <filter id='captcha-filter'>
          <feTurbulence
            type='turbulence'
            baseFrequency='0.002 0.008'
            numOctaves='2'
            seed='2'
            stitchTiles='stitch'
            result='turbulence'
          />
          <feColorMatrix
            type='saturate'
            values='30'
            in='turbulence'
            result='colormatrix'
          />
          <feColorMatrix
            type='matrix'
            values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 150 -15'
            in='colormatrix'
            result='colormatrix1'
          />
          <feComposite
            in='SourceGraphic'
            in2='colormatrix1'
            operator='in'
            result='composite'
          />
          <feDisplacementMap
            in='SourceGraphic'
            in2='colormatrix1'
            scale='15'
            xChannelSelector='R'
            yChannelSelector='A'
            result='displacementMap'
          />
        </filter>
      </svg>

      <div
        style={{
          whiteSpace: 'nowrap',
          filter: 'url(#captcha-filter)',
          outline: 'none',
        }}
      >
        Broken
      </div>
    </>
  )
}

export default CaptchaInput
