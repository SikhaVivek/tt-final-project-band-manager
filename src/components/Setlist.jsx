import { useState } from 'react'
import { ChevronUp, ChevronDown, X, Music, Activity, Key as KeyIcon, Maximize2, Minimize2, Sparkles, RefreshCw } from 'lucide-react'

function Setlist({ songs, setlist, onRemove, onMove, onUpdateSong }) {
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [syncingId, setSyncingId] = useState(null)

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const handleAISync = async (e, song) => {
    e.stopPropagation()
    setSyncingId(song.id)
    const API_URL = 'http://127.0.0.1:5001/api'
    
    try {
      const response = await fetch(`${API_URL}/ai/fetch?name=${encodeURIComponent(song.name)}&artist=${encodeURIComponent(song.artist || '')}`)
      if (response.ok) {
        const data = await response.json()
        if (data.chords_lyrics) {
          onUpdateSong(song.id, { 
            lyrics: data.chords_lyrics,
            song_key: data.key || song.song_key,
            tempo: data.tempo || song.tempo
          })
        }
      } else {
        alert('AI could not find lyrics/chords for this track yet.')
      }
    } catch (err) {
      console.error('AI Sync failed')
    } finally {
      setSyncingId(null)
    }
  }

  return (
    <div className="setlist-items">
      {setlist.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed', padding: '3rem' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Setlist Empty</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Queue tracks from the library console</p>
        </div>
      ) : (
        setlist.map((songId, index) => {
          const song = songs.find(s => s.id === songId)
          if (!song) return null

          const isExpanded = expandedIndex === index
          const isSyncing = syncingId === song.id

          return (
            <div 
              key={`${songId}-${index}`} 
              className={`setlist-item-container ${isExpanded ? 'expanded' : ''}`} 
              style={{ 
                marginBottom: '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                className="setlist-item" 
                onClick={() => toggleExpand(index)}
                style={{ 
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: isExpanded ? 'var(--primary)' : 'var(--panel-border)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--panel-border)'
                }}
              >
                <div className="index" style={{ color: isExpanded ? 'var(--primary)' : 'var(--text-dim)', fontWeight: 900, marginRight: '1.5rem', width: '1.5rem' }}>
                  {index + 1}
                </div>
                
                <div className="details" style={{ flex: 1 }}>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{song.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {song.artist || 'Unknown'} • <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{song.song_key || song.key}</span> • {song.tempo} BPM
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                  {!song.lyrics && (
                    <button 
                      className="btn-ghost" 
                      style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.6rem', color: 'var(--primary)', borderColor: 'var(--primary-glow)' }}
                      onClick={(e) => handleAISync(e, song)}
                      disabled={isSyncing}
                    >
                      {isSyncing ? <RefreshCw size={10} className="animate-spin" /> : <><Sparkles size={10} /> AI SYNC</>}
                    </button>
                  )}
                  <button 
                    className="btn-ghost" 
                    style={{ padding: '0.4rem', borderRadius: '6px' }} 
                    onClick={() => onMove(index, index - 1)}
                    disabled={index === 0}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button 
                    className="btn-ghost" 
                    style={{ padding: '0.4rem', borderRadius: '6px' }} 
                    onClick={() => onMove(index, index + 1)}
                    disabled={index === setlist.length - 1}
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button 
                    className="btn-danger" 
                    style={{ padding: '0.4rem', borderRadius: '6px', marginLeft: '0.5rem' }} 
                    onClick={() => onRemove(index)}
                  >
                    <X size={14} />
                  </button>
                  <div style={{ marginLeft: '0.5rem', color: 'var(--text-dim)' }}>
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </div>
                </div>
              </div>
              
              {/* Expanded performance view */}
              {isExpanded && (
                <div className="performance-view animate-in slide-in-from-top-2 duration-300" style={{
                  marginTop: '0.5rem',
                  padding: '1.5rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--panel-border)',
                  borderTop: 'none',
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0
                }}>
                  {/* Performance Meta Header */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    marginBottom: '1.5rem', 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <KeyIcon size={16} color="var(--secondary)" />
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Key</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--secondary)' }}>{song.song_key || song.key}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Activity size={16} color="var(--primary)" />
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tempo</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>{song.tempo} BPM</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Music size={16} color="var(--text-muted)" />
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Artist</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{song.artist || 'Independent'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Chords & Lyrics Console */}
                  {song.lyrics ? (
                    <div className="content-viewer studio-console" style={{ 
                      maxHeight: '500px', 
                      overflowY: 'auto',
                      background: '#000',
                      padding: '2rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                    }}>
                      <pre style={{ 
                        fontFamily: "'JetBrains Mono', monospace", 
                        fontSize: '0.85rem', 
                        margin: 0,
                        color: 'var(--text-main)',
                        lineHeight: '1.6',
                        whiteSpace: 'pre'
                      }}>
                        {song.lyrics}
                      </pre>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <p>No lyrics or chords synced for this track.</p>
                      <button 
                        className="btn-primary" 
                        onClick={(e) => handleAISync(e, song)}
                        disabled={isSyncing}
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}
                      >
                        {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <><Sparkles size={14} /> Sync with AI Now</>}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default Setlist
