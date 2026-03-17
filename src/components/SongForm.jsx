import { useState } from 'react'

function SongForm({ onAdd }) {
  const [name, setName] = useState('')
  const [artist, setArtist] = useState('')
  const [keySig, setKeySig] = useState('')
  const [tempo, setTempo] = useState('')
  const [notes, setNotes] = useState('')
  const [chords, setChords] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchLyrics = async () => {
    if (!name || !artist) {
      alert('Please enter both artist and song name')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${name}`)
      const data = await response.json()
      if (data.lyrics) {
        setLyrics(data.lyrics)
      } else {
        alert('Lyrics not found!')
      }
    } catch (err) {
      alert('Error fetching lyrics. Check artist/song name.')
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
    <form onSubmit={submit} className="form">
      <input
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Artist"
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Song Name"
      />
      <input
        value={keySig}
        onChange={(e) => setKeySig(e.target.value)}
        placeholder="Key"
      />
      <input
        type="number"
        value={tempo}
        onChange={(e) => setTempo(e.target.value)}
        placeholder="Tempo BPM"
        min="1"
      />
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      <textarea
        className="textarea"
        rows="4"
        value={chords}
        onChange={(e) => setChords(e.target.value)}
        placeholder="Chords (e.g., | Am | G | F | E |)"
      />
      <div style={{ position: 'relative' }}>
        <textarea
          className="textarea"
          rows="6"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Lyrics (line by line; chords will show above)"
          style={{ paddingBottom: '3rem' }}
        />
        <button
          type="button"
          onClick={fetchLyrics}
          disabled={loading}
          className="btn btn-ghost"
          style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          {loading ? 'Fetching...' : 'Auto-fetch Lyrics'}
        </button>
      </div>
      <button type="submit" className="btn btn-primary">Add Song</button>
    </form>
  )
}

export default SongForm
