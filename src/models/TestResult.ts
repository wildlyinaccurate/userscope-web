import { model } from "mongoose"
import { TestResultDocument, testResultSchema } from "userscope-data-models"

export const TestResult = model<TestResultDocument>("TestResult", testResultSchema)
