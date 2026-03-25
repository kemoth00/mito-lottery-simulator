import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { errorHandler } from './api/middleware/errorHandler'
import healthRouter from './api/routes/health.routes'
import sessionRouter from './api/routes/session.routes'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/sessions', sessionRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
