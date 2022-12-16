const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const passport = require('passport')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

//Load Config
dotenv.config({path: './config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helpers
const {
    formatDate, stripTags, truncate
} = require('./helpers/hbs')

//HandleBars
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: "main",
    helpers: {
        formatDate,
        stripTags,
        truncate
    }
}));
app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'keyboard car',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server running in  ${process.env.NODE_ENV} on PORT ${PORT}`)
})
