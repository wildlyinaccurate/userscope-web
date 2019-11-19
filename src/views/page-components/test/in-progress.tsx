import React, { Fragment } from "react"
import { TestResultDocument } from "userscope-data-models"

interface TestingInProgressProps {
  testResult: TestResultDocument
}

export default function TestingInProgress(props: TestingInProgressProps) {
  if (props.testResult.bbcA11yResults || props.testResult.testingErrors.length) {
    return null
  }

  return (
    <Fragment>
      <h1>Test in progress</h1>
      <div className="progress test-progress">
        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: "100%" }}>
          Testing {props.testResult.url}
        </div>
      </div>
    </Fragment>
  )
}
