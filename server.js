require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config')
const userRoutes = require('./routes/userRoutes')
const homeRoutes = require('./routes/homeRoutes')
const aboutRoutes = require('./routes/aboutRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const objectivesRoutes = require('./routes/objectivesRoutes')
const { header: newsHeaderRoutes, posts: newsPostRoutes } = require('./routes/newsRoutes')
const teamRoutes = require('./routes/teamRoutes')
const galleryRoutes = require('./routes/galleryRoutes')
const { page: partnershipPageRoutes, partners: partnerRoutes } = require('./routes/partnershipRoutes')
const contactRoutes = require('./routes/contactRoutes')
const foodPremisesRoutes = require('./routes/foodPremisesRoutes')
const careerRoutes = require('./routes/careerRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

connectDB()

const app = express()

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.options(/(.*)/, cors(corsOptions))
app.set('trust proxy', 1)
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

const sessionSecret = process.env.SESSION_SECRET || 'change_me'
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: 'sessions' }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

app.get('/', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/users', userRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/objectives', objectivesRoutes)
app.use('/api/news', newsHeaderRoutes)
app.use('/api/news-posts', newsPostRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/partnerships', partnershipPageRoutes)
app.use('/api/partners', partnerRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/food-premises', foodPremisesRoutes)
app.use('/api/careers', careerRoutes)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
