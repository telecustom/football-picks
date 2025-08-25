import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Picks() {
  const [games, setGames] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [weekNo, setWeekNo] = useState(1)
  const [playerName, setPlayerName] = useState('')
  const [message, setMessage] = useState('')

  // Load all games for the week
  useEffect(() => {
    async function loadGames() {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('week_no', weekNo)
      if (error) console.error(error)
      else setGames(data)
    }
    loadGames()
  }, [weekNo])

  async function submitPick(e) {
    e.preventDefault()
    const { data, error } = await supabase.from('picks').insert([
      {
        player_name: playerName,
        week_no: weekNo,
        team: selectedTeam,
        multiplier: 1
      }
    ])
    if (error) {
      setMessage('Error: ' + error.message)
      console.error(error)
    } else {
      setMessage('Pick submitted!')
    }
  }

  return (
    <div>
      <h1>Submit Your Pick</h1>
      <form onSubmit={submitPick}>
        <input
          type="text"
          placeholder="Your Name or Handle"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        />
        <select value={weekNo} onChange={(e) => setWeekNo(Number(e.target.value))}>
          {[...Array(18).keys()].map(n => (
            <option key={n+1} value={n+1}>Week {n+1}</option>
          ))}
        </select>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} required>
          <option value="">Select a team</option>
          {games.map(g => (
            <option key={g.id} value={g.home_team}>{g.home_team}</option>
          ))}
        </select>
        <button type="submit">Submit Pick</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
