import TelegramBot from 'node-telegram-bot-api'

const token = process.env.BOT_TOKEN as string
//   const webHookUrl = process.env.WEBHOOK_URL as string
//   const url = `https://api.telegram.org/bot${token}/setWebhook?url=${webHookUrl}`

export const startBot = () => {
  const token = process.env.BOT_TOKEN
  const webHookUrl = process.env.WEBHOOK_URL

  if (!token || !webHookUrl) {
    throw new Error(
      'BOT_TOKEN or WEBHOOK_URL not defined in environment variables',
    )
  }

  const bot = new TelegramBot(token, { webHook: true })

  // Set webhook
  bot.setWebHook(`${webHookUrl}/bot${token}`)

  // Handle "/echo [message]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    if (!match) return
    const chatId = msg.chat.id
    const response = match[1] // Extract the message after "/echo"

    bot.sendMessage(chatId, response)
  })

  // Handle any message
  bot.on('message', (msg) => {
    const chatId = msg.chat.id

    // Send confirmation of message receipt
    bot.sendMessage(chatId, 'Received your message')
  })
}
