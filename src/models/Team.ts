import mongoose from "mongoose"

export type TeamDocument = mongoose.Document & {
  _id: string
}

const TeamSchema = new mongoose.Schema({}, { timestamps: true })
export const Team = mongoose.model<TeamDocument>("Team", TeamSchema)
