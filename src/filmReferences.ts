export type FilmReference = {
  id: 'closer' | 'spring' | 'mile' | 'jalpi' | 'body'
  title: string
  titleZh: string
  source: string
  year: string
  duration: string
  category: string
  synopsis: string
  watchFor: string
  url: string
  embedUrl: string
  thumbnailUrl: string
  color: string
}

export const filmReferences: FilmReference[] = [
  {
    id: 'closer', title: 'Closer To Home', titleZh: '从身边开始探索', source: 'Patagonia Films', year: '2019', duration: '8 分钟', category: '日常探索',
    synopsis: '一位滑雪者搭乘火车，从熟悉的城镇出发，重新发现附近的自然。',
    watchFor: '留意“出发—路途—抵达”如何让很近的地方也有探索感。',
    url: 'https://www.patagonia.com/stories/86231/video-86231.html', embedUrl: 'https://www.youtube.com/embed/3I5bkk74tvw', thumbnailUrl: 'https://i.ytimg.com/vi/3I5bkk74tvw/hqdefault.jpg', color: '#88b4aa',
  },
  {
    id: 'spring', title: 'The Spring Tide', titleZh: '春潮', source: 'Patagonia Films', year: '2017', duration: '5 分钟', category: '节奏与体感',
    synopsis: '两位滑雪者从高速运转的冬季，走向挪威山与海之间的短暂休整。',
    watchFor: '留意运动镜头与安静段落的速度对比，以及环境如何改变人物状态。',
    url: 'https://www.patagonia.com/stories/the-spring-tide/video-86203.html', embedUrl: 'https://www.youtube.com/embed/DurQASK04DA', thumbnailUrl: 'https://i.ytimg.com/vi/DurQASK04DA/hqdefault.jpg', color: '#a9bfd0',
  },
  {
    id: 'mile', title: 'Mile for Mile', titleZh: '一英里接一英里', source: 'Patagonia Films', year: '2015', duration: '14 分钟', category: '旅程叙事',
    synopsis: '三位越野跑者穿越智利的巴塔哥尼亚公园，用身体丈量保护中的土地。',
    watchFor: '留意远景如何交代路线与尺度，近景如何把注意力带回人的呼吸和行动。',
    url: 'https://www.patagonia.com/stories/mile-for-mile/video-79894.html', embedUrl: 'https://www.youtube.com/embed/ryasKmNBJEc', thumbnailUrl: 'https://i.ytimg.com/vi/ryasKmNBJEc/hqdefault.jpg', color: '#cfad84',
  },
  {
    id: 'jalpi', title: 'Jalpi', titleZh: '海底森林', source: 'Patagonia Films', year: '2023', duration: '7 分钟', category: '人物与生态',
    synopsis: '跟随韩国的 Ji Wook-cheol，认识他守护家乡海底森林的行动。',
    watchFor: '留意影片如何用一个人的具体行动，带出原本抽象的生态议题。',
    url: 'https://www.patagonia.com/stories/planet/activism/jalpi/video-138630.html', embedUrl: 'https://www.youtube.com/embed/dUfcDGZIruI', thumbnailUrl: 'https://i.ytimg.com/vi/dUfcDGZIruI/hqdefault.jpg', color: '#73aaa3',
  },
  {
    id: 'body', title: 'A Body Called Life', titleZh: '身体里的生命', source: 'NOWNESS', year: '2025', duration: '14 分 38 秒', category: '微观自然',
    synopsis: '一位显微摄影者通过观察微生物，重新寻找自己与世界的连接。',
    watchFor: '留意人物经验与显微影像如何交替，形成内心与自然之间的视觉对话。',
    url: 'https://www.nowness.com/story/a-body-called-life-james-weiss-spencer-macdonald', embedUrl: 'https://player.vimeo.com/video/1048869506', thumbnailUrl: 'https://i.vimeocdn.com/video/1974575211-9033f0378a7144fcd40373ea9edbe4aeee3e47ad12d32dafb0fdefdfdc33f16b-d_640?region=us', color: '#b7a4bf',
  },
]
