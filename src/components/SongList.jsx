import { useState } from 'react'
import { Edit2, Trash2, Plus, Search, X, Check, ExternalLink, Sparkles } from 'lucide-react'

function SongList({ songs, onAddToSetlist, onUpdateSong, onDeleteSong }) {
  const [editingId, setEditingId] = useState(null)
  const [draftLyrics, setDraftLyrics] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const lyricsUrl = (name, artist) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${artist ? `${artist} ` : ''}${name} lyrics chords`)}`

  const startEdit = (song) => {
    setEditingId(song.id)
    setDraftLyrics(song.lyrics || '')
  }

  const save = () => {
    if (editingId == null) return
    onUpdateSong(editingId, { lyrics: draftLyrics })
    setEditingId(null)
    setDraftLyrics('')
  }

  const cancel = () => {
    setEditingId(null)
    setDraftLyrics('')
  }

  const filteredSongs = songs.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.artist && s.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input 
          style={{ paddingLeft: '3.5rem' }}
          placeholder="Search library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="song-list">
        {filteredSongs.map((s) => {
          const isEditing = editingId === s.id
          const displayKey = s.song_key || s.key
          return (
            <div key={s.id} className="song-card">
              <div className="song-card-header">
                <div className="song-info">
                  <h3>{s.name}</h3>
                  <p>{s.artist || 'Independent Artist'}</p>
                </div>
                <div className="song-badges">
                  <span className="badge badge-primary">{displayKey}</span>
                  <span className="badge badge-secondary">{s.tempo} BPM</span>
                </div>
              </div>

              {s.notes && (
                <div className="notes" style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  Note: {s.notes}
                </div>
              )}

              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.7rem' }}>Lyrics & Chords (Studio Console)</label>
                    <textarea
                      rows="10"
                      value={draftLyrics}
                      onChange={(e) => setDraftLyrics(e.target.value)}
                      placeholder="Enter chords above lyrics..."
                      style={{ 
                        fontFamily: "'JetBrains Mono', monospace", 
                        fontSize: '0.75rem',
                        whiteSpace: 'pre',
                        overflowX: 'auto'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-primary" style={{ flex: 1, padding: '0.6rem' }} onClick={save}><Check size={14} /> Save</button>
                    <button className="btn-ghost" style={{ flex: 1, padding: '0.6rem' }} onClick={cancel}><X size={14} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {s.lyrics && (
                    <div className="content-viewer" style={{ 
                      maxHeight: '300px', 
                      overflowY: 'auto',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--panel-border)'
                    }}>
                      <pre style={{ 
                        fontFamily: "'JetBrains Mono', monospace", 
                        fontSize: '0.75rem', 
                        margin: 0,
                        color: 'var(--text-main)',
                        lineHeight: '1.5'
                      }}>
                        {s.lyrics}
                      </pre>
                    </div>
                  )}
                  <div className="song-actions">
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => onAddToSetlist(s.id)}>
                      <Plus size={14} /> Add to Setlist
                    </button>
                    <button className="btn-ghost" style={{ padding: '0.75rem' }} onClick={() => startEdit(s)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <a
                      className="btn-ghost"
                      href={lyricsUrl(s.name, s.artist)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Studio Search"
                      style={{ padding: '0.75rem' }}
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button className="btn-danger" style={{ padding: '0.75rem' }} onClick={() => onDeleteSong(s.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SongList
