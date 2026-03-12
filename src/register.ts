import { Context } from 'koishi'
import { randomUUID } from 'crypto'

export interface McftUser {
  platform: string
  userId: string
  username: string
  uuid: string
}

declare module 'koishi' {
  interface Tables {
    mcfishtime_user: McftUser
  }
}

export function register(ctx: Context) {


  ctx.model.extend('mcfishtime_user', {
    platform: 'string',
    userId: 'string',
    username: 'string',
    uuid: 'string'
  }, {
    primary: 'uuid',
    autoInc: false
  })

  ctx.command('mcft.指南', '查看详细帮助')
    .action(() => {
      return `114514`
    })


  ctx.command('mcft.注册 <username>', '注册一个身份以使用 minecraft-fishtime。')
    .action(async ({ session }, username) => {
      if (!username) {
        return '请提供用户名。'
      }

      const regex = /^[A-Za-z0-9]+$/

      if (!regex.test(username)) {
        return '用户名不合法，请重新发起注册请求。'
      }

      const platform = session.platform
      const userId = session.userId


      const existAccount = await ctx.database.get('mcfishtime_user', {
        platform,
        userId
      })

      if (existAccount.length) {
        return '你已经注册过了。'
      }


      const existName = await ctx.database.get('mcfishtime_user', {
        username
      })

      if (existName.length) {
        return '用户名已被使用。'
      }

      const uuid = randomUUID()

      await ctx.database.create('mcfishtime_user', {
        platform,
        userId,
        username,
        uuid
      })

      return `注册成功，用户名：${username}`
    })

}

