import React, {useState} from 'react'
import Button from '../../../components/Button/Button'
export default function Stats() {
  // const standardSet = [15, 14, 13, 12, 10, 8]
  // const [stats, setStats] = useState(standardSet)
  const [statLine, setStatLine] = useState('standard')

  return (
    <div>
      <div className='full-width-row stat-line-options' >
        <Button variant={statLine === 'standard' ? 'primary' : 'outline'} onClick={() => setStatLine('standard')} >Standard Set</Button>
        <Button variant={statLine !== 'standard' ? 'primary' : 'outline'} onClick={() => setStatLine('rolls')} >Roll New Stats</Button>
      </div>
    </div>
  )
}
