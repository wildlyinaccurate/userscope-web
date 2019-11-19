import React, { Fragment } from "react"
import { TestResultError } from "userscope-data-models"

interface TestErrorDetailsProps {
  message: string
}

function TestErrorDetails(props: TestErrorDetailsProps) {
  if (!props.message) {
    return null
  }

  return <p className="text-monospace">{props.message}</p>
}

interface TestErrorsProps {
  errors?: TestResultError[]
}

export default function TestErrors(props: TestErrorsProps) {
  if (!props.errors.length) {
    return null
  }

  const errorDetails = props.errors.map(testingError => (
    <div key={testingError.message} className="alert alert-danger">
      <p>
        <b>{testingError.message}</b>
      </p>
      <TestErrorDetails message={testingError.error.message} />
    </div>
  ))

  return (
    <Fragment>
      <h1>Test failed</h1>
      {errorDetails}
    </Fragment>
  )
}
