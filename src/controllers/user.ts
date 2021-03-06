import async from "async"
import crypto from "crypto"
import nodemailer from "nodemailer"
import passport from "passport"
import { UserDocument, AuthToken } from "userscope-data-models"
import { Request, Response, NextFunction } from "express"
import { WriteError } from "mongodb"
import { check, validationResult } from "express-validator"
import "../config/passport"
import { User } from "../models/User"
import { Team } from "../models/Team"

export const getLogin = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect("/")
  }
  res.render("account/login", {
    title: "Login"
  })
}

export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid")
    .isEmail()
    .run(req)
  await check("password", "Password cannot be blank").run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("/login")
  }

  passport.authenticate("local", (err: Error, user: UserDocument) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash("errors", [{ msg: "Invalid email address or password" }])
      return res.redirect("/login")
    }
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }
      req.flash("success", [{ msg: "Success! You are logged in." }])
      res.redirect(req.session.returnTo || "/")
    })
  })(req, res, next)
}

export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect("/")
}

export const getSignup = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect("/")
  }
  res.render("account/signup", {
    title: "Create Account"
  })
}

export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid")
    .isEmail()
    .run(req)
  await check("password", "Password must be at least 6 characters long")
    .isLength({ min: 6 })
    .run(req)
  await check("confirmPassword", "Passwords do not match")
    .equals(req.body.password)
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("/signup")
  }

  const team = new Team({ name: "My Team" })

  await team.save()

  const user = new User({
    team: team._id,
    email: req.body.email,
    password: req.body.password
  })

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err)
    }
    if (existingUser) {
      req.flash("errors", [{ msg: "Account with that email address already exists." }])
      return res.redirect("/signup")
    }
    user.save(err => {
      if (err) {
        return next(err)
      }
      req.logIn(user, err => {
        if (err) {
          return next(err)
        }
        res.redirect("/")
      })
    })
  })
}

export const getAccount = (_: Request, res: Response) => {
  res.render("account/profile", {
    title: "Account Management"
  })
}

export const postUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Please enter a valid email address.")
    .isEmail()
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("/account")
  }

  const user = req.user as UserDocument
  User.findById(user.id, (err, user: UserDocument) => {
    if (err) {
      return next(err)
    }
    user.email = req.body.email || ""
    user.profile.name = req.body.name || ""
    user.save((err: WriteError) => {
      if (err) {
        if (err.code === 11000) {
          req.flash("errors", [{ msg: "The email address you have entered is already associated with an account." }])
          return res.redirect("/account")
        }
        return next(err)
      }
      req.flash("success", [{ msg: "Profile information has been updated." }])
      res.redirect("/account")
    })
  })
}

export const postUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
  await check("password", "Password must be at least 4 characters long")
    .isLength({ min: 4 })
    .run(req)
  await check("confirmPassword", "Passwords do not match")
    .equals(req.body.password)
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("/account")
  }

  const user = req.user as UserDocument
  User.findById(user.id, (err, user: UserDocument) => {
    if (err) {
      return next(err)
    }
    user.password = req.body.password
    user.save((err: WriteError) => {
      if (err) {
        return next(err)
      }
      req.flash("success", [{ msg: "Password has been changed." }])
      res.redirect("/account")
    })
  })
}

export const postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as UserDocument
  User.remove({ _id: user.id }, err => {
    if (err) {
      return next(err)
    }
    req.logout()
    req.flash("info", { msg: "Your account has been deleted." })
    res.redirect("/")
  })
}

export const getReset = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires")
    .gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        req.flash("errors", [{ msg: "Password reset token is invalid or has expired." }])
        return res.redirect("/forgot")
      }
      res.render("account/reset", {
        title: "Password Reset"
      })
    })
}

export const postReset = async (req: Request, res: Response, next: NextFunction) => {
  await check("password", "Password must be at least 4 characters long.")
    .isLength({ min: 4 })
    .run(req)
  await check("confirm", "Passwords must match.")
    .equals(req.body.password)
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("back")
  }

  async.waterfall(
    [
      function resetPassword(done: Function) {
        User.findOne({ passwordResetToken: req.params.token })
          .where("passwordResetExpires")
          .gt(Date.now())
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .exec((err, user: any) => {
            if (err) {
              return next(err)
            }
            if (!user) {
              req.flash("errors", [{ msg: "Password reset token is invalid or has expired." }])
              return res.redirect("back")
            }
            user.password = req.body.password
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            user.save((err: WriteError) => {
              if (err) {
                return next(err)
              }
              req.logIn(user, err => {
                done(err, user)
              })
            })
          })
      },
      function sendResetPasswordEmail(user: UserDocument, done: Function) {
        const transporter = nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD
          }
        })
        const mailOptions = {
          to: user.email,
          from: "express-ts@starter.com",
          subject: "Your password has been changed",
          text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
        }
        transporter.sendMail(mailOptions, err => {
          req.flash("success", [{ msg: "Success! Your password has been changed." }])
          done(err)
        })
      }
    ],
    err => {
      if (err) {
        return next(err)
      }
      res.redirect("/")
    }
  )
}

export const getForgot = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  res.render("account/forgot", {
    title: "Forgot Password"
  })
}

export const postForgot = async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Please enter a valid email address.")
    .isEmail()
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("/forgot")
  }

  async.waterfall(
    [
      function createRandomToken(done: Function) {
        crypto.randomBytes(16, (err, buf) => {
          const token = buf.toString("hex")
          done(err, token)
        })
      },
      function setRandomToken(token: AuthToken, done: Function) {
        User.findOne({ email: req.body.email }, (err, user: any) => {
          if (err) {
            return done(err)
          }
          if (!user) {
            req.flash("errors", [{ msg: "Account with that email address does not exist." }])
            return res.redirect("/forgot")
          }
          user.passwordResetToken = token
          user.passwordResetExpires = Date.now() + 3600000 // 1 hour
          user.save((err: WriteError) => {
            done(err, token, user)
          })
        })
      },
      function sendForgotPasswordEmail(token: AuthToken, user: UserDocument, done: Function) {
        const transporter = nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD
          }
        })
        const mailOptions = {
          to: user.email,
          from: "hackathon@starter.com",
          subject: "Reset your password on Hackathon Starter",
          text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }
        transporter.sendMail(mailOptions, err => {
          req.flash("info", [{ msg: `An e-mail has been sent to ${user.email} with further instructions.` }])
          done(err)
        })
      }
    ],
    err => {
      if (err) {
        return next(err)
      }
      res.redirect("/forgot")
    }
  )
}
