
export default async function handler(req, res) {
  const query = req.query.query

  if (!query) {
    return res.status(400).json({ error: '映画タイトルが必要です' })
  }

  const apiKey = process.env.TMDB_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'TMDB APIキーが設定されていません' })
  }

  try {
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('query', query)
    url.searchParams.set('language', 'ja-JP')
    url.searchParams.set('api_key', apiKey)

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
  return res.status(response.status).json({
    error: 'TMDBの検索に失敗しました',
    details: data.status_message || '詳細不明',
    status_code: data.status_code || response.status,
  })
}

    return res.status(200).json({
      results: (data.results || []).slice(0, 5).map(movie => ({
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      })),
    })
  } catch {
    return res.status(500).json({ error: '検索中にエラーが発生しました' })
  }
}
