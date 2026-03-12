import { Context, Schema } from 'koishi'
import { register } from './register'
import {GenerateInfo} from "./GenerateInfo";

export const name = 'minecraft-fishtime'

export const inject = ['puppeteer', 'database']


export interface Config {
  ChineseCharacterFontPrefer: string
  EnglishCharacterFontPrefer: string
  useGiteeMirror: boolean
}

export const usage = `
<p align="center">
  <img src="https://raw.githubusercontent.com/ZhonX07/koishi-plugin-minecraft-fishtime/main/model.png" width="500">
</p>

<h1 align="center">Minecraft Fishtime</h1>

<p align="center">
  Minecraft 风格钓鱼游戏插件
</p>

<p align="center">
部分图像资源来自 <b>Minecraft Wiki</b> ，原始版权归 <b>Mojang Studios</b> 与 <b>Microsoft</b> 所有。
</p>
<p align="center">
  本项目遵循许可协议 CC BY-NC-SA 3.0 对部分图像进行了裁剪、拼接处理或引用。
</p>

`.trim()

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

export function apply(ctx: Context, config: Config) {
  register(ctx)
  GenerateInfo(ctx,config)
}
