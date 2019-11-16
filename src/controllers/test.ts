import { Request, Response } from "express"
import { StorageSharedKeyCredential, QueueServiceClient } from "@azure/storage-queue"
import { JOB_QUEUE_NAME, STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY } from "../util/config"
import { check, validationResult } from "express-validator"
import { UserDocument, JobQueueMessage } from "userscope-data-models"
import { TestResult } from "../models/TestResult"

const account = STORAGE_ACCOUNT_NAME
const accountKey = STORAGE_ACCOUNT_KEY
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey)
const queueServiceClient = new QueueServiceClient(`https://${account}.queue.core.windows.net`, sharedKeyCredential)
const queueClient = queueServiceClient.getQueueClient(JOB_QUEUE_NAME)

export const postRunTest = async (req: Request, res: Response) => {
  await check("url", "A valid URL is required")
    .isURL()
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("/")
  }

  try {
    const user = req.user as UserDocument
    const testResult = new TestResult({
      url: req.body.url,
      team: user ? user.team._id : null
    })

    await testResult.save()

    const message: JobQueueMessage = {
      testResultId: testResult._id,
      url: req.body.url
    }

    const encodedMessage = Buffer.from(JSON.stringify(message)).toString("base64")
    await queueClient.sendMessage(encodedMessage, {
      messageTimeToLive: 1 * 24 * 60 * 60
    })

    req.flash("success", [{ msg: "Your test has been scheduled. The results will be available soon." }])
    res.redirect(`/test/status/${testResult._id}`)
  } catch (error) {
    res.render("test/error", {
      title: "Test error"
    })
  }
}

export const getTestStatus = async (req: Request, res: Response) => {
  const user = req.user as UserDocument
  const testResult = await TestResult.findById(req.params.testId)

  if (testResult) {
    if ((!user && !testResult.team) || (user && user.team._id.toString() === testResult.team.toString())) {
      const viewData = {
        testResult,
        title: "Test status",
        bbcA11y: {}
      }

      if (testResult.bbcA11yResults) {
        viewData.bbcA11y = {
          results: testResult.bbcA11yResults.data.pages[0].result.results,
          errorsFound: testResult.bbcA11yResults.data.pages[0].result.errorsFound
        }
      }

      return res.render("test/status", viewData)
    }
  }

  res.render("test/not-found", {
    title: "Test not found"
  })
}
