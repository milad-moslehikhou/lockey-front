import React from 'react'

interface TextWithLineBreaksProps {
  text: string | undefined
}

const TextWithLineBreaks = ({ text }: TextWithLineBreaksProps) => {
  if (!text) return <></>
  const textWithBreaks = text.split('\n').map((text, index) => (
    <React.Fragment key={index}>
      {text}
      <br />
    </React.Fragment>
  ))

  return <>{textWithBreaks}</>
}

export default TextWithLineBreaks
