require('dotenv').config()
const express = require('express')
const expresslayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express()
const PORT = 5000 || process.env.PORT

const connect_db = require('./server/config/db.js')
connect_db()
const {isActiveRoute} = require('./server/helpers/routeHelper.js')

// able to parse the data through forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))

app.use(session({
	secret: 'blogapp',
	resave: false,
	saveUninitialized: true,
	store: MongoStore.create({
		mongoUrl: process.env.MDB
	}),
}
))

// public folder contains static files
app.use(express.static('public'))

// templating engine
app.use(expresslayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

app.listen(PORT, () => {
	console.log(`App Listening on PORT: ${PORT}`)
})