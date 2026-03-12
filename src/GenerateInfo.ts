import { Context } from 'koishi'
import type { Config } from './index'

function isFontPath(font: string) {
  return (
    font.includes('/') ||
    font.includes('\\') ||
    font.endsWith('.ttf') ||
    font.endsWith('.otf') ||
    font.endsWith('.woff')
  )
}

function buildFontCSS(font: string, name: string) {
  if (!isFontPath(font)) return ''

  const url = 'file:///' + font.replace(/\\/g, '/')

  return `
  @font-face{
    font-family:'${name}';
    src:url('${url}');
    font-weight:normal;
    font-style:normal;
  }
  `
}

export function GenerateInfo(ctx: Context, config: Config) {

  ctx.command('mcft.生成简介', '生成你的简介')
    .action(async ({ session }) => {

      const result = await ctx.database.get('mcfishtime_user', {
        platform: session.platform,
        userId: session.userId
      })

      const registered = result.length > 0

      const username = registered
        ? result[0].username
        : '访客'

      const cardHeight = registered ? 650 : 400
      const bannerHeight = registered ? 150 : 120

      const texture = registered
        ? "https://raw.githubusercontent.com/ZhonX07/Minecraft-Fishtime-SourceFile/main/blockBackGround/cs.png"
        : "https://raw.githubusercontent.com/ZhonX07/Minecraft-Fishtime-SourceFile/main/blockBackGround/c.png"

      const bannerFilter = registered
        ? ""
        : "filter:grayscale(100%) brightness(1.1);"

      const enFont = config?.EnglishCharacterFontPrefer ?? "sans-serif"
      const zhFont = config?.ChineseCharacterFontPrefer ?? "sans-serif"

      const enFontName = isFontPath(enFont) ? "mcftEN" : enFont
      const zhFontName = isFontPath(zhFont) ? "mcftZH" : zhFont

      const fontCSS =
        buildFontCSS(enFont, "mcftEN") +
        buildFontCSS(zhFont, "mcftZH")

      const guestPanel = registered
        ? ""
        : `
<div class="mc-text-gui">

  <div class="mc-gui-content">
    您尚未注册 Minecraft Fishtime。<br>
    请先使用
    <span class="mc-gui-highlight">
    mcft 注册 &lt;您的用户名&gt;
    </span>
    指令进行注册。
  </div>

</div>
`

      const html = `
<html>
<head>
<meta charset="utf-8">

<style>

${fontCSS}

body{
  margin:0;
  width:400px;
  height:${cardHeight}px;

  font-family:
  '${enFontName}',
  '${zhFontName}',
  "Microsoft YaHei",
  "PingFang SC",
  sans-serif;
}

.card{
  width:400px;
  height:${cardHeight}px;
  position:relative;

  background-image:url("${texture}");
  background-repeat:repeat;

  overflow:hidden;
}

.banner{
  position:absolute;
  width:400px;
  height:${bannerHeight}px;

  background-image:url("https://raw.githubusercontent.com/ZhonX07/Minecraft-Fishtime-SourceFile/main/banner.png");
  background-position:center;
  background-repeat:no-repeat;
  background-size:cover;

  ${bannerFilter}

  z-index:1;
}

.logo{
  position:absolute;
  right:10px;
  bottom:10px;

  width:100px;
  height:20px;

  background-image:url("https://raw.githubusercontent.com/ZhonX07/koishi-plugin-minecraft-fishtime/main/model.png");
  background-size:contain;
  background-repeat:no-repeat;

  opacity:0.9;
}

.avatar{
  position:absolute;
  top:${bannerHeight}px;
  left:15px;
  transform:translateY(-50%);

  width:80px;
  height:80px;

  border-radius:50%;
  border:4px solid white;

  background-image:url("https://raw.githubusercontent.com/ZhonX07/Minecraft-Fishtime-SourceFile/main/Avatar.jpg");
  background-size:cover;

  z-index:5;
}

.usernameBar{
  position:absolute;
  top:${bannerHeight}px;
  left:0;

  width:400px;
  height:36px;

  background-image:url("https://raw.githubusercontent.com/ZhonX07/Minecraft-Fishtime-SourceFile/main/blockBackGround/cqb.png");
  background-repeat:repeat;

  display:flex;
  align-items:center;

  z-index:2;
}

.username{
  margin-left:105px;

  font-size:24px;
  font-weight:bold;

  color:${registered ? "#222" : "#666"};

  font-family:
  '${enFontName}',
  '${zhFontName}',
  sans-serif;
}

.mc-text-gui{
  position:absolute;

  top:200px;
  left:20px;
  right:20px;

  min-height:120px;

  background-color:#c6c6c6;

  border:2px solid #fff;
  border-right-color:#373737;
  border-bottom-color:#373737;

  box-shadow:
    inset 0 0 0 2px #8b8b8b,
    inset 2px 2px 0 2px #373737,
    inset -2px -2px 0 2px #ffffff;

  padding:16px;

  display:flex;
  justify-content:center;
  align-items:center;

  text-align:center;

  z-index:1;
}

.mc-gui-content{
  font-size:15px;
  line-height:1.8;
  color:#373737;
}

.mc-gui-highlight{
  font-weight:bold;
}

</style>
</head>

<body>

<div class="card">

  <div class="banner">
    <div class="logo"></div>
  </div>

  <div class="usernameBar">
    <div class="username">${username}</div>
  </div>

  <div class="avatar"></div>

  ${guestPanel}

</div>

</body>
</html>
`

      return await ctx.puppeteer.render(html)
    })
}
