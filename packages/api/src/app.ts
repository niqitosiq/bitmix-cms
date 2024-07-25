import express from 'express'

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.use(express.json())

import { siteRoutes } from './routes/siteRoutes'
import { pageRouter } from './routes/pageRoutes'
import { categoryRouter } from './routes/categoryRoutes'
import { schemaRouter } from './routes/schemaRoutes'
import { frameRouter } from './routes/frameRoutes'

app.use(siteRoutes)
app.use(pageRouter)
app.use(categoryRouter)
app.use(schemaRouter)
app.use(frameRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
