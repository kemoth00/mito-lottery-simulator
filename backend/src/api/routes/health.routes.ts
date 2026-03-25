import { Router } from 'express'
import prisma from '../../db/pool'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    next(err)
  }
})

export default router
