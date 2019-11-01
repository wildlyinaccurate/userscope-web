import { Request, Response } from "express"
import { SharedKeyCredential, StorageURL, ServiceURL, QueueURL, MessagesURL, Aborter } from "@azure/storage-queue"
import { JOB_QUEUE_NAME, STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY } from "../util/secrets"
import { check, validationResult } from "express-validator"

export const testAction = async (req: Request, res: Response) => {
  await check("url", "A valid URL is required")
    .isURL()
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array())
    return res.redirect("/")
  }

  const account = STORAGE_ACCOUNT_NAME
  const accountKey = STORAGE_ACCOUNT_KEY

  const sharedKeyCredential = new SharedKeyCredential(account, accountKey)
  const pipeline = StorageURL.newPipeline(sharedKeyCredential)
  const serviceURL = new ServiceURL(`https://${account}.queue.core.windows.net`, pipeline)
  const queueURL = QueueURL.fromServiceURL(serviceURL, JOB_QUEUE_NAME)
  const messagesURL = MessagesURL.fromQueueURL(queueURL)

  try {
    const enqueueQueueResponse = await messagesURL.enqueue(Aborter.none, req.body.url, {
      messageTimeToLive: 1 * 24 * 60 * 60
    })

    res.json({
      success: true,
      messageId: enqueueQueueResponse.messageId
    })
  } catch (error) {
    res.json({
      success: false,
      error: error
    })
  }
}
