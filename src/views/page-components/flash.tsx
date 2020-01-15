import React, { Fragment } from "react"

export type FlashMessage = {
  msg: string
}
export type FlashMessageContainer = {
  errors?: FlashMessage[]
  info?: FlashMessage[]
  success?: FlashMessage[]
}

interface MessageContainerProps {
  alertType: string
  messages?: FlashMessage[]
}

function MessageContainer(props: MessageContainerProps) {
  if (!props.messages) {
    return null
  }

  const messageDivs = props.messages.map((message, index) => <div key={index}>{message.msg}</div>)

  return (
    <div className={`alert alert-${props.alertType} fade show`}>
      <div className="container">
        <button type="button" data-dismiss="alert" className="close">
          &times;
        </button>
        {messageDivs}
      </div>
    </div>
  )
}

interface FlashMessagesProps {
  messages: FlashMessageContainer
}

export default function FlashMessages(props: FlashMessagesProps) {
  return (
    <Fragment>
      <MessageContainer alertType="danger" messages={props.messages.errors} />
      <MessageContainer alertType="info" messages={props.messages.info} />
      <MessageContainer alertType="success" messages={props.messages.success} />
    </Fragment>
  )
}
