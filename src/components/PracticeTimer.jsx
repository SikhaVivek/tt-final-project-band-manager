import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'

function PracticeTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    
    const parts = [hrs, mins, secs].map(v => v.toString().padStart(2, '0'))
    if (hrs === 0) parts.shift()
    return parts.join(':')
  }

  return (
    <div className="timer-container">
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div className={`timer-display ${isActive ? 'active' : ''}`} style={{ transition: 'all 0.5s ease' }}>
          {formatTime(seconds)}
        </div>
        <div style={{ 
          position: 'absolute', 
          top: '-1rem', 
          right: '-1rem', 
          background: isActive ? 'var(--primary)' : 'var(--text-dim)', 
          padding: '0.2rem 0.5rem', 
          borderRadius: '4px', 
          fontSize: '0.6rem', 
          fontWeight: 900, 
          color: '#000',
          boxShadow: isActive ? '0 0 10px var(--primary)' : 'none'
        }}>
          {isActive ? 'RECORDING' : 'IDLE'}
        </div>
      </div>
      
      <div className="timer-controls">
        <button 
          className={isActive ? "btn-ghost" : "btn-primary"} 
          onClick={() => setIsActive(!isActive)}
          style={{ width: '140px' }}
        >
          {isActive ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
        </button>
        <button 
          className="btn-ghost" 
          onClick={() => { setSeconds(0); setIsActive(false); }}
          title="Reset Session"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      
      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <Clock size={12} /> Total Practice Time
      </div>
    </div>
  )
}

export default PracticeTimer
