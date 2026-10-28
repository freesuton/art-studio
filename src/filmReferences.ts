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
  embedType?: 'iframe' | 'video'
  thumbnailUrl: string
  color: string
}

export const filmReferences: FilmReference[] = [
  {
    id: 'little-forest-korea', collection: 'everyday', title: 'Little Forest', titleZh: '小森林（韩版）', source: 'Korean Film Week', year: '2018', duration: '1 分 42 秒', category: '电影预告 / 乡村四季',
    synopsis: '一位年轻女性回到故乡，在种菜、做饭和骑行中重新整理自己的生活。',
    watchFor: '观察做饭与劳作的动作如何被拆成特写、中景和环境镜头，让真实日常形成节奏。',
    url: 'https://www.youtube.com/watch?v=uKW0YaPUa2Y', embedUrl: 'https://www.youtube.com/embed/uKW0YaPUa2Y', thumbnailUrl: 'https://i.ytimg.com/vi/uKW0YaPUa2Y/hqdefault.jpg', color: '#9faf79',
  },
  {
    id: 'little-forest-japan', collection: 'everyday', title: 'Little Forest: Summer/Autumn', titleZh: '小森林：夏秋篇', source: 'MUBI', year: '2014', duration: '1 分 12 秒', category: '电影预告 / 食物与独居',
    synopsis: '女孩回到东北乡村独自生活，让耕作、采集和烹饪跟着季节变化慢慢展开。',
    watchFor: '观察食物与植物特写怎样接回人物中景，以及手部动作如何成为自然转场。',
    url: 'https://mubi.com/en/films/little-forest-summerautumn/trailer', embedUrl: 'https://trailers.mubicdn.net/120022/optimised/720p-t-little-forest-summerautumn_en_us_1702.949_1280_720_1705630038.mp4', embedType: 'video', thumbnailUrl: 'https://images.mubicdn.net/images/film/120022/cache-105256-1745492171/image-w1280.jpg', color: '#8f9e6d',
  },
  {
    id: 'our-little-sister', collection: 'everyday', title: 'Our Little Sister', titleZh: '海街日记', source: 'Fuji TV', year: '2015', duration: '1 分 30 秒', category: '电影预告 / 家庭与季节',
    synopsis: '四姐妹在海边小镇共同生活，家庭关系藏在吃饭、散步、通勤和季节变化里。',
    watchFor: '观察多人在家中与街道里的自然站位，以及环境空镜如何给人物关系留出呼吸。',
    url: 'https://www.youtube.com/watch?v=NRktvTd5KZo', embedUrl: 'https://www.youtube.com/embed/NRktvTd5KZo', thumbnailUrl: 'https://i.ytimg.com/vi/NRktvTd5KZo/hqdefault.jpg', color: '#b9b596',
  },
  {
    id: 'zen-diary', collection: 'everyday', title: 'The Zen Diary', titleZh: '土を喰らう十二ヵ月', source: 'JCCC', year: '2022', duration: '1 分 03 秒', category: '电影预告 / 山居与烹饪',
    synopsis: '一位作家在山间木屋种菜、采集并做饭，用十二个月感受土地和生活的变化。',
    watchFor: '观察安静空间里的自然光、生活声音与动作细节，怎样建立沉稳而不空洞的节奏。',
    url: 'https://www.youtube.com/watch?v=bCWkm2nxZgc', embedUrl: 'https://www.youtube.com/embed/bCWkm2nxZgc', thumbnailUrl: 'https://i.ytimg.com/vi/bCWkm2nxZgc/hqdefault.jpg', color: '#aa9b77',
  },
  {
    id: 'bread-of-happiness', collection: 'everyday', title: 'Bread of Happiness', titleZh: '幸福的面包', source: 'JustWatch', year: '2012', duration: '1 分 49 秒', category: '电影预告 / 湖边咖啡馆',
    synopsis: '一对夫妻在北海道湖边经营面包咖啡馆，透过食物和来客描绘温暖的日常。',
    watchFor: '观察窗户、晨光、木质室内和食物特写如何配合，建立统一的温度与空间感。',
    url: 'https://www.dailymotion.com/video/x8hqiw9', embedUrl: 'https://geo.dailymotion.com/player.html?video=x8hqiw9', thumbnailUrl: 'https://s2.dmcdn.net/v/UcxCf1eoxQWSAZG_X/x720', color: '#c69b73',
  },
  {
    id: 'fragments-morning-evening', collection: 'everyday', title: 'Fragments… Morning, Evening', titleZh: '清晨、傍晚，再到清晨', source: 'Zhanna Tuygay', year: '2025', duration: '1 分 10 秒', category: '独立短片 / 时间片段',
    synopsis: '影片用清晨、傍晚和第二天清晨的安静片段，让一天自然流向下一天。',
    watchFor: '适合直接模仿：选三个时间节点，每段只拍少量动作，再用光线和声音连接。',
    url: 'https://vimeo.com/1146637122', embedUrl: 'https://player.vimeo.com/video/1146637122', thumbnailUrl: 'https://i.vimeocdn.com/video/2096139577-47ff9a783d688259fea7da4049d6bca630db06cec3519ddecd916aa10b61c752-d_640?region=us', color: '#a89c90',
  },
  {
    id: 'nyangsoop-summer', collection: 'everyday', title: 'A Summer Day', titleZh: '某个夏日的生活节奏', source: '냥숲 nyangsoop', year: '2020', duration: '23 分 07 秒', category: '生活记录 / 乡村独居',
    synopsis: '韩国创作者记录夏日里的居住、做饭和户外活动，以固定机位保留真实动作的完整过程。',
    watchFor: '观察固定机位、自然动作和环境声如何组合；尤其适合学习一个人怎样完成拍摄。',
    url: 'https://www.youtube.com/watch?v=r0dckVaa4jM', embedUrl: 'https://www.youtube.com/embed/r0dckVaa4jM', thumbnailUrl: 'https://i.ytimg.com/vi/r0dckVaa4jM/hqdefault.jpg', color: '#92a58a',
  },
  {
    id: 'getting-by', collection: 'everyday', title: 'Getting By', titleZh: '独自生活的日子', source: 'Caitlin Chescoe', year: '2026', duration: '1 分 41 秒', category: '人物纪录 / 居家观察',
    synopsis: '摄影师温和地记录独居祖父的日常、衰老与孤独，让缓慢的生活节奏成为故事本身。',
    watchFor: '观察不摆拍的动作、居家空间和停顿如何保留人物尊严，同时让情绪逐渐累积。',
    url: 'https://vimeo.com/1151937107', embedUrl: 'https://player.vimeo.com/video/1151937107', thumbnailUrl: 'https://i.vimeocdn.com/video/2103309377-f9ac260b47c41f1a0c30be0bd57b6ed90fcf452e242a4314c2f45d41000d19f7-d_640?region=us', color: '#9e9588',
  },
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
    id: 'astr-summer', collection: 'fashion', title: 'ASTR the Label: Summer 2021', titleZh: '夏日自然光时尚短片', source: 'Kevin Reyes', year: '2021', duration: '约 2 分钟', category: '时尚影像 / 自然光',
    synopsis: '以轻盈服装、自然光和人物在户外的细微动作，组成一支接近生活片段的夏日时尚短片。',
    watchFor: '重点看人物不要直视镜头时，行走、停下、转身和衣料随风变化如何形成自然的电影感。',
    url: 'https://www.youtube.com/watch?v=6vm56tVnqk0', embedUrl: 'https://www.youtube.com/embed/6vm56tVnqk0', thumbnailUrl: 'https://i.ytimg.com/vi/6vm56tVnqk0/hqdefault.jpg', color: '#d6b69f',
  },
  {
    id: 'urban-legends', collection: 'fashion', title: 'Urban Legends', titleZh: '城市里的自然动作', source: 'Peter Marin', year: '2015', duration: '约 3 分钟', category: '时尚影像 / 街头',
    synopsis: '两位女性在城市街道与室内移动，让服装、步伐和场景共同建立轻松的时尚叙事。',
    watchFor: '观察侧面行走、靠墙停留、人物经过镜头等简单动作，如何在手持镜头里仍然保持自然。',
    url: 'https://www.youtube.com/watch?v=a-fhH4fVeEQ', embedUrl: 'https://www.youtube.com/embed/a-fhH4fVeEQ', thumbnailUrl: 'https://i.ytimg.com/vi/a-fhH4fVeEQ/hqdefault.jpg', color: '#b6a6a2',
  },
  {
    id: 'alexandra-cavazos', collection: 'fashion', title: 'Alexandra Cavazos', titleZh: '肖像与服装动作练习', source: 'Cinematic Portraits', year: '2024', duration: '约 3 分钟', category: '时尚肖像 / 自然动作',
    synopsis: '一支以女性肖像、服装和轻微身体移动为核心的摄影短片，适合研究单人拍摄时的动作节奏。',
    watchFor: '观察近景、中景与全身之间如何切换；每个动作都很小，但衣服、视线和身体方向让画面持续变化。',
    url: 'https://www.youtube.com/watch?v=9R9a5vwNqOU', embedUrl: 'https://www.youtube.com/embed/9R9a5vwNqOU', thumbnailUrl: 'https://i.ytimg.com/vi/9R9a5vwNqOU/hqdefault.jpg', color: '#c7aa9e',
  },
  {
    id: 'beautiful-strangers', collection: 'fashion', title: 'Beautiful Strangers', titleZh: '阳光与服装叙事', source: 'Reno Mezger', year: '2017', duration: '40 秒', category: '时尚叙事 / 阳光',
    synopsis: '一位女性在西班牙阳光与开放空间中穿行，服装和人物关系共同构成具有故事感的时尚短片。',
    watchFor: '观察暖色日光、人物进入和离开画面，以及远景如何让服装和环境一起讲故事。',
    url: 'https://vimeo.com/208820079', embedUrl: 'https://player.vimeo.com/video/208820079', thumbnailUrl: 'https://i.vimeocdn.com/video/624287956-88b9ef12b9cb987a7c55cc043f3ac373980a44e0d4f69f7c277bceba1fca77fa-d_640?region=us', color: '#d1ab81',
  },
  {
    id: 'topanga', collection: 'fashion', title: 'Topanga', titleZh: '午后约会', source: 'Stewart Maclennan', year: '2016', duration: '7 分 24 秒', category: '时尚短片 / 生活叙事',
    synopsis: '一对年轻人在日常场景中相遇与游走，影片用服装、光线和关系变化建立含蓄的时尚故事。',
    watchFor: '留意人物不是摆姿，而是在走、等、看与互动；每个自然动作都被镜头安排成有节奏的段落。',
    url: 'https://vimeo.com/156107994', embedUrl: 'https://player.vimeo.com/video/156107994', thumbnailUrl: 'https://i.vimeocdn.com/video/578955668-1df7dbcc289794459c952dada550fa18f6b9f7a9d4810bf749ceaaf0181007cb-d_295x166?region=us', color: '#b79a87',
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
