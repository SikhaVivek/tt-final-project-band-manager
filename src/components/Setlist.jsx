function Setlist({ songs, setlist, onRemove, onMove }) {
  const songById = (id) => songs.find(s => s.id === id)
  return (
    <div className="list">
      {setlist.map((id, idx) => {
        const s = songById(id)
        if (!s) return null
        return (
          <div key={idx} className="card">
            <div className="row">
              <div className="title">{idx + 1}. {s.name}</div>
              <div className="row">
                <button className="btn btn-ghost" aria-label="Move up" onClick={() => onMove(idx, idx - 1)}>↑</button>
                <button className="btn btn-ghost" aria-label="Move down" onClick={() => onMove(idx, idx + 1)}>↓</button>
                <button className="btn" onClick={() => onRemove(idx)}>Remove</button>
              </div>
            </div>
            <div className="meta">
              <span className="badge accent">Key: {s.key}</span>
              <span className="badge warm">Tempo: {s.tempo} BPM</span>
            </div>
          </div>
        )
      })}
      {setlist.length === 0 ? <div>No songs in setlist</div> : null}
    </div>
  )
}

export default Setlist
