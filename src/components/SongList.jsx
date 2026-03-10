import { useState } from 'react'

function SongList({ songs, onAddToSetlist, onUpdateSong }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  const [draftLyrics, setDraftLyrics] = useState('')

  const lyricsUrl = (name) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${name} lyrics`)}`

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
              <div className="title">{s.name}</div>
              <div className="row">
                <a
                  className="btn"
                  href={lyricsUrl(s.name)}
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
                <textarea
                  className="textarea"
                  rows="6"
                  value={draftLyrics}
                  onChange={(e) => setDraftLyrics(e.target.value)}
                  placeholder="Lyrics (line by line; chords will show above)"
                />
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
