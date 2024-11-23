import http from 'node:http'
import { startBot } from './telegram'

const hostname = 'localhost' // or 'localhost'
const port = 3000

// startBot

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  let body = ''

  startBot()

  // req.on('data', (chunk) => {
  //   body += chunk.toString()
  // })

  // req.on('end', () => {
  //   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //   bot.onText(/\/echo (.+)/, (msg: { chat: { id: any } }, match: any[]) => {
  //     // 'msg' is the received Message from Telegram
  //     // 'match' is the result of executing the regexp above on the text content
  //     // of the message
  //     if (!match) return
  //     const chatId = msg.chat.id
  //     const resp = match[1] // the captured "whatever"

  //     // send back the matched "whatever" to the chat
  //     bot.sendMessage(chatId, resp)
  //   })

  //   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //   bot.on('message', (msg: { chat: { id: any } }) => {
  //     const chatId = msg.chat.id

  //     // send a message to the chat acknowledging receipt of their message
  //     bot.sendMessage(chatId, 'Received your message')
  //   })

  //   res.end('Hello, World!\n')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`)
})
