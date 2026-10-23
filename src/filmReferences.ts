export type FilmReference = {
  id: string
  collection: 'womenNature' | 'fashion' | 'exploration'
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
    id: 'daughter-sea', collection: 'womenNature', title: 'Daughter of the Sea', titleZh: '海之女儿', source: 'Patagonia Films', year: '2023', duration: '18 分钟', category: '女性 / 海洋',
    synopsis: 'Jaeyoun 回到韩国济州岛，跟随家族中的海女重新走入大海。影片也涉及抑郁与自杀议题。',
    watchFor: '留意水下画面、人物旁白与日常劳动如何交织出情绪，而非只靠风景制造美感。',
    url: 'https://www.patagonia.com/stories/culture/community/daughter-of-the-sea/video-138299.html', embedUrl: 'https://www.youtube.com/embed/5nNXdzvex08', thumbnailUrl: 'https://i.ytimg.com/vi/5nNXdzvex08/hqdefault.jpg', color: '#78aeb1',
  },
  {
    id: 'right-roam', collection: 'womenNature', title: 'Right to Roam', titleZh: '自由漫游', source: 'Patagonia Films', year: '2017', duration: '17 分钟', category: '女性 / 旷野',
    synopsis: '跟随滑雪者 Marie-France Roy 与 Alex Yoder 穿越苏格兰，感受人在开放土地中的行动自由。',
    watchFor: '留意人物在广阔风景中的比例，以及阴天、风雪和路途镜头形成的诗意。',
    url: 'https://www.patagonia.com/stories/right-to-roam/video-86247.html', embedUrl: 'https://www.youtube.com/embed/ilmhR_EgK8Y', thumbnailUrl: 'https://i.ytimg.com/vi/ilmhR_EgK8Y/hqdefault.jpg', color: '#a6b6b6',
  },
  {
    id: 'veiled-water', collection: 'fashion', title: 'Veiled Water', titleZh: '水之面纱', source: 'Nicola Saint-Marc', year: '2012', duration: '2 分 34 秒', category: '时尚叙事 / 海洋',
    synopsis: '一位海豹精灵在人类生活与海洋之间作出选择，用服装和海岸构成神话般的短片。',
    watchFor: '留意服装如何成为角色的一部分，海水、风和身体动作如何推动叙事。',
    url: 'https://vimeo.com/43568900', embedUrl: 'https://player.vimeo.com/video/43568900', thumbnailUrl: 'https://i.vimeocdn.com/video/302544599-a5b99a9940c0b0ee4e7c89e2db664422baec55e491a9587e30d50d31f501fa65-d_640?region=us', color: '#abc4c7',
  },
  {
    id: 'gucci-bloom', collection: 'fashion', title: 'Gucci Bloom: The Campaign Film', titleZh: '花园里的女性', source: 'GUCCI', year: '2017', duration: '1 分钟', category: '时尚广告 / 花园',
    synopsis: 'Dakota Johnson、Hari Nef 与 Petra Collins 走入繁盛花园，呈现充满花卉意象的香氛影像。',
    watchFor: '留意花、服装、人物位置和色彩如何共同建立一个可辨认的视觉世界。',
    url: 'https://www.youtube.com/watch?v=wafe6kDBb6c', embedUrl: 'https://www.youtube.com/embed/wafe6kDBb6c', thumbnailUrl: 'https://i.ytimg.com/vi/wafe6kDBb6c/hqdefault.jpg', color: '#c7b5b1',
  },
  {
    id: 'see-you-at-five', collection: 'fashion', title: 'See You at 5', titleZh: '五点见', source: 'CHANEL', year: '2024', duration: '约 2 分钟', category: '时尚叙事 / 公路',
    synopsis: 'Margot Robbie 沿加州公路前往约会，旅途与擦肩而过的故事比香水本身更占画面。',
    watchFor: '留意金色自然光、公路与海岸景别，以及服装和人物动作如何塑造电影感。',
    url: 'https://www.youtube.com/watch?v=fo4LLux-tfM', embedUrl: 'https://www.youtube.com/embed/fo4LLux-tfM', thumbnailUrl: 'https://i.ytimg.com/vi/fo4LLux-tfM/hqdefault.jpg', color: '#ddbba5',
  },
  {
    id: 'closer', collection: 'exploration', title: 'Closer To Home', titleZh: '从身边开始探索', source: 'Patagonia Films', year: '2019', duration: '8 分钟', category: '日常探索',
    synopsis: '一位滑雪者搭乘火车，从熟悉的城镇出发，重新发现附近的自然。',
    watchFor: '留意“出发—路途—抵达”如何让很近的地方也有探索感。',
    url: 'https://www.patagonia.com/stories/86231/video-86231.html', embedUrl: 'https://www.youtube.com/embed/3I5bkk74tvw', thumbnailUrl: 'https://i.ytimg.com/vi/3I5bkk74tvw/hqdefault.jpg', color: '#88b4aa',
  },
  {
    id: 'spring', collection: 'exploration', title: 'The Spring Tide', titleZh: '春潮', source: 'Patagonia Films', year: '2017', duration: '5 分钟', category: '节奏与体感',
    synopsis: '两位滑雪者从高速运转的冬季，走向挪威山与海之间的短暂休整。',
    watchFor: '留意运动镜头与安静段落的速度对比，以及环境如何改变人物状态。',
    url: 'https://www.patagonia.com/stories/the-spring-tide/video-86203.html', embedUrl: 'https://www.youtube.com/embed/DurQASK04DA', thumbnailUrl: 'https://i.ytimg.com/vi/DurQASK04DA/hqdefault.jpg', color: '#a9bfd0',
  },
  {
    id: 'mile', collection: 'exploration', title: 'Mile for Mile', titleZh: '一英里接一英里', source: 'Patagonia Films', year: '2015', duration: '14 分钟', category: '旅程叙事',
    synopsis: '三位越野跑者穿越智利的巴塔哥尼亚公园，用身体丈量保护中的土地。',
    watchFor: '留意远景如何交代路线与尺度，近景如何把注意力带回人的呼吸和行动。',
    url: 'https://www.patagonia.com/stories/mile-for-mile/video-79894.html', embedUrl: 'https://www.youtube.com/embed/ryasKmNBJEc', thumbnailUrl: 'https://i.ytimg.com/vi/ryasKmNBJEc/hqdefault.jpg', color: '#cfad84',
  },
  {
    id: 'jalpi', collection: 'exploration', title: 'Jalpi', titleZh: '海底森林', source: 'Patagonia Films', year: '2023', duration: '7 分钟', category: '人物与生态',
    synopsis: '跟随韩国的 Ji Wook-cheol，认识他守护家乡海底森林的行动。',
    watchFor: '留意影片如何用一个人的具体行动，带出原本抽象的生态议题。',
    url: 'https://www.patagonia.com/stories/planet/activism/jalpi/video-138630.html', embedUrl: 'https://www.youtube.com/embed/dUfcDGZIruI', thumbnailUrl: 'https://i.ytimg.com/vi/dUfcDGZIruI/hqdefault.jpg', color: '#73aaa3',
  },
  {
    id: 'body', collection: 'exploration', title: 'A Body Called Life', titleZh: '身体里的生命', source: 'NOWNESS', year: '2025', duration: '14 分 38 秒', category: '微观自然',
    synopsis: '一位显微摄影者通过观察微生物，重新寻找自己与世界的连接。',
    watchFor: '留意人物经验与显微影像如何交替，形成内心与自然之间的视觉对话。',
    url: 'https://www.nowness.com/story/a-body-called-life-james-weiss-spencer-macdonald', embedUrl: 'https://player.vimeo.com/video/1048869506', thumbnailUrl: 'https://i.vimeocdn.com/video/1974575211-9033f0378a7144fcd40373ea9edbe4aeee3e47ad12d32dafb0fdefdfdc33f16b-d_640?region=us', color: '#b7a4bf',
  },
]
