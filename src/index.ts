import { Context, Schema } from 'koishi'
import { register } from './register'

export const name = 'minecraft-fishtime'

export interface Config {}

export const inject = ['puppeteer', 'database']

export const usage = `
<p align="center">
  <img src="https://raw.githubusercontent.com/ZhonX07/koishi-plugin-minecraft-fishtime/main/model.png" width="500">
</p>

<h1 align="center">Minecraft Fishtime</h1>

<p align="center">
  一个 Minecraft 风格的钓鱼系统插件
</p>
`

export const Config: Schema<Config> = Schema.object({
  ChineseCharacterFontPrefer: Schema.string()
    .default('HarmonyOS Sans SC')
    .description('您更希望使用的中文字体。我们更推荐您将中文字体设置为 **HarmonyOS Sans SC** 等黑体字体。'),
  EnglishCharacterFontPrefer: Schema.string()
    .default('Minecraft Seven')
    .description('您更希望使用的英文字体。我们更推荐您将英文字体设置为 **Minecraft Seven**'),
  useGiteeMirror: Schema.boolean()
    .default(true)
    .description('使用 Gitee 镜像源获取必要的图片资源。如果你是中国大陆的用户或实例运行在中国大陆/内地境内且无法使用代理，建议开启此功能。'),
})

export function apply(ctx: Context, _config: Config) {
  register(ctx)
}
