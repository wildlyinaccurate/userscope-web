import { model } from "mongoose"
import { TeamDocument, teamSchema } from "userscope-data-models"

export const Team = model<TeamDocument>("Team", teamSchema, "users")
