import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>NicheMonitor</h1>
            <p>Frontend Verification App</p>
            <div style={{ padding: '20px' }}>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
            <p>
                Edit <code>src/App.jsx</code> and save to test HMR
            </p>
        </div>
    )
}

export default App
