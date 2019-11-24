import React, { Fragment } from "react"
import Error from "@material-ui/icons/ErrorOutlined"

type BbcA11yErrorSelector = {
  xpath: string
}

type BbcA11yResultError = [string, ...BbcA11yErrorSelector[]]

interface FailedAuditProps {
  name: string
  errors: BbcA11yResultError[]
}

type CombinedErrors = {
  [key: string]: BbcA11yErrorSelector[]
}

export default function FailedAudit(props: FailedAuditProps) {
  const combinedErrors: CombinedErrors = {}

  props.errors.forEach(error => {
    const errorName = error[0]
    const errorDetails = error.slice(1) as BbcA11yErrorSelector[]

    if (!combinedErrors.hasOwnProperty(errorName)) {
      combinedErrors[errorName] = []
    }

    combinedErrors[errorName] = combinedErrors[errorName].concat(errorDetails)
  })

  return (
    <Fragment>
      <h5 className="text-danger">
        <Error className="mr-1" />
        {props.name}
      </h5>
      {Object.entries(combinedErrors).map(([errorName, errorDetails]) => (
        <ErrorDetails key={errorName} errorName={errorName} errors={errorDetails} />
      ))}
    </Fragment>
  )
}

function ErrorDetails(props: { errorName: string; errors: BbcA11yErrorSelector[] }) {
  const peekErrors = props.errors.slice(0, 5)
  const moreErrors = props.errors.slice(5).length

  return (
    <Fragment>
      <p>{props.errorName}</p>
      <ul>
        {peekErrors.map((error, index) => (
          <li key={index}>
            <code>{error.xpath}</code>
          </li>
        ))}
        {moreErrors ? <li>{moreErrors} more...</li> : null}
      </ul>
    </Fragment>
  )
}
