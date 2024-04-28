require('dotenv').config()
const express = require('express')
const expresslayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')

const connect_db = require('./server/config/db.js')
const { isActiveRoute } = require('./server/helpers/routeHelper.js')

const app = express()
const PORT = 5000 || process.env.PORT

connect_db()


// Parse form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))


// Public folder contains static files
app.use(express.static('public'))

// EJS templating engine
app.use(expresslayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// Active Route (for css)
app.locals.isActiveRoute = isActiveRoute;

// Routes
app.use('/', require('./server/routes/mainRoutes.js'))
app.use('/', require('./server/routes/userRoutes.js'))

app.listen(PORT, () => {
	console.log(`App Listening on PORT: ${PORT}`)
})