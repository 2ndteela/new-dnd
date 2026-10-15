import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import { useLocalValue, writeLocal } from '../../assets/storage'
import './GuestBanner.css'

export default function GuestBanner() {
  const navigate = useNavigate()
  const uid = useLocalValue('uid')
  const guest = useLocalValue('guest')
  const dismissed = useLocalValue('guestBannerDismissed')

  if (uid || guest !== true || dismissed) return null

  return (
    <div className='guest-banner' role='status'>
      <div className='guest-banner-text'>
        You're in guest mode. Changes are only saved on this device and won't be available on other devices unless you
        {' '}<button className='guest-banner-link' onClick={() => navigate('/')}>sign in</button>.
      </div>
      <button className='guest-banner-close' aria-label='Dismiss' onClick={() => writeLocal('guestBannerDismissed', true)}>
        <MdClose />
      </button>
    </div>
  )
}
