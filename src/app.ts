import fs from "fs"
import express from "express"
import compression from "compression" // compresses requests
import session from "express-session"
import bodyParser from "body-parser"
import lusca from "lusca"
import flash from "express-flash"
import path from "path"
import mongoose from "mongoose"
import passport from "passport"
import bluebird from "bluebird"
import expressHandlebars from "express-handlebars"
import { MONGODB_URI, SESSION_SECRET } from "./util/config"
import mongo from "connect-mongo"
const MongoStore = mongo(session)

// Controllers (route handlers)
import * as homeController from "./controllers/home"
import * as userController from "./controllers/user"
import * as actionController from "./controllers/action"

// API keys and Passport configuration
import * as passportConfig from "./config/passport"

// Create Express server
const app = express()

// Connect to MongoDB
const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err)
})

// Local template variables
let revision = ""

if (fs.existsSync(`${__dirname}/../.revision`)) {
  revision = fs.readFileSync(`${__dirname}/../.revision`, "utf8").substring(0, 8)
} else {
  console.log("Couldn't find .revision file")
}

// Express configuration
app.set("port", process.env.PORT || 3000)
app.set("views", path.join(__dirname, "../views"))
app.engine("hbs", expressHandlebars({ extname: ".hbs" }))
app.set("view engine", "hbs")
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      autoReconnect: true,
      autoRemove: "disabled"
    })
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(lusca.xframe("SAMEORIGIN"))
app.use(lusca.xssProtection(true))
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.package = require("../package.json")
  res.locals.revision = revision

  next()
})
app.use((req, _, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.path
  } else if (req.user && req.path == "/account") {
    req.session.returnTo = req.path
  }
  next()
})

app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }))

// Primary app routes
app.get("/", homeController.index)
app.get("/login", userController.getLogin)
app.post("/login", userController.postLogin)
app.get("/logout", userController.logout)
app.get("/forgot", userController.getForgot)
app.post("/forgot", userController.postForgot)
app.get("/reset/:token", userController.getReset)
app.post("/reset/:token", userController.postReset)
app.get("/signup", userController.getSignup)
app.post("/signup", userController.postSignup)
app.get("/account", passportConfig.isAuthenticated, userController.getAccount)
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile)
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword)
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount)

// Action routes
app.post("/action/test", actionController.testAction)

export default app
