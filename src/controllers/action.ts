import { Request, Response } from "express"
import { StorageSharedKeyCredential, QueueServiceClient } from "@azure/storage-queue"
import { JOB_QUEUE_NAME, STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY } from "../util/config"
import { check, validationResult } from "express-validator"
import { UserDocument } from "userscope-data-models"
import { TestResult } from "../models/TestResult"

const account = STORAGE_ACCOUNT_NAME
const accountKey = STORAGE_ACCOUNT_KEY
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey)
const queueServiceClient = new QueueServiceClient(`https://${account}.queue.core.windows.net`, sharedKeyCredential)
const queueClient = queueServiceClient.getQueueClient(JOB_QUEUE_NAME)

export const testAction = async (req: Request, res: Response) => {
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
    const result = new TestResult({
      url: req.body.url,
      team: user.team._id
    })

    await result.save()

    const message = {
      testResultId: result._id,
      url: req.body.url
    }

    const encodedMessage = Buffer.from(JSON.stringify(message)).toString("base64")
    const sendMessageResponse = await queueClient.sendMessage(encodedMessage, {
      messageTimeToLive: 1 * 24 * 60 * 60
    })

    res.json(
      Object.assign({}, message, {
        messageId: sendMessageResponse.messageId
      })
    )
  } catch (error) {
    res.json({
      error: error
    })
  }
}
