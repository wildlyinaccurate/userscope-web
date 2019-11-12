import mongoose from "mongoose"
import { Team, TeamDocument } from "./Team"

export type TestResultDocument = mongoose.Document & {
  _id: string
  url: string
  team: TeamDocument
}

const TestResultSchema = new mongoose.Schema(
  {
    url: String,
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Team
    }
  },
  { timestamps: true }
)
export const TestResult = mongoose.model<TestResultDocument>("TestResult", TestResultSchema)
