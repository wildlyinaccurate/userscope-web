import bcrypt from "bcrypt-nodejs"
import crypto from "crypto"
import mongoose from "mongoose"
import { Team, TeamDocument } from "./Team"

export type UserDocument = mongoose.Document & {
  team: TeamDocument
  email: string
  password: string
  passwordResetToken: string
  passwordResetExpires: string

  profile: {
    name: string
    picture: string
  }

  comparePassword: comparePasswordFunction
}

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void

export interface AuthToken {
  accessToken: string
  kind: string
}

export const userSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Team
    },

    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: String,

    profile: {
      name: String,
      picture: String
    }
  },
  { timestamps: true }
)

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this as UserDocument
  if (!user.isModified("password")) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

userSchema.virtual("displayName").get(function() {
  return this.profile.name || this.email || this.id
})

userSchema.methods.comparePassword = function(
  candidatePassword: string,
  cb: (err: mongoose.Error, isMatch: boolean) => void
) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch)
  })
}

const getGravatar = (size: number) =>
  function() {
    if (!this.email) {
      return `https://gravatar.com/avatar/?s=${size}&d=retro`
    }

    const md5 = crypto
      .createHash("md5")
      .update(this.email)
      .digest("hex")

    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
  }

userSchema.virtual("gravatar").get(getGravatar(200))
userSchema.virtual("gravatarSmall").get(getGravatar(40))

export const User = mongoose.model<UserDocument>("User", userSchema)
