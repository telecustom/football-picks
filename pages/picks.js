import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Picks() {
  const [games, setGames] = useState([])
  const [playerName, setPlayerName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [message, setMessage] = useState('')
  const [currentWeek, setCurrentWeek] = useState(null)

  useEffect(() => {
    async function loadWeekAndGames() {
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'current_week')
        .single()
      const week = parseInt(settings.value, 10)
      setCurrentWeek(week)

      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .eq('week_no', week)
      setGames(gamesData)
    }
    loadWeekAndGames()
  }, [])

  async function submitPick(e) {
    e.preventDefault()
    if (!currentWeek) return

    const { data, error } = await supabase.from('picks').insert([
      {
        player_name: playerName,
        week_no: currentWeek,
        team: selectedTeam,
        multiplier: 1
      }
    ])
    if (error) setMessage('Error: ' + error.message)
    else setMessage('Pick submitted!')
  }

  return (
    <div>
      <h1>Submit Your Pick for Week {currentWeek}</h1>
      <form onSubmit={submitPick}>
        <input
          type="text"
          placeholder="Your Name or Handle"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        />
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
