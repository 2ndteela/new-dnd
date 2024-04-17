import React, {useState} from 'react'
export default function Stats() {
  // const standardSet = [15, 14, 13, 12, 10, 8]
  // const [stats, setStats] = useState(standardSet)
  const [statLine, setStatLine] = useState('standard')

  return (
    <div>
      <div className='full-width-row' >
        <button className={statLine === 'standard' ? '' : 'outline-button'} onClick={() => setStatLine('standard')} >Standard Set</button>
        <button className={statLine !== 'standard' ? '' : 'outline-button'} onClick={() => setStatLine('rolls')} >Roll New Stats</button>
      </div>
    </div>
  )
}
