import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  async function applyMultiplier(team, multiplier) {
    const { data, error } = await supabase
      .from('picks')
      .update({ multiplier })
      .eq('week_no', 5)   // Replace with current week or fetch from settings
      .eq('team', team)

    if (error) console.error(error)
    else console.log('Multiplier updated', data)
  }

  return (
    <div>
      <h1>Admin: Set Multipliers</h1>
      <button onClick={() => applyMultiplier('Giants', 2)}>Set Giants x2</button>
      <button onClick={() => applyMultiplier('Cowboys', 3)}>Set Cowboys x3</button>
    </div>
  )
}
