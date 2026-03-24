import { useState, useEffect } from 'react'
import { Music, User, Key, Activity, FileText, Send, Sparkles, RefreshCw } from 'lucide-react'

function SongForm({ onAdd }) {
  const [name, setName] = useState('')
  const [artist, setArtist] = useState('')
  const [keySig, setKeySig] = useState('')
  const [tempo, setTempo] = useState('')
  const [notes, setNotes] = useState('')
  const [chords, setChords] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = 'http://127.0.0.1:5001/api'

  // AI Chord Progression Generator
  const generateChords = (key) => {
    if (!key) return ''
    const cleanKey = key.trim().charAt(0).toUpperCase() + key.trim().slice(1).toLowerCase()
    const keyMap = {
      'C': '| C | F | G | Am |',
      'G': '| G | C | D | Em |',
      'D': '| D | G | A | Bm |',
      'A': '| A | D | E | F#m |',
      'E': '| E | A | B | C#m |',
      'F': '| F | Bb | C | Dm |',
      'Am': '| Am | F | C | G |',
      'Em': '| Em | C | G | D |',
      'Dm': '| Dm | Bb | F | C |',
      'Bm': '| Bm | G | D | A |',
      'Gm': '| Gm | Eb | Bb | F |',
      'Cm': '| Cm | Ab | Eb | Bb |'
    }
    return keyMap[cleanKey] || `| ${cleanKey} | IV | V | vi |`
  }

  useEffect(() => {
    if (keySig && !chords) {
      setChords(generateChords(keySig))
    }
  }, [keySig])

  // Automatic AI Fetching (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-fetch if name is long enough, even if artist is missing
      if (name.length > 3 && !lyrics && !loading) {
        autoFetchStudioAI()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [name])

  const autoFetchStudioAI = async () => {
    if (!name || name.length < 3) return
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/ai/fetch?name=${encodeURIComponent(name)}&artist=${encodeURIComponent(artist || '')}&key=${encodeURIComponent(keySig || '')}`)
      if (response.ok) {
        const data = await response.json()
        if (data.chords_lyrics) {
          setLyrics(data.chords_lyrics)
          if (data.key && !keySig) setKeySig(data.key)
          if (data.tempo && !tempo) setTempo(data.tempo.toString())
          setChords('') // Clear temporary chords since we have the full sheet
        }
      } else {
        // Fallback to plain lyrics if artist exists
        if (artist) {
          const plainResponse = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(name)}`)
          const plainData = await plainResponse.json()
          if (plainData.lyrics) {
            setLyrics(plainData.lyrics)
          }
        }
      }
    } catch (err) {
      console.error('AI Studio Fetch failed')
    } finally {
      setLoading(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!name || !keySig || !tempo) return
    onAdd({ name, artist, key: keySig, tempo: Number(tempo), notes, chords, lyrics })
    setName('')
    setArtist('')
    setKeySig('')
    setTempo('')
    setNotes('')
    setChords('')
    setLyrics('')
  }

  return (
    <form onSubmit={submit} className="song-form">
      <div className="form-group">
        <label><Music size={12} style={{ marginRight: 6 }} /> Song Title *</label>
        <div style={{ position: 'relative' }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Enter Sandman"
            required
          />
          {loading && <div className="animate-pulse" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 800 }}>AI SYNCING...</div>}
        </div>
      </div>

      <div className="form-group">
        <label><User size={12} style={{ marginRight: 6 }} /> Artist</label>
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="e.g. Metallica"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label><Key size={12} style={{ marginRight: 6 }} /> Key *</label>
          <input
            value={keySig}
            onChange={(e) => setKeySig(e.target.value)}
            placeholder="e.g. E5"
            required
          />
        </div>
        <div className="form-group">
          <label><Activity size={12} style={{ marginRight: 6 }} /> BPM *</label>
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            placeholder="120"
            min="1"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label><FileText size={12} style={{ marginRight: 6 }} /> Extra Notes</label>
        <textarea
          rows="1"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Heavy distortion"
        />
      </div>

      <div className="form-group">
        <label>Lyrics & Chords Console</label>
        <div style={{ position: 'relative' }}>
          <textarea
            rows="8"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="AI will automatically fetch chords over lyrics..."
            style={{ 
              fontFamily: "'JetBrains Mono', monospace", 
              fontSize: '0.75rem',
              whiteSpace: 'pre',
              overflowX: 'auto',
              background: 'rgba(0,0,0,0.3)'
            }}
          />
          <button
            type="button"
            onClick={autoFetchStudioAI}
            disabled={loading}
            className="btn-ghost"
            style={{ 
              position: 'absolute', 
              bottom: '0.75rem', 
              right: '0.75rem', 
              padding: '0.5rem 1rem', 
              fontSize: '0.7rem', 
              borderRadius: 'var(--radius-sm)',
              background: 'var(--panel-bg)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {loading ? <RefreshCw size={12} className="animate-spin" /> : <><Sparkles size={12} /> Sync with AI</>}
          </button>
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
        <Send size={16} /> Add to Studio Library
      </button>
    </form>
  )
}

export default SongForm
