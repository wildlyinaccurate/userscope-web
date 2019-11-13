import { model } from "mongoose"
import { UserDocument, userSchema } from "userscope-data-models"

export const User = model<UserDocument>("User", userSchema)
