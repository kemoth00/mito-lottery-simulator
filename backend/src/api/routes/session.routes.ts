import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { AppError } from '../middleware/errorHandler'
import { 
  createSession,
  getSession,
  updateSessionTick,
  stopSession,
} from '../../db/repositories/sessionRepository'
import {
  insertDrawResult,
  getDrawResultsBySession,
} from '../../db/repositories/drawResultRepository'
import { runTick } from '../../simulation/simulationEngine'
import { validatePlayerNumbers } from '../../simulation/drawLogic'

const router = Router()

const createSessionSchema = z
  .object({
    playerMode: z.enum(['fixed', 'random']),
    playerNumbers: z.array(z.number().int().min(1).max(90)).length(5).optional(),
  })
  .refine(
    (data) => {
      if (data.playerMode === 'fixed') {
        return data.playerNumbers !== undefined && validatePlayerNumbers(data.playerNumbers)
      }
      return true
    },
    {
      message:
        'playerNumbers must be 5 unique strictly increasing integers between 1 and 90 when playerMode is "fixed"',
    },
  )

// POST /api/sessions — create a new simulation session
router.post('/', validate(createSessionSchema), async (req, res, next) => {
  try {
    const { playerMode, playerNumbers = null } = req.body
    const session = await createSession(playerMode, playerNumbers)
    res.status(201).json({ sessionId: session.id })
  } catch (err) {
    next(err)
  }
})

// POST /api/sessions/:id/tick — run one draw
router.post('/:id/tick', async (req, res, next) => {
  try {
    const session = await getSession(req.params.id)
    if (!session) throw new AppError(404, 'Session not found')
    if (session.status !== 'active') {
      throw new AppError(409, `Session is already ${session.status}`)
    }

    const result = runTick(session)

    await updateSessionTick(session.id, result.drawNumber, result.stats, result.status)

    if (result.matchCount >= 2) {
      await insertDrawResult(
        session.id,
        result.drawNumber,
        result.playerNumbers,
        result.draw,
        result.matchCount,
      )
    }

    res.json({
      draw: result.draw,
      playerNumbers: result.playerNumbers,
      matchCount: result.matchCount,
      stats: result.stats,
      status: result.status,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/sessions/:id/stop — manually stop a session
router.post('/:id/stop', async (req, res, next) => {
  try {
    const session = await getSession(req.params.id)
    if (!session) throw new AppError(404, 'Session not found')
    if (session.status !== 'active') {
      throw new AppError(409, `Session is already ${session.status}`)
    }
    await stopSession(session.id)
    res.json({ status: 'stopped' })
  } catch (err) {
    next(err)
  }
})

// GET /api/sessions/:id/stats — fetch final stats and winning draws for a session
router.get('/:id/stats', async (req, res, next) => {
  try {
    const session = await getSession(req.params.id)
    if (!session) throw new AppError(404, 'Session not found')

    const winningDraws = await getDrawResultsBySession(session.id)

    res.json({
      sessionId: session.id,
      status: session.status,
      playerMode: session.player_mode,
      stats: session.stats,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      winningDraws,
    })
  } catch (err) {
    next(err)
  }
})

export default router
