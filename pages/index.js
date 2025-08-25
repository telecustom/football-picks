import { supabase } from '../lib/supabaseClient'

export default function Home({ games }) {
  return (
    <div>
      <h1>Football Picks Pool</h1>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            Week {game.week_no}: {game.away_team} at {game.home_team} ({game.game_date})
          </li>
        ))}
      </ul>
    </div>
  )
}

// Fetch games on the server (Vercel build) and pass as props
export async function getServerSideProps() {
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .order('week_no', { ascending: true })

  if (error) {
    console.error(error)
    return { props: { games: [] } }
  }

  return { props: { games } }
}
