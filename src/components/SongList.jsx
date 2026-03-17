import { useState } from 'react'

function SongList({ songs, onAddToSetlist, onUpdateSong }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  const [draftLyrics, setDraftLyrics] = useState('')
  const [loading, setLoading] = useState(false)

  const lyricsUrl = (name, artist) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${artist ? `${artist} ` : ''}${name} lyrics`)}`

  const fetchLyrics = async (song) => {
    if (!song.name || !song.artist) {
      alert('Artist and song name are required to fetch lyrics automatically.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${song.artist}/${song.name}`)
      const data = await response.json()
      if (data.lyrics) {
        setDraftLyrics(data.lyrics)
      } else {
        alert('Lyrics not found!')
      }
    } catch (err) {
      alert('Error fetching lyrics. Check artist/song name.')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (song) => {
    setEditingId(song.id)
    setDraft(song.chords || '')
    setDraftLyrics(song.lyrics || '')
  }
  const save = () => {
    if (editingId == null) return
    onUpdateSong(editingId, { chords: draft, lyrics: draftLyrics })
    setEditingId(null)
    setDraft('')
    setDraftLyrics('')
  }
  const cancel = () => {
    setEditingId(null)
    setDraft('')
    setDraftLyrics('')
  }

  return (
    <div className="list">
      {songs.map((s) => {
        const isEditing = editingId === s.id
        return (
          <div key={s.id} className="card">
            <div className="row">
              <div className="title">
                {s.name} {s.artist ? <span style={{ opacity: 0.6, fontSize: '0.9em', fontWeight: 400 }}>by {s.artist}</span> : null}
              </div>
              <div className="row">
                <a
                  className="btn"
                  href={lyricsUrl(s.name, s.artist)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Google in new tab"
                >
                  Find Lyrics
                </a>
                <button className="btn btn-ghost" onClick={() => startEdit(s)} disabled={isEditing}>Edit Lyrics/Chords</button>
                <button className="btn btn-primary" onClick={() => onAddToSetlist(s.id)}>Add to Setlist</button>
              </div>
            </div>
            <div className="meta">
              <span className="badge accent">Key: {s.key}</span>
              <span className="badge warm">Tempo: {s.tempo} BPM</span>
            </div>
            {s.notes ? <div className="notes">{s.notes}</div> : null}
            {isEditing ? (
              <div style={{ marginTop: '.5rem', display: 'grid', gap: '.5rem' }}>
                <textarea
                  className="textarea"
                  rows="4"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Chords (e.g., | Am | G | F | E |)"
                />
                <div style={{ position: 'relative' }}>
                  <textarea
                    className="textarea"
                    rows="6"
                    value={draftLyrics}
                    onChange={(e) => setDraftLyrics(e.target.value)}
                    placeholder="Lyrics (line by line; chords will show above)"
                    style={{ paddingBottom: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => fetchLyrics(s)}
                    disabled={loading}
                    className="btn btn-ghost"
                    style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    {loading ? 'Fetching...' : 'Auto-fetch Lyrics'}
                  </button>
                </div>
                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost" onClick={cancel}>Cancel</button>
                  <button className="btn btn-primary" onClick={save}>Save</button>
                </div>
              </div>
            ) : (
              (s.chords || s.lyrics) ? (
                <div className="lyrics-block">
                  {Array.from({ length: Math.max((s.chords || '').split('\n').length, (s.lyrics || '').split('\n').length) }).map((_, i) => {
                    const c = (s.chords || '').split('\n')[i] || ''
                    const l = (s.lyrics || '').split('\n')[i] || ''
                    return (
                      <div key={i} className="pair">
                        <pre className="chords line">{c}</pre>
                        <div className="lyric line">{l}</div>
                      </div>
                    )
                  })}
                </div>
              ) : null
            )}
          </div>
        )
      })}
      {songs.length === 0 ? <div>No songs yet</div> : null}
    </div>
  )
}

export default SongList
