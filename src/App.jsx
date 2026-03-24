import { useState, useEffect } from 'react'
import './App.css'
import SongForm from './components/SongForm.jsx'
import SongList from './components/SongList.jsx'
import Setlist from './components/Setlist.jsx'
import PracticeTimer from './components/PracticeTimer.jsx'
import { Music, ListMusic, Timer, Plus, LayoutDashboard, Sparkles } from 'lucide-react'

function App() {
  const [songs, setSongs] = useState([])
  const [setlist, setSetlist] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = 'http://127.0.0.1:5001/api'

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchSongs(), fetchSetlist()])
      setLoading(false)
    }
    init()
  }, [])

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${API_URL}/songs`)
      if (response.ok) {
        const data = await response.json()
        setSongs(data)
      } else {
        const savedSongs = localStorage.getItem('band-manager-songs')
        if (savedSongs) setSongs(JSON.parse(savedSongs))
      }
    } catch (error) {
      console.error('Failed to fetch songs:', error)
      const savedSongs = localStorage.getItem('band-manager-songs')
      if (savedSongs) setSongs(JSON.parse(savedSongs))
    }
  }

  const fetchSetlist = async () => {
    try {
      const response = await fetch(`${API_URL}/setlist`)
      if (response.ok) {
        const data = await response.json()
        setSetlist(data)
      } else {
        const savedSetlist = localStorage.getItem('band-manager-setlist')
        if (savedSetlist) setSetlist(JSON.parse(savedSetlist))
      }
    } catch (error) {
      console.error('Failed to fetch setlist:', error)
      const savedSetlist = localStorage.getItem('band-manager-setlist')
      if (savedSetlist) setSetlist(JSON.parse(savedSetlist))
    }
  }

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('band-manager-songs', JSON.stringify(songs))
    }
  }, [songs, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('band-manager-setlist', JSON.stringify(setlist))
      syncSetlist(setlist)
    }
  }, [setlist, loading])

  const syncSetlist = async (newList) => {
    try {
      await fetch(`${API_URL}/setlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_ids: newList })
      })
    } catch (error) {
      console.error('Failed to sync setlist:', error)
    }
  }

  const addSong = async (songData) => {
    const backendData = {
      ...songData,
      song_key: songData.key
    }
    delete backendData.key

    try {
      const response = await fetch(`${API_URL}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData)
      })
      if (response.ok) {
        const newSong = await response.json()
        setSongs(prev => [...prev, newSong])
      } else {
        const id = Date.now()
        setSongs(prev => [...prev, { id, ...songData }])
      }
    } catch (error) {
      const id = Date.now()
      setSongs(prev => [...prev, { id, ...songData }])
    }
  }

  const updateSong = async (id, patch) => {
    try {
      const response = await fetch(`${API_URL}/songs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      })
      if (response.ok) {
        setSongs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
      } else {
        setSongs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
      }
    } catch (error) {
      setSongs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
    }
  }

  const deleteSong = async (id) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return
    try {
      const response = await fetch(`${API_URL}/songs/${id}`, {
        method: 'DELETE'
      })
      
      // Update local state regardless of server response for immediate UI feedback, 
      // or if we are in localStorage fallback mode
      setSongs(prev => prev.filter(s => s.id !== id))
      setSetlist(prev => prev.filter(songId => songId !== id))

      if (!response.ok) {
        console.warn('Failed to delete song on server, but updated locally.')
      }
    } catch (error) {
      console.error('Failed to delete song on server, updating locally:', error)
      setSongs(prev => prev.filter(s => s.id !== id))
      setSetlist(prev => prev.filter(songId => songId !== id))
    }
  }

  const addToSetlist = (songId) => {
    const exists = setlist.find(s => s === songId)
    if (!exists) setSetlist(prev => [...prev, songId])
  }

  const removeFromSetlist = (index) => {
    setSetlist(prev => prev.filter((_, i) => i !== index))
  }

  const moveInSetlist = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= setlist.length) return
    const next = [...setlist]
    const [item] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, item)
    setSetlist(next)
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Band Practice <span className="text-gradient">Studio</span></h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginTop: '-1rem' }}>
            <Sparkles size={14} style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
            AI-Enhanced Performance Management
          </p>
        </div>
        <div className="panel" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Studio Active</span>
        </div>
      </header>
      
      <div className="dashboard">
        <aside className="sidebar">
          <section className="panel">
            <div className="panel-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Plus size={20} color="var(--primary)" /> Add Song
              </h2>
            </div>
            <SongForm onAdd={addSong} />
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Timer size={20} color="var(--primary)" /> Timer
              </h2>
            </div>
            <PracticeTimer />
          </section>
        </aside>

        <main className="main-content">
          <section className="panel">
            <div className="panel-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ListMusic size={20} color="var(--secondary)" /> Setlist
              </h2>
              <span className="badge badge-secondary">{setlist.length} Tracks</span>
            </div>
            <Setlist
              songs={songs}
              setlist={setlist}
              onRemove={removeFromSetlist}
              onMove={moveInSetlist}
              onUpdateSong={updateSong}
            />
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Music size={20} color="var(--primary)" /> Library
              </h2>
              <span className="badge badge-primary">{songs.length} Songs</span>
            </div>
            <SongList 
              songs={songs} 
              onAddToSetlist={addToSetlist} 
              onUpdateSong={updateSong} 
              onDeleteSong={deleteSong}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
  