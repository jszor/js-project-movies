import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { API_KEY, BASE_URL, IMAGE_BASE } from '../api'
import NotFound from './NotFound'

const MovieInfo = () => {
  const { id } = useParams()
  const [movieDetails, setMovieDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then(res => {
        if (!res.ok) throw new Error('Movie not found')
        return res.json()
      })
      .then(data => {
        setMovieDetails(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Loading…</p>
      </main>
    )
  }

  if (error) {
    return <NotFound />
  }

  return (
    <main className="relative min-h-screen text-white">
      {/* Backdrop */}
      {movieDetails.backdrop_path && (
  <div
    className="fixed inset-0 bg-cover bg-center z-0"
    style={{
      backgroundImage: `url(${IMAGE_BASE}/w1280${movieDetails.backdrop_path})`,
    }}
  >
    <div className="absolute inset-0 bg-black/45"></div>
  </div>
)}

      {/* Always-on-top Back link */}
      <div className="absolute md:left-8 z-20 p-4 lg:p-8">
        <Link
          to="/"
          className="font-neue-display font-semibold text-xl inline-block text-white hover:underline drop-shadow-lg"
        >
          ⇦ Movies
        </Link>
      </div>

      {/* Content container pinned at bottom-left on tablet+ */}
      <div
        className="
          absolute z-10 /* Always on top of backdrop */
          top-10
          md:top-auto
          md:bottom-25 md:left-8 md:right-8
          pt-4 lg:pt-8 // Padding for content
          p-4 lg:p-8 / * Padding for content */
          max-w-full lg:max-w-[70%] /* Full width on mobile, max-width on larger screens */
          md:max-w-[45rem]
        "
      >
        <div className="
            mt-3 lg:mt-20 /* Margin for spacing */
            flex flex-col
            md:flex-row md:items-end
          ">
          {/* Poster (half width on mobile, one-third on tablet+) */}
          {movieDetails.poster_path && (
            <img
              src={`${IMAGE_BASE}/w500${movieDetails.poster_path}`}
              alt={`${movieDetails.title} poster`}
              className="
                w-1/2        /* around 50% width on mobile */
                md:w-1/3     /* one-third width on tablet+ */
                shadow mb-6 md:mb-0
                border-6 border-white
              "
            />
          )}

          {/* Details */}
          <div className="flex-1 md:pl-8">
            <h1 className="font-neue-display text-2xl lg:text-4xl font-bold leading-none mb-2 drop-shadow-lg">
              {movieDetails.title}
            </h1>
            <p className="font-neue-text text-sm lg:text-base leading-none text-gray-300 mb-4">
              {movieDetails.release_date?.slice(0, 4)} &middot;{' '}
              {movieDetails.vote_average?.toFixed(1)} ⭐
            </p>
            {movieDetails.overview && (
              <section className="text-left">
                <p className="font-neue-text text-base lg:text-lg leading-none lg:max-w-2xl drop-shadow-sm">
                  {movieDetails.overview}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default MovieInfo