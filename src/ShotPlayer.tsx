import { useEffect, useRef } from 'react'

// Minimal slice of the YouTube IFrame Player API that this player uses.
type YTPlayer = { getCurrentTime: () => number; getPlayerState: () => number; pauseVideo: () => void; seekTo: (seconds: number, allowSeekAhead: boolean) => void; destroy: () => void }
type YTEvent = { data: number; target: YTPlayer }
type YTNamespace = {
  Player: new (element: HTMLElement, options: { videoId: string; width: string; height: string; playerVars: Record<string, number>; events: { onStateChange: (event: YTEvent) => void } }) => YTPlayer
  PlayerState: { ENDED: number; PLAYING: number }
}
declare global { interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void } }

let apiPromise: Promise<YTNamespace> | null = null
function loadYouTubeApi() {
  apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT)
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT!) }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
  return apiPromise
}

const youTubeId = (embedUrl: string) => embedUrl.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/)?.[1]

// Plays one shot of a film. YouTube forgets start/end params on replay, so the player
// watches the time itself: at the shot's end it pauses and rewinds to the shot's start,
// and the next press of play repeats the shot.
export default function ShotPlayer({ embedUrl, start, end, title }: { embedUrl: string; start: number; end: number; title: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const videoId = youTubeId(embedUrl)

  useEffect(() => {
    const host = hostRef.current
    if (!videoId || !host) return
    // The API replaces its target element, so give it one React doesn't own.
    const target = document.createElement('div')
    host.appendChild(target)
    let player: YTPlayer | null = null
    let timer = 0
    let cancelled = false
    const rewind = (target: YTPlayer) => { target.pauseVideo(); target.seekTo(start, true) }
    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      player = new YT.Player(target, {
        videoId, width: '100%', height: '100%',
        playerVars: { start, autoplay: 1, rel: 0, playsinline: 1 },
        // The last shot can run into the end of the video, which ends before the timer sees it.
        events: { onStateChange: (event) => { if (event.data === YT.PlayerState.ENDED) rewind(event.target) } },
      })
      timer = window.setInterval(() => {
        if (player?.getPlayerState?.() === YT.PlayerState.PLAYING && player.getCurrentTime() >= end) rewind(player)
      }, 150)
    })
    return () => { cancelled = true; window.clearInterval(timer); player?.destroy(); host.replaceChildren() }
  }, [videoId, start, end])

  return <div className="ws-shot-player" ref={hostRef}>
    {!videoId && <iframe src={`${embedUrl}?start=${start}&end=${end}&autoplay=1&rel=0&playsinline=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
  </div>
}
