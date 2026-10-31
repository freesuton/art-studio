// Beginner how-to for each reference shot: operating the camera and directing the model.
// Settings are starting points for a mirrorless camera, not the original production's.
type Text = { zh: string; en: string }
export type CameraGuide = { gear: Text; settings: Text; nd: Text; exposure: Text; focus: Text; tip?: Text }
export type DirectGuide = { brief: Text; cues: Text; pose: Text; watch?: Text }
// Shots without talent have no direct; shots made in the edit have neither.
export type ShotGuide = { camera?: CameraGuide; direct?: DirectGuide }

const tx = (zh: string, en: string): Text => ({ zh, en })

// Keyed by breakdown id, then by shot time.
export const shotGuides: Record<string, Record<string, ShotGuide>> = {
  'astr-summer-2021': {
    '0:00–0:04': {
      camera: {
        gear: tx('副驾驶座手持，或用吸盘、夹具固定在车窗边；50–85mm 镜头；打开防抖。', 'Handheld from the passenger seat, or on a suction or clamp mount at the window; 50–85mm lens; stabilization on.'),
        settings: tx('24fps · 1/50 · f/5.6 · ISO 100 · 5600K', '24fps · 1/50 · f/5.6 · ISO 100 · 5600K'),
        nd: tx('约 2–4 档（ND4–ND16）。别为了压亮度把快门调快：1/50 让前景草丛拖出动态模糊，流动感就来自这里。', 'About 2–4 stops (ND4–ND16). Don\'t raise the shutter speed to darken the image: at 1/50 the foreground brush smears into motion blur, and that blur is the sense of movement.'),
        exposure: tx('按天空和地平线曝光，宁暗勿过曝。斑马纹设 95–100%，天空大片出现条纹就把 ND 转深一点。', 'Expose for the sky and horizon, and err on the dark side. With zebras at 95–100%, if stripes cover the sky, turn the ND darker.'),
        focus: tx('手动对焦到远处地平线，锁住不动。前景虚掉没关系。', 'Manual focus on the far horizon and leave it there. A soft foreground is fine.'),
        tip: tx('让别人开车，车速 20–40 km/h。摇下车窗拍，避免玻璃反光。每遍录 15 秒以上，剪辑时挑最好的 4 秒。', 'Have someone else drive, at 20–40 km/h. Shoot with the window down to avoid reflections. Record 15+ seconds per pass and pick the best 4 in the edit.'),
      },
    },
    '0:05–0:10': {
      camera: {
        gear: tx('三脚架；长焦 70–200mm；摘掉遮光罩，方便出眩光。', 'Tripod; 70–200mm telephoto; take the lens hood off so it can flare.'),
        settings: tx('24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K', '24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K'),
        nd: tx('正对太阳最亮，约 5–7 档（ND32–ND128）。可变 ND 转到尽头会出现十字暗纹；不够深就再叠一片固定 ND。', 'Pointing into the sun is the brightest case: about 5–7 stops (ND32–ND128). A variable ND shows a dark X pattern at its strongest end; if it isn\'t enough, stack a fixed ND.'),
        exposure: tx('按天空曝光，让仙人掌成为剪影，只留边缘一圈亮光。月亮要在太阳还低、天还蓝的时候拍。', 'Expose for the sky so the cactus goes to silhouette with a bright rim. Catch the moon while the sun is still low and the sky is blue.'),
        focus: tx('手动对焦在仙人掌边缘的刺上，放大画面确认。', 'Manual focus on the spines along the cactus edge; magnify the image to check.'),
        tip: tx('挪动机位，让太阳刚好藏在仙人掌后面，只露一点边，眩光最好看。不要用光学取景器直视太阳，也别让镜头长时间对着太阳。', 'Move the camera until the sun just hides behind the cactus with a sliver showing; that gives the nicest flare. Never look at the sun through an optical viewfinder, and don\'t leave the lens pointed at it for long.'),
      },
    },
    '0:12–0:17': {
      camera: {
        gear: tx('三脚架；24–35mm 广角；前景放一棵约书亚树或别的植物，框住画面。', 'Tripod; 24–35mm wide lens; put a Joshua tree or any plant in the foreground to frame the shot.'),
        settings: tx('24fps · 1/50 · f/5.6–8 · ISO 100 · 5600K', '24fps · 1/50 · f/5.6–8 · ISO 100 · 5600K'),
        nd: tx('光圈收小已经挡掉不少光，约 2–4 档（ND4–ND16）就够。', 'The small aperture already cuts a lot of light, so about 2–4 stops (ND4–ND16) is enough.'),
        exposure: tx('人物很小，按整个画面曝光：天空不要大片过曝，能看出人物轮廓和裙子颜色就行。', 'The subject is tiny, so expose for the whole frame: no large blown-out sky, and her outline and dress color still readable.'),
        focus: tx('手动对焦在人物上；f/8 下前景和背景基本都清楚。', 'Manual focus on the subject; at f/8 foreground and background are mostly sharp too.'),
        tip: tx('每条录 15–20 秒，让人物在画面里自然地“待着”。太阳放在画面上沿或角落，制造眩光。', 'Record 15–20 seconds per take and let her simply exist in the frame. Put the sun at the top edge or a corner for flare.'),
      },
      direct: {
        brief: tx('“这是很远的大景，你在画面里很小，看不清表情，要靠身体轮廓和裙摆。”再告诉她镜头在哪、离她大概多远。', '"This is a very wide shot. You\'re small in frame and your face won\'t read, so it\'s all about your silhouette and the dress." Tell her where the camera is and roughly how far.'),
        cues: tx('距离太远喊不到，用手机通话或对讲机。“准备——开始”，数到 10 再说“慢慢转头看太阳”。', 'Too far to shout: use a phone call or walkie-talkie. "Ready… action", count to 10, then "slowly turn your head toward the sun."'),
        pose: tx('稳稳站在栅栏上，重心放在一条腿，手臂自然张开或扶一下栅栏。动作要少、要慢，像在发呆。', 'Stand steady on the fence, weight on one leg, arms loose or resting on the rail. Few, slow movements, like daydreaming.'),
        watch: tx('先自己试栅栏稳不稳，上下时旁边有人扶。走过去穿平底鞋，到位再换鞋。', 'Test the fence yourself first, and have someone steady her getting up and down. Walk over in flat shoes and change on the mark.'),
      },
    },
    '0:18–0:23': {
      camera: {
        gear: tx('稳定器或滑轨；50mm；镜头前加 1/4 或 1/8 黑柔滤镜（Black Pro-Mist），让高光晕开。', 'Gimbal or slider; 50mm; a 1/4 or 1/8 Black Pro-Mist filter so the highlights bloom.'),
        settings: tx('24fps · 1/50 · f/2–2.8 · ISO 100 · 5600K', '24fps · 1/50 · f/2–2.8 · ISO 100 · 5600K'),
        nd: tx('大光圈加逆光，约 4–6 档（ND16–ND64）。', 'Wide aperture into backlight: about 4–6 stops (ND16–ND64).'),
        exposure: tx('逆光时相机会被亮天空骗到，把脸拍暗。全手动时转 ND，直到 70% 斑马纹刚好落在脸的亮部；身后天空过曝发白没关系，要的就是这种光晕。用自动曝光的话加 +1 到 +1.7 EV。', 'In backlight the bright sky fools the meter and the face goes dark. In full manual, turn the ND until 70% zebras just touch the bright side of her face; a blown-out sky behind her is fine, that glow is the look. On auto exposure, dial in +1 to +1.7 EV.'),
        focus: tx('推近时距离一直在变：开连续对焦加人脸和眼部识别。或者提前标好起点和终点，手动跟焦。', 'The distance keeps changing during the push: use continuous AF with face and eye detection, or mark start and end points and pull focus by hand.'),
        tip: tx('推近要匀速、要慢，5–6 秒走完约 1 米，起步和停下都要缓。先空跑几遍再正式拍。', 'Push slowly and evenly, about 1 meter over 5–6 seconds, easing in and out. Rehearse a few dry runs first.'),
      },
      direct: {
        brief: tx('“镜头会慢慢靠近你，大约 5 秒。你只需要站着，中途把视线慢慢交给镜头。”', '"The camera will move slowly toward you for about 5 seconds. Just stand there, and halfway through, slowly give your eyes to the lens."'),
        cues: tx('“开始”→ 开始推 → 数到 2 时轻声说“慢慢抬眼” → 推到底再停 2 秒 → “好，停”。', '"Action" → start the push → at a count of 2, softly say "slowly lift your eyes" → hold 2 seconds at the end → "and cut."'),
        pose: tx('先看斜下方或远处，再用 2–3 秒把视线移到镜头上。脸放松，嘴唇微张，不笑，下巴微收。', 'Start looking down and off, then take 2–3 seconds to bring her eyes to the lens. Relaxed face, lips slightly parted, no smile, chin slightly down.'),
        watch: tx('提醒她看的是镜头本身，不是你或屏幕。逆光刺眼，每条之间让她闭眼休息一下。', 'Remind her to look into the lens itself, not at you or the screen. Backlight is harsh on the eyes, so let her close them between takes.'),
      },
    },
    '0:24–0:27': {
      camera: {
        gear: tx('手持；24–35mm；相机举在模特下方往上拍。', 'Handheld; 24–35mm; hold the camera below her, shooting up.'),
        settings: tx('24fps · 1/50 · f/4 · ISO 100 · 5600K', '24fps · 1/50 · f/4 · ISO 100 · 5600K'),
        nd: tx('对着天空，约 4–6 档。', 'Facing the sky: about 4–6 stops.'),
        exposure: tx('按脸曝光，天空可以过曝。太阳进画面时脸会变暗，换个角度让太阳待在画面边缘。', 'Expose for her face and let the sky blow out. If the sun is in frame her face drops into shadow, so shift until it sits at the edge.'),
        focus: tx('连续对焦加人脸识别，或手动对在脸上。手持会晃，f/4 给对焦留点余量。', 'Continuous AF with face detection, or manual on her face. Handheld wobbles, so f/4 gives focus some margin.'),
        tip: tx('照常拍，剪辑时把画面旋转 180°。下一镜倒置的约书亚树也照常拍，后期再旋转、加胶片质感。', 'Shoot it normally and rotate the clip 180° in the edit. Shoot the upside-down Joshua tree that follows normally too, then rotate it and add film texture in post.'),
      },
      direct: {
        brief: tx('“我在你下面往上拍，画面最后会倒过来，重点是头发垂下来的样子。”', '"I\'m shooting up from below you and the shot will be flipped later. It\'s all about your hair hanging down."'),
        cues: tx('“慢慢往后靠——停——看镜头——好。”每条只拍 5–8 秒。', '"Slowly lean back… stop… eyes to the lens… good." Only 5–8 seconds per take.'),
        pose: tx('背靠稳的墙或车身往后仰，头发自然垂下，下巴微抬，眼睛看镜头；手放在胸前或扶住身后。', 'Lean back against a solid wall or car, hair hanging free, chin lifted, eyes to the lens; hands on her chest or holding the surface behind.'),
        watch: tx('后仰太久会头晕，每条之间让她起身休息。身后一定要有可靠的支撑，或有人扶着。', 'Leaning back too long makes people dizzy, so let her sit up between takes. Always have solid support behind her, or someone spotting.'),
      },
    },
    '0:28': {
      camera: {
        gear: tx('相机直接放地上，或用很矮的三脚架；24mm 广角；用翻转屏看构图。', 'Camera on the ground or on a very low tripod; 24mm wide lens; frame with the flip screen.'),
        settings: tx('24fps · 1/50 · f/5.6 · ISO 100 · 5600K', '24fps · 1/50 · f/5.6 · ISO 100 · 5600K'),
        nd: tx('约 3–5 档。', 'About 3–5 stops.'),
        exposure: tx('逆光加眩光，按腿和裙子的亮度曝光，天空偏亮没关系。', 'Backlight with flare: expose for her legs and dress, and let the sky run bright.'),
        focus: tx('手动对焦在她脚的位置，f/5.6 让鞋子到裙摆都清楚。', 'Manual focus at her feet; f/5.6 keeps shoes through hem sharp.'),
        tip: tx('镜头微微向上倾，让天空做背景，墙显得更高，人更有力量。', 'Tilt up slightly so the sky fills the background; the wall looks taller and she looks powerful.'),
      },
      direct: {
        brief: tx('“只拍腰部以下，看不到脸，靠脚步和手里的网兜做动作。”', '"Waist down only, no face, so it\'s all your feet and the net bag."'),
        cues: tx('“站稳——轻轻换一下重心——网兜慢慢晃一下——停。”', '"Plant your feet… shift your weight gently… let the bag swing a little… and stop."'),
        pose: tx('站姿要好看：一只脚稍往前，脚尖略向外；网兜挂在手上轻轻晃，动作慢。', 'A good stance: one foot slightly forward, toes turned out a touch; the bag hangs from her hand and sways slowly.'),
        watch: tx('先检查石墙边缘，旁边有人保护。', 'Check the wall edge first and have someone spotting.'),
      },
    },
    '0:30–0:33': {
      camera: {
        gear: tx('三脚架；35–50mm。', 'Tripod; 35–50mm.'),
        settings: tx('24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K', '24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K'),
        nd: tx('约 4–6 档。', 'About 4–6 stops.'),
        exposure: tx('太阳在画面上沿，按人物身体曝光。眩光太强把人冲得发灰时，降低一点机位或横向挪一下，让眩光变小。', 'With the sun at the top of frame, expose for her body. If the flare washes her out, drop the camera slightly or step sideways to tame it.'),
        focus: tx('手动对在她身上，或用人脸识别。', 'Manual focus on her, or face detection.'),
        tip: tx('录 10 秒以上，剪辑只用最自然的 3 秒。', 'Record 10+ seconds and use the most natural 3 in the edit.'),
      },
      direct: {
        brief: tx('“全身固定镜头，你在画面中间。没有大动作，只要有一点呼吸感。”', '"A locked full shot with you in the middle. No big moves, just a little sense of breathing."'),
        cues: tx('“开始——换一下重心——手轻轻碰一下头发——看远处——好。”', '"Action… shift your weight… touch your hair lightly… look off into the distance… good."'),
        pose: tx('重心慢慢从一条腿移到另一条腿，手可以碰头发或裙子。不要摆拍照姿势，要像在等人。', 'Slowly shift weight from one leg to the other, a hand to her hair or dress. Not a photo pose: more like waiting for someone.'),
        watch: tx('第一次拍视频的模特常会摆好一个造型就定住，提醒她一直保持缓慢的小动作。', 'Models new to video tend to hit a pose and freeze; remind her to keep moving slowly and slightly.'),
      },
    },
    '0:34': {
      camera: {
        gear: tx('手持或稳定器；50–85mm。需要风：自然风、助理在画外甩布料，或者用电扇。', 'Handheld or gimbal; 50–85mm. You need wind: a natural breeze, an assistant flicking the fabric from off-screen, or a fan.'),
        settings: tx('60fps · 1/125 · f/2.8 · ISO 100 · 5600K（想更慢就用 120fps · 1/250）', '60fps · 1/125 · f/2.8 · ISO 100 · 5600K (for slower, 120fps · 1/250)'),
        nd: tx('快门变快已经挡掉 1–2 档光，ND 比平时少 1–2 档，约 3–4 档。', 'The faster shutter already cuts 1–2 stops, so use 1–2 stops less ND than usual: about 3–4.'),
        exposure: tx('阳光从布料背后透过来最好看。按布料最亮处曝光：调到 95% 斑马纹刚好不出现。', 'It looks best with sun shining through the fabric from behind. Expose for the brightest part of the fabric, until 95% zebras just disappear.'),
        focus: tx('布料一直在动，用连续对焦，或者把光圈收到 f/4 增加容错。', 'The fabric never stops moving: continuous AF, or stop down to f/4 for margin.'),
        tip: tx('剪辑时把 60fps 素材放进 24fps 时间线，速度就变成约 40% 的慢动作。', 'Drop the 60fps clip into a 24fps timeline and it plays back at about 40% speed: slow motion.'),
      },
      direct: {
        brief: tx('“这一条只拍裙子，不拍脸，要让布料飘起来。”', '"This one is only the dress, not your face. We want the fabric to float."'),
        cues: tx('“转身——慢慢走两步——停。”同时让助理在画外数“一、二、三，甩”。', '"Turn… two slow steps… stop." Meanwhile the assistant counts "one, two, three, flick" off-screen.'),
        pose: tx('慢慢转身或走两步，让裙摆跟着动；手可以轻轻提起一点裙角。', 'Turn slowly or take two steps so the skirt follows; she can lift the hem slightly.'),
        watch: tx('甩布料的人注意别进画面；电扇的电线别绊到人。', 'Keep the fabric flicker out of frame, and keep fan cables out of the walking path.'),
      },
    },
    '0:36': {
      camera: {
        gear: tx('三脚架或手持；35–50mm；用白色或银色反光板从下方给脸补光。', 'Tripod or handheld; 35–50mm; a white or silver reflector bouncing light up into her face.'),
        settings: tx('24fps · 1/50 · f/2.8 · ISO 100 · 5600K', '24fps · 1/50 · f/2.8 · ISO 100 · 5600K'),
        nd: tx('约 4–6 档。', 'About 4–6 stops.'),
        exposure: tx('阳光在她身后勾出轮廓，按脸曝光。反光板把脸补亮后，天空就不用过曝那么多。', 'The sun rims her from behind; expose for her face. With the reflector lifting her face, the sky doesn\'t have to blow out as much.'),
        focus: tx('眼部对焦。', 'Eye-detect autofocus.'),
        tip: tx('机位放低、镜头微微向上，人物更有气场。', 'Keep the camera low and tilted up slightly to give her presence.'),
      },
      direct: {
        brief: tx('“这一条要直视镜头，是整支片子里和观众对视的时刻。”', '"This one is straight into the lens: it\'s the moment in the film where you meet the viewer\'s eyes."'),
        cues: tx('“先眨一下眼——看镜头——保持——慢慢呼吸——好。”', '"Blink first… eyes to the lens… hold… breathe slowly… good."'),
        pose: tx('眼睛看镜头中心，不看人。表情平静、自信，不笑；肩膀放松，下巴微收。', 'Eyes on the center of the lens, not on a person. Calm and confident, no smile; shoulders relaxed, chin slightly down.'),
        watch: tx('直视镜头超过 4 秒容易僵、想眨眼。开拍前先眨眼，多拍几条短的。', 'Holding the lens for more than 4 seconds gets stiff and blinky. Blink before action and shoot several short takes.'),
      },
    },
    '0:38–0:40': {
      camera: {
        gear: tx('手持；标准镜头，约 35–50mm。', 'Handheld; a normal lens around 35–50mm.'),
        settings: tx('24fps · 1/50 · f/2.8 · ISO 100 · 5600K', '24fps · 1/50 · f/2.8 · ISO 100 · 5600K'),
        nd: tx('约 4–6 档。', 'About 4–6 stops.'),
        exposure: tx('正常曝光、正常拍彩色。褐色、黑白、片框和画格边全部在剪辑时加。', 'Expose normally and shoot in color. Sepia, black and white, the gate and the frame lines all go on in the edit.'),
        focus: tx('连续对焦加人脸识别。', 'Continuous AF with face detection.'),
        tip: tx('手持故意带一点晃，配合后期的胶片质感，更像家庭录像。', 'Let the handheld wobble a little; with the film treatment it reads like a home movie.'),
      },
      direct: {
        brief: tx('“这一段会做成老胶片的感觉，像回忆。你可以放松一点，不用一直看镜头。”', '"This part becomes old film, like a memory. Loosen up, you don\'t have to look at the lens the whole time."'),
        cues: tx('“抱住膝盖——头靠上去——看远处——慢慢转过来看我——想笑就笑。”', '"Hug your knees… rest your head on them… look off… slowly turn to me… smile if you feel like it."'),
        pose: tx('坐在墙上抱膝，头靠在膝盖上，偶尔看镜头、偶尔看远处。可以有一点笑，比其他镜头更随意。', 'Sitting on the wall hugging her knees, head resting on them, glancing between the lens and the distance. A small smile is welcome; looser than the other shots.'),
        watch: tx('告诉她这一段可以不完美，越自然越好。', 'Tell her this part can be imperfect: the more natural, the better.'),
      },
    },
    '0:42': {
      camera: {
        gear: tx('三脚架或手持；85mm；反光板给脸补光。', 'Tripod or handheld; 85mm; reflector for her face.'),
        settings: tx('24fps · 1/50 · f/2 · ISO 100 · 5600K', '24fps · 1/50 · f/2 · ISO 100 · 5600K'),
        nd: tx('光圈很大，约 5–7 档。', 'Very wide aperture: about 5–7 stops.'),
        exposure: tx('按脸曝光，把天空当作明亮的背景；70% 斑马纹落在脸颊亮部。', 'Expose for her face and treat the sky as a bright backdrop; 70% zebras on the bright cheek.'),
        focus: tx('f/2 景深很浅：开眼部对焦，对在离镜头近的那只眼睛上。', 'At f/2 the depth of field is razor thin: eye-detect AF on the eye nearer the lens.'),
        tip: tx('近景对晃动很敏感，尽量上三脚架；手持的话手肘夹紧身体。', 'Close-ups magnify shake, so use a tripod if you can; handheld, tuck your elbows in.'),
      },
      direct: {
        brief: tx('“近景，画面里只有你的脸和手臂，每个小表情都会被放大。”', '"Close-up, just your face and arms. Every tiny expression gets magnified."'),
        cues: tx('“看镜头——慢慢眨一下眼——嘴角放松——停。”', '"Eyes to the lens… one slow blink… relax your mouth… and cut."'),
        pose: tx('手臂搭在膝上，下巴可以轻靠手臂。只用眼睛和呼吸，动作非常小。', 'Arms resting on her knees, chin can lean on them. Only eyes and breath, very small.'),
        watch: tx('近景很容易拍出疲惫和晒红，拍之前先补妆、喝水。', 'Close-ups show tiredness and sunburn, so touch up makeup and have water first.'),
      },
    },
    '0:44': {
      camera: {
        gear: tx('微距镜头，或能近距离对焦的镜头；手持或三脚架。', 'Macro lens or a close-focusing lens; handheld or tripod.'),
        settings: tx('24fps · 1/50 · f/4–5.6 · ISO 100 · 5600K', '24fps · 1/50 · f/4–5.6 · ISO 100 · 5600K'),
        nd: tx('约 3–5 档。', 'About 3–5 stops.'),
        exposure: tx('让印花颜色饱和，宁可略暗。', 'Keep the print colors rich; slightly dark is better than bright.'),
        focus: tx('微距景深极浅：手动对焦，然后前后移动相机来找焦点。', 'Macro depth of field is tiny: set manual focus, then move the camera in and out to find it.'),
        tip: tx('布料可以穿在模特身上，也可以单独铺开拍，模特休息时就能拍。', 'The fabric can be on the model or laid out on its own, so you can shoot it while she rests.'),
      },
    },
    '0:46': {
      camera: {
        gear: tx('三脚架，低机位；长焦 85–135mm，人站得越远，太阳显得越大。', 'Tripod, low; 85–135mm telephoto. The farther back you stand, the bigger the sun looks.'),
        settings: tx('24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K', '24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K'),
        nd: tx('直接对着太阳，约 6–8 档；可变 ND 不够深就再叠一片固定 ND。', 'Straight into the sun: about 6–8 stops. Stack a fixed ND if the variable one runs out.'),
        exposure: tx('按太阳周围的天空曝光。人物几乎是剪影，头发边缘一圈亮光，这就是“光环”。', 'Expose for the sky around the sun. She becomes a near silhouette with a bright rim around her hair: that\'s the halo.'),
        focus: tx('手动对焦在人物上。', 'Manual focus on her.'),
        tip: tx('太阳接近地平线时只有几分钟，提前到位。上下左右挪相机，直到太阳正好藏在头后面。前景放一点干草，让它虚化。', 'With the sun near the horizon you only get a few minutes, so be set up early. Nudge the camera until the sun hides exactly behind her head. Put some dry grass in the foreground and let it go soft.'),
      },
      direct: {
        brief: tx('“这是剪影镜头，脸看不清。我会一点一点调整你的位置，让太阳藏在你头后面。”', '"This is a silhouette, your face won\'t show. I\'ll move you a little at a time until the sun hides behind your head."'),
        cues: tx('隔得远，用手机通话、对讲机或手势：“往左半步——再一点——停，别动。”', 'You\'re far apart: phone, walkie-talkie or hand signals. "Half a step left… a bit more… stop, hold it."'),
        pose: tx('完全静止，站直，手臂自然下垂或轻扶裙子。侧脸轮廓比正脸更好看。', 'Completely still, standing tall, arms down or lightly holding the dress. A profile reads better than facing camera.'),
        watch: tx('让她别看太阳。提前约好手势：手掌往左推表示往左挪，握拳表示停。', 'Tell her not to look at the sun. Agree on signals beforehand: palm pushing left means move left, a fist means stop.'),
      },
    },
    '0:48–0:50': {
      camera: {
        gear: tx('滑轨；没有就用稳定器慢慢横着走。35–50mm。', 'Slider, or walk slowly sideways on a gimbal if you don\'t have one. 35–50mm.'),
        settings: tx('24fps · 1/50 · f/4 · ISO 100 · 5600K', '24fps · 1/50 · f/4 · ISO 100 · 5600K'),
        nd: tx('太阳偏高、光最强，约 5–6 档（ND32–ND64）。', 'High sun is the brightest light: about 5–6 stops (ND32–ND64).'),
        exposure: tx('顶光会让眼窝发暗，她闭着眼影响不大。用反光板给脸补一下，免得阴影太硬。', 'Top light darkens the eye sockets, which matters less with her eyes closed. Bounce a reflector into her face to soften the shadows.'),
        focus: tx('横移时距离不变，手动对在脸上就行。', 'The distance stays the same while sliding, so manual focus on her face is enough.'),
        tip: tx('6–8 秒匀速滑完。先摆好水果道具，在取景器里检查有没有穿帮。', 'Slide evenly over 6–8 seconds. Dress the fruit first and check the frame for anything that shouldn\'t be there.'),
      },
      direct: {
        brief: tx('“你只要躺着、闭眼放松，镜头会从你身边横着滑过去。”', '"Just lie there with your eyes closed. The camera will slide past beside you."'),
        cues: tx('“闭眼——深呼吸——手指放松——好，别动，开始。”', '"Close your eyes… deep breath… relax your fingers… good, hold still, action."'),
        pose: tx('开拍前帮她把头发铺开、裙子理顺。手指放松，眉头不要皱，胸口有轻微的呼吸起伏。', 'Before rolling, fan out her hair and smooth the dress. Fingers soft, no frown, just a gentle rise and fall of breath.'),
        watch: tx('木栈道中午会很烫，先铺块布、用手试温度。拍完马上让她去阴凉处。', 'Boardwalks get hot at midday: lay down a cloth and test it with your hand. Get her into shade right after.'),
      },
    },
    '0:52–0:56': {
      camera: {
        gear: tx('稳定器；35mm；需要一个助手扶着摄影师的肩膀，引导摄影师倒着走。', 'Gimbal; 35mm; an assistant holds the operator\'s shoulder and guides them walking backward.'),
        settings: tx('24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K', '24fps · 1/50 · f/2.8–4 · ISO 100 · 5600K'),
        nd: tx('约 4–6 档。', 'About 4–6 stops.'),
        exposure: tx('人物走近时亮度基本不变，按脸曝光；拍的过程中不要改设置。', 'Her brightness barely changes as she walks, so expose for her face and don\'t touch settings mid-take.'),
        focus: tx('连续对焦加人脸识别；f/4 比 f/2.8 更不容易跑焦。', 'Continuous AF with face detection; f/4 loses focus less often than f/2.8.'),
        tip: tx('摄影师后退得比模特走得快，人物在画面里会越来越小，有一种离开的感觉。保持中轴对称，让栈道的线条指向画面中心。', 'The operator retreats faster than she walks, so she shrinks in frame and it feels like a goodbye. Keep it symmetrical, with the boardwalk lines pointing to the center.'),
      },
      direct: {
        brief: tx('“沿着栈道一直朝我走，我会一直往后退。走慢一点，不要看脚下。”', '"Keep walking toward me along the boardwalk while I back away. Walk slowly and don\'t look down."'),
        cues: tx('“开始——走——（10 秒后）看镜头——继续走——好，停。”', '"Action… walk… (after 10 seconds) eyes to the lens… keep walking… and cut."'),
        pose: tx('用平时 70% 的速度走，步子小，手臂自然摆。先看远处，最后几步看镜头。', 'Walk at about 70% of normal pace, small steps, arms swinging naturally. Look into the distance, then at the lens for the last few steps.'),
        watch: tx('倒着走的人看不到路，一定要有人扶着引导。先把路面上的东西清干净。', 'Whoever walks backward can\'t see where they\'re going, so someone must guide them. Clear the path first.'),
      },
    },
    '0:58': {},
  },
}

