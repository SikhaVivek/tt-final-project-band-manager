import { useState } from 'react'

function SongForm({ onAdd }) {
  const [name, setName] = useState('')
  const [keySig, setKeySig] = useState('')
  const [tempo, setTempo] = useState('')
  const [notes, setNotes] = useState('')
  const [chords, setChords] = useState('')
  const [lyrics, setLyrics] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name || !keySig || !tempo) return
    onAdd({ name, key: keySig, tempo: Number(tempo), notes, chords, lyrics })
    setName('')
    setKeySig('')
    setTempo('')
    setNotes('')
    setChords('')
    setLyrics('')
  }

  return (
    <form onSubmit={submit} className="form">
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
      <textarea
        className="textarea"
        rows="6"
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        placeholder="Lyrics (line by line; chords will show above)"
      />
      <button type="submit" className="btn btn-primary">Add Song</button>
    </form>
  )
}

export default SongForm
