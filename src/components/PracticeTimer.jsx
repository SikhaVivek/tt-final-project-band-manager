import { useEffect, useRef, useState } from 'react'

function PracticeTimer() {
  const [minutes, setMinutes] = useState(10)
  const [remaining, setRemaining] = useState(10 * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  useEffect(() => {
    if (!running) setRemaining(minutes * 60)
  }, [minutes, running])

  const start = () => setRunning(true)
  const stop = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setRemaining(minutes * 60)
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const total = Math.max(1, minutes * 60)
  const pct = Math.max(0, Math.min(1, remaining / total))
  const deg = Math.round(pct * 360)

  return (
    <div className="timer">
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: '999px',
          background: `conic-gradient(var(--accent) ${deg}deg, #2a3140 ${deg}deg)`,
          display: 'grid',
          placeItems: 'center',
          border: '1px solid #30384a'
        }}
      >
        <div className="time">{mm}:{ss}</div>
      </div>
      <div className="controls">
        <input
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
        <button className="btn btn-primary" onClick={start} disabled={running}>Start</button>
        <button className="btn" onClick={stop} disabled={!running}>Stop</button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

export default PracticeTimer