type PrimerItem = { title: Text; body: Text }

// General basics shown above the shot list, one set per layer.
export const cameraPrimer: PrimerItem[] = [
  { title: tx('用手动模式（M）', 'Shoot in manual (M)'), body: tx('视频里亮度忽明忽暗很难看。把模式拨到 M，快门、光圈、ISO 都自己定，整条画面的亮度才稳定。', 'Brightness that pumps up and down looks bad in video. Set the mode dial to M and choose shutter, aperture and ISO yourself so exposure stays steady.') },
  { title: tx('帧率和快门：24fps 配 1/50', 'Frame rate and shutter: 24fps at 1/50'), body: tx('快门约等于帧率的两倍（“180° 快门”），动作才有自然的动态模糊。升格慢动作：60fps 配 1/125，120fps 配 1/250。', 'Shutter at about double the frame rate (the "180° rule") gives natural motion blur. For slow motion: 60fps at 1/125, 120fps at 1/250.') },
  { title: tx('为什么一定要 ND 滤镜', 'Why you need an ND filter'), body: tx('晴天户外太亮：快门锁在 1/50、光圈开到 f/2.8 拍虚化背景、ISO 已经最低，画面还是过曝。ND 就像相机的墨镜，只减光，不改颜色。可变 ND 转一下就能调深浅，最方便。ND8 = 3 档，ND64 = 6 档，ND1000 = 10 档。顺序记住：先定快门和光圈，ISO 放最低，剩下的亮度交给 ND。', 'Sunny daylight is too bright: with the shutter at 1/50, the aperture at f/2.8 for a blurred background and ISO at its lowest, the image is still overexposed. An ND is sunglasses for the lens: it cuts light without changing color. A variable ND adjusts with a twist. ND8 = 3 stops, ND64 = 6, ND1000 = 10. The order: set shutter and aperture, ISO at minimum, then use the ND for the rest.') },
  { title: tx('逆光怎么曝光', 'Exposing in backlight'), body: tx('相机看到明亮的天空，会把整体压暗，脸就黑了。逆光时以脸为准：全手动时用 ND 调；用自动曝光时加 +1 到 +2 EV 曝光补偿。天空过曝发白可以接受，这种片子要的就是那层明亮的光晕。', 'The camera sees a bright sky and darkens everything, so the face goes black. In backlight, expose for the face: in full manual, adjust with the ND; on auto exposure, add +1 to +2 EV of exposure compensation. A blown-out white sky is fine; that bright glow is the look.') },
  { title: tx('斑马纹：看亮度的工具', 'Zebras: your brightness meter'), body: tx('在相机设置里打开斑马纹。设 95–100%：出现条纹的地方已经过曝、没有细节。设 70%：条纹刚好落在脸颊亮部，说明肤色亮度合适。只能设一个时，拍人先用 70%。', 'Turn on zebras in the camera menu. At 95–100%, stripes mean that area is clipped with no detail. At 70%, stripes just touching the bright cheek mean skin is well exposed. If you can only set one, use 70% for people.') },
  { title: tx('锁定白平衡', 'Lock the white balance'), body: tx('不要用自动白平衡，拍着拍着颜色会变。设成 5600K（日光），黄金时段的暖色会自然留下来。', 'Don\'t use auto white balance, or the color shifts mid-shot. Set 5600K (daylight) and golden-hour warmth stays in the image.') },
  { title: tx('对焦', 'Focus'), body: tx('人在动时用连续对焦加人脸、眼部识别。机位固定、对象不动时，手动对焦更稳：放大画面或打开峰值对焦来确认。', 'When people move, use continuous AF with face and eye detection. When camera and subject are still, manual focus is steadier: magnify the image or turn on focus peaking to check.') },
  { title: tx('色彩配置：新手先别用 Log', 'Picture profile: skip Log at first'), body: tx('先用标准或电影感配置（比如 S-Cinetone、Classic Neg），直出就好看。Log 后期空间大，但必须调色，而且要用相机标注的 Log 最低 ISO（常见 400–800），ND 也要多加 2–3 档。', 'Start with a standard or cinematic profile (such as S-Cinetone or Classic Neg) that looks good straight out of camera. Log gives more room in post but must be graded, and it needs its own minimum ISO (often 400–800) plus 2–3 more stops of ND.') },
  { title: tx('黄金时段', 'Golden hour'), body: tx('日出后一小时、日落前一小时，阳光低、暖、柔，最容易拍出这种片子的质感。用 App 查好日出日落时间，提前一小时到场布置。', 'The hour after sunrise and before sunset gives low, warm, soft sun, the easiest way to get this film\'s look. Check sunrise and sunset in an app and arrive an hour early to set up.') },
  { title: tx('保护眼睛和器材', 'Protect your eyes and gear'), body: tx('不要通过光学取景器直视太阳。镜头别长时间对着太阳不动，尤其是长焦；不拍的时候盖上镜头盖或转开。', 'Never look at the sun through an optical viewfinder. Don\'t leave the lens aimed at the sun, especially a telephoto; cap it or turn away between takes.') },
  { title: tx('用手机拍也可以', 'Shooting on a phone works too'), body: tx('装一个专业拍摄 App（比如 Blackmagic Camera），手动设快门 1/50，锁定 ISO 和白平衡；买一个夹式可变 ND。逆光时长按人脸锁定曝光和对焦（AE/AF 锁），再往上拖一点加亮。', 'Use a pro camera app (such as Blackmagic Camera), set the shutter to 1/50 and lock ISO and white balance; get a clip-on variable ND. In backlight, long-press her face to lock exposure and focus (AE/AF lock), then drag up a little to brighten.') },
]

