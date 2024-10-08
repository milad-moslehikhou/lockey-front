import React from 'react'

import './NotFound.css'
import { Link } from '@mui/material'

export default function NotFound() {
  return (
    <div id='notfound'>
      <div className='notfound'>
        <h2>404 - Page not found</h2>
        <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
        <Link href={'/app/credentials'}>home page</Link>
      </div>
    </div>
  )
}
