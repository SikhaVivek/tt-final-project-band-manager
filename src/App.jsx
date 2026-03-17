import { useState, useEffect } from 'react'
import './App.css'
import SongForm from './components/SongForm.jsx'
import SongList from './components/SongList.jsx'
import Setlist from './components/Setlist.jsx'
import PracticeTimer from './components/PracticeTimer.jsx'

function App() {
  const [songs, setSongs] = useState(() => {
    const savedSongs = localStorage.getItem('band-manager-songs')
    return savedSongs ? JSON.parse(savedSongs) : [
      { id: 1, name: 'Puvulalo Dagunna', artist: 'A.R. Rahman', key: 'A', tempo: 95, notes: 'Acoustic intro', chords: '| A | D | E | D |\n| A | D | E | A |', lyrics: 'Puvulalo dagunna prema\nEe hrudayamlo kaluvuna mana' },
      { id: 2, name: 'Asha Pasha', artist: 'Sid Sriram', key: 'Dm', tempo: 110, notes: 'Drums strong', chords: '| Dm | Bb | F | C |\n| Dm | Bb | F | C |', lyrics: 'Asha pasha bandhalu vidichesina vela\nKalala dharicheti prema' },
      { id: 3, name: 'Monna Kanipinchavu', artist: 'S.P. Balasubrahmanyam', key: 'G', tempo: 100, notes: '', chords: '', lyrics: '' }
    ]
  })
  const [setlist, setSetlist] = useState(() => {
    const savedSetlist = localStorage.getItem('band-manager-setlist')
    return savedSetlist ? JSON.parse(savedSetlist) : []
  })

  useEffect(() => {
    localStorage.setItem('band-manager-songs', JSON.stringify(songs))
  }, [songs])

  useEffect(() => {
    localStorage.setItem('band-manager-setlist', JSON.stringify(setlist))
  }, [setlist])

  const addSong = (song) => {
    const id = Date.now()
    setSongs(prev => [...prev, { id, ...song }])
  }
  const updateSong = (id, patch) => {
    setSongs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
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
      <h1>Band Practice Manager</h1>
      <div className="grid">
        <div className="panel">
          <h2>Add Song</h2>
          <SongForm onAdd={addSong} />
        </div>
        <div className="panel">
          <h2>Song List</h2>
          <SongList songs={songs} onAddToSetlist={addToSetlist} onUpdateSong={updateSong} />
        </div>
        <div className="panel">
          <h2>Setlist</h2>
          <Setlist
            songs={songs}
            setlist={setlist}
            onRemove={removeFromSetlist}
            onMove={moveInSetlist}
          />
        </div>
        <div className="panel">
          <h2>Practice Timer</h2>
          <PracticeTimer />
        </div>
      </div>
    </div>
  )
}

export default App