export const directPrimer: PrimerItem[] = [
  { title: tx('拍摄前一天发给模特', 'Send the model this the day before'), body: tx('参考片链接、每个镜头一句话说明、服装清单、集合时间和地点、日出日落时间、要带的东西（平底鞋、防晒、水、发圈、肤色内衣）、妆发要求（长发自然散开，妆容清透有光泽），以及报酬和成片怎么使用。', 'The reference film link, one line per shot, the wardrobe list, call time and location, sunrise and sunset times, what to bring (flat shoes, sunscreen, water, hair ties, nude underwear), hair and makeup notes (long hair down and natural, fresh dewy makeup), and the pay and how the footage will be used.') },
  { title: tx('开拍前先说整体感觉', 'Set the mood before you start'), body: tx('用三个词描述，比如“安静、松弛、晒太阳的夏天”，再一起看一遍参考片。', 'Describe it in three words, for example "quiet, relaxed, sunlit summer", and watch the reference together once.') },
  { title: tx('每个镜头前说三件事', 'Three things before every shot'), body: tx('镜头在哪里、拍多大（全身、半身还是脸）、这一条唯一要做的动作。远景看不清表情，要用身体；近景只用眼睛。', 'Where the camera is, how big she is in frame (full body, half, or face), and the one action for this take. In wide shots the face doesn\'t read, so use the body; in close-ups, only the eyes.') },
  { title: tx('口令要固定', 'Keep the calls consistent'), body: tx('用“准备——开机——开始”开始，“好，停”结束。开机后等 2 秒再喊开始；动作结束后继续录 2 秒再停，给剪辑留余量。', 'Start with "ready… rolling… action" and end with "and cut." Wait 2 seconds after rolling before "action", and keep recording 2 seconds after the action ends, so the edit has handles.') },
  { title: tx('视频要慢一半', 'Video is half speed'), body: tx('拍照时模特习惯摆好造型就定住，视频要的是造型和造型之间的过程。让她把所有动作放慢到平时的一半。', 'In photos models hit a pose and freeze; video is about the movement between poses. Ask her to do everything at half her normal speed.') },
  { title: tx('给具体动作，不给抽象情绪', 'Give actions, not emotions'), body: tx('说“慢慢看向远处那棵树，再看回镜头”，比“表现得忧郁一点”有用得多。', '"Slowly look at that tree in the distance, then back at the lens" works far better than "be more melancholy."') },
  { title: tx('看镜头就是看镜头本身', 'Looking at the lens means the lens'), body: tx('告诉她看镜头玻璃的正中心，不要看你，也不要看屏幕，否则眼神会偏。', 'Tell her to look at the center of the glass, not at you or the screen, or her eyeline will be off.') },
  { title: tx('及时、具体地反馈', 'Quick, specific feedback'), body: tx('每条拍完给一句具体的话，比如“刚才转头很好，下次再慢一点”。拍到好的给她看一眼回放，她会更有信心。', 'After each take say one specific thing: "that head turn was great, a bit slower next time." Show her a good take on playback; it builds confidence.') },
  { title: tx('远距离怎么沟通', 'Talking at a distance'), body: tx('远景喊不到，就开着手机通话或用对讲机。也可以提前约定手势：手掌往左推 = 往左挪，握拳 = 停，竖大拇指 = 好。', 'For wide shots, keep a phone call open or use walkie-talkies. Or agree on hand signals: palm pushing left = move left, fist = stop, thumbs up = good.') },
  { title: tx('安全和体力', 'Safety and stamina'), body: tx('户外暴晒很累，每 20–30 分钟让她去阴凉处喝水、补妆。站在高处或倒着走的镜头必须有人保护。换衣服要有私密的地方。', 'Shooting in full sun is exhausting: every 20–30 minutes, get her into shade for water and touch-ups. Anything on a height or walking backward needs a spotter. Provide a private place to change.') },
  { title: tx('先拍简单的', 'Start with the easy shots'), body: tx('先拍远景和不看镜头的镜头，让她放松进入状态。直视镜头的近景留到她状态最好、光也最好的时候。', 'Begin with wide shots and ones that don\'t need eye contact so she can warm up. Save close-ups into the lens for when she\'s settled and the light is at its best.') },
]
