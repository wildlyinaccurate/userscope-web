import { Request, Response } from "express"
import { UserDocument } from "userscope-data-models"
import { TestResult } from "../../models/TestResult"
import { Types } from "mongoose"
import { notFound } from "../../util/jsonResponse"

export const getTest = async (req: Request, res: Response) => {
  if (Types.ObjectId.isValid(req.params.testId)) {
    const testResult = await TestResult.findById(req.params.testId)

    if (testResult) {
      const user = req.user as UserDocument

      if ((!user && !testResult.team) || (user && user.team._id.toString() === testResult.team.toString())) {
        res.json(testResult)
      }
    }
  }

  notFound(res)
}
