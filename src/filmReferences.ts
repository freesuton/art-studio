export type FilmReference = {
  id: string
  collection: 'everyday' | 'womenNature' | 'fashion' | 'exploration'
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
    id: 'morning-routine', collection: 'everyday', title: 'Morning Routine', titleZh: '一个人的早晨', source: 'Jeremy Hanson', year: '2024', duration: '55 秒', category: '独自拍摄 / 起居',
    synopsis: '创作者在家中拍摄不那么规律的早晨，把起床后的混乱剪成一段简短的生活切片。',
    watchFor: '留意如何只用一个空间、几个重复动作和声音节奏，就让普通早晨有画面感。',
    url: 'https://vimeo.com/952857898', embedUrl: 'https://player.vimeo.com/video/952857898', thumbnailUrl: 'https://i.vimeocdn.com/video/1862876268-73c599b63cc61d7132855434e3df290875d23a21c2b8bc1d495bd260406576bb-d_640?region=us', color: '#d3bb9c',
  },
  {
    id: 'love-mom', collection: 'everyday', title: 'Love, Mom', titleZh: '妈妈，我爱你', source: 'Michael Villalobos', year: '2019', duration: '5 分 30 秒', category: '家庭 / 室内',
    synopsis: '一对母子生活在同一间小屋里，却渐渐失去亲近感；故事从相处中的细节展开。',
    watchFor: '留意有限的居住空间、人物距离和停顿，如何让家庭关系变得可见。',
    url: 'https://vimeo.com/346733330', embedUrl: 'https://player.vimeo.com/video/346733330', thumbnailUrl: 'https://i.vimeocdn.com/video/842064154-81b3bea5a2419aa38e920b76187064be94bb460c2ca044e30a98c815db3474e5-d_640?region=us', color: '#c6ad9b',
  },
  {
    id: 'into-thin-air', collection: 'everyday', title: 'Into Thin Air', titleZh: '消失在空气中', source: 'Marc Oller', year: '2021', duration: '12 分 27 秒', category: '城市 / 情绪叙事',
    synopsis: '东京女孩 Momo 度过一天，在城市日常与过去片段之间寻找一段关系突然结束的答案。',
    watchFor: '留意普通街景如何承载人物心情，以及现在与回忆之间如何靠画面衔接。',
    url: 'https://vimeo.com/727788057', embedUrl: 'https://player.vimeo.com/video/727788057', thumbnailUrl: 'https://i.vimeocdn.com/video/1465020519-0ae1ab893203baa24f192b16488a75cd6a5ec6659d9a92b4a3acdbda85f21d74-d_640?region=us', color: '#9ca8ae',
  },
  {
    id: 'wednesday', collection: 'everyday', title: 'Wednesday', titleZh: '星期三', source: 'Al Kennington & Albert Hooi', year: '2016', duration: '10 分 29 秒', category: '城市 / 观察',
    synopsis: '从早到晚观察都柏林的街道和行人，用一座城市普通的一天组成一部人物群像。',
    watchFor: '留意陌生人的肖像、街头动作和时间顺序，如何替代传统主角与情节。',
    url: 'https://vimeo.com/159292244', embedUrl: 'https://player.vimeo.com/video/159292244', thumbnailUrl: 'https://i.vimeocdn.com/video/686408130-1266e1215a7287ccbb95ff22467d67a09a1bc8e7e4dca5ab79a2589be426e49c-d_640?region=us', color: '#bcb7a3',
  },
  {
    id: 'perfetto', collection: 'everyday', title: 'Perfetto', titleZh: '一杯咖啡的旅程', source: 'De’Longhi', year: '2021', duration: '1 分钟', category: '生活广告 / 咖啡',
    synopsis: 'Brad Pitt 出门买咖啡豆，再回到家做一杯咖啡，把平常小事拍成完整旅程。',
    watchFor: '留意“出门—寻找—回家—完成”的微型结构，以及光线、音效和特写怎样抬高日常仪式感。',
    url: 'https://vimeo.com/596612477', embedUrl: 'https://player.vimeo.com/video/596612477', thumbnailUrl: 'https://i.vimeocdn.com/video/1730082625-f8a57b361ab9de528b0ac9b7b9616fe846661bf0a383e8926ff341bd3bee6917-d_640?region=us', color: '#c7a980',
  },
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
