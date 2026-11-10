// Real reference footage from Pexels, searched from the browser with the viewer's own free key.
// Pexels asks for a link back and a credit to the videographer, which the coach shows on every clip.
export type StockClip = { id: number; page: string; thumb: string; poster: string; video: string; duration: number; author: string; authorUrl: string }

type PexelsFile = { quality: string | null; file_type: string; width: number | null; height: number | null; link: string }
type PexelsVideo = { id: number; url: string; image: string; duration: number; user: { name: string; url: string }; video_files: PexelsFile[] }

// Small thumbnails are enough for the AI to compare, and keep the matching cheap.
const smallThumb = (image: string) => { const url = new URL(image); url.searchParams.set('w', '384'); url.searchParams.delete('h'); return url.toString() }

// A light MP4 for playing in a card: the smallest file at least 540px on its short side, else the largest.
function pickFile(files: PexelsFile[]) {
  const mp4 = files.filter((file) => file.file_type === 'video/mp4' && file.width && file.height)
  const short = (file: PexelsFile) => Math.min(file.width!, file.height!)
  const sorted = [...mp4].sort((a, b) => short(a) - short(b))
  return (sorted.find((file) => short(file) >= 540) ?? sorted[sorted.length - 1])?.link
}

// Only Full HD or larger uploads: those are mostly shot by working videographers on proper cameras,
// which weeds out a lot of flat, phone-like footage before the AI looks at anything.
export async function searchClips(apiKey: string, query: string, orientation: 'landscape' | 'portrait', perPage = 12): Promise<StockClip[]> {
  const url = new URL('https://api.pexels.com/v1/videos/search')
  url.search = new URLSearchParams({ query, orientation, size: 'medium', per_page: String(perPage) }).toString()
  const response = await fetch(url, { headers: { Authorization: apiKey } })
  if (response.status === 401 || response.status === 403) throw new Error('pexels-key')
  if (response.status === 429) throw new Error('pexels-limit')
  if (!response.ok) throw new Error(`Pexels ${response.status}`)
  const body = await response.json() as { videos: PexelsVideo[] }
  return body.videos.flatMap((video) => {
    const file = pickFile(video.video_files)
    return file ? [{ id: video.id, page: video.url, thumb: smallThumb(video.image), poster: video.image, video: file, duration: video.duration, author: video.user.name, authorUrl: video.user.url }] : []
  })
}

export function describeClipError(error: unknown, language: 'zh' | 'en') {
  const en = language === 'en'
  const message = error instanceof Error ? error.message : String(error)
  if (message === 'pexels-key') return en ? 'That Pexels API key was rejected. Check it in AI settings.' : 'Pexels API Key 无效，请在 AI 设置里检查。'
  if (message === 'pexels-limit') return en ? 'Pexels search limit reached (200 an hour). Try again later.' : 'Pexels 搜索次数已达上限（每小时 200 次），请稍后再试。'
  return en ? `Could not search Pexels: ${message}` : `无法搜索 Pexels：${message}`
}
