import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import surveyRouter from './routes/survey';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient()
const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRouter)
app.use('/survey', surveyRouter)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!' })
})

const PORT = process.env.PORT || 3000

async function main() {
    try {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE "Option" ADD COLUMN IF NOT EXISTS votes INTEGER NOT NULL DEFAULT 0`
        )
    } catch (e) {
        console.error('DB init warning:', e)
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

main()
