import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [tasks, setTasks] = useState([
    { id: 1, type: 'did_post', name: 'Did they post about X?', param: '', result: null, loading: false },
    { id: 2, type: 'bio_contains', name: 'Does bio contain X?', param: '', result: null, loading: false },
    { id: 3, type: 'did_like', name: 'Did they like tweet (URL)?', param: '', result: null, loading: false },
    { id: 4, type: 'did_retweet', name: 'Did they Retweet or Quote (URL)?', param: '', result: null, loading: false }
  ])

  const handleParamChange = (id, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, param: value } : t))
  }

  const checkTask = async (task) => {
    if (!username) return alert("Enter a username")
    if (!task.param) return alert("Enter a parameter")

    setTasks(tasks.map(t => t.id === task.id ? { ...t, loading: true, result: null } : t))

    try {
      const response = await fetch('http://localhost:3001/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          task: task.type,
          param: task.param
        })
      })
      const data = await response.json()
      setTasks(tasks.map(t => t.id === task.id ? { 
        ...t, 
        loading: false, 
        result: data 
      } : t))
    } catch (e) {
      alert("Error connecting to backend")
      console.error(e)
      setTasks(tasks.map(t => t.id === task.id ? { ...t, loading: false } : t))
    }
  }

  return (
    <div className="card">
      <h1>Agent Twitter Check</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Target Username (no @): </label>
        <input 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          placeholder="example"
          style={{ padding: '10px', fontSize: '16px', width: '100%', maxWidth: '300px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ 
            border: '1px solid #333', 
            padding: '1rem', 
            borderRadius: '8px',
            background: '#1a1a1a',
            textAlign: 'left'
          }}>
            <h3 style={{ marginTop: 0 }}>{task.name}</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                value={task.param} 
                onChange={e => handleParamChange(task.id, e.target.value)}
                placeholder="Search term..."
                style={{ flex: 1, padding: '8px' }}
              />
              <button 
                onClick={() => checkTask(task)}
                disabled={task.loading}
              >
                {task.loading ? '...' : 'Check'}
              </button>
            </div>
            
            {task.result && (
              <div style={{ marginTop: '10px', padding: '10px', background: task.result.result ? '#0f5132' : '#842029', borderRadius: '4px' }}>
                <strong>{task.result.result ? 'VERIFIED' : 'NEGATIVE'}</strong>
                <div style={{ fontSize: '0.9em', opacity: 0.9, marginTop: '5px' }}>{task.result.details}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
