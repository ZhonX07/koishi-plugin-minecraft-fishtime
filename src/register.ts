import { Context, Session } from 'koishi'

export interface McftUser {
  id: number
  platform: string
  userId: string
  username: string
}

declare module 'koishi' {
  interface Tables {
    mcft_users: McftUser
  }
}

export function register(ctx: Context) {

  ctx.model.extend('mcft_users', {
    id: 'unsigned',
    platform: 'string',
    userId: 'string',
    username: 'string',
  }, {
    primary: 'id',
    autoInc: true,
  })

  const mcft = ctx.command('mcft', 'minecraft-fishtime')

  mcft.subcommand(
    '注册 <username>',
    '注册一个身份以使用 minecraft-fishtime 。您需要主动提供用户名，并且在未来不可更改。\n 不合法的名称将被打回，输入 mcft:帮助 以查看详细规则。',
    { authority: 0 }
  )
    .action(async ({ session }, username) => {

      if (!username) {
        return "请提供用户名。"
      }

      const regex = /^[A-Za-z0-9]+$/

      if (!regex.test(username)) {
        return "用户名不合法，请重新发起注册请求。"
      }

      const platform = session.platform
      const userId = session.userId

      await ctx.database.create('mcft_users', {
        platform,
        userId,
        username
      })

      return `注册成功，用户名：${username}`
    })

  mcft.subcommand('帮助', { authority: 0 })
    .action(() => {
      return("")
    })
}
