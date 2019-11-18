import React, { Fragment } from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"
import { TestResultError, TestResultDocument } from "userscope-data-models"

interface TestErrorsProps {
  errors?: TestResultError[]
}

const TestErrorDetails = (props: { message: string }) => {
  if (!props.message) {
    return null
  }

  return <p className="text-monospace">{props.message}</p>
}

const TestErrors = (props: TestErrorsProps) => {
  if (!props.errors.length) {
    return null
  }

  const errorDetails = props.errors.map(testingError => (
    <div className="alert alert-danger">
      <p><b>{testingError.message}</b></p>
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

type BbcA11yErrorSelector = {
  xpath: string
}

type BbcA11yResultError = [string, ...BbcA11yErrorSelector[]]

type BbcA11yResultItem = {
  standard: {
    section: string
    name: string
  }
  errors: BbcA11yResultError[]
}

type BbcA11yResultErrorDetailsProps = {
  error: BbcA11yResultError
}

const BbcA11yResultErrorDetails = (props: BbcA11yResultErrorDetailsProps) => {
  if (!props.error) {
    return null
  }

  if (props.error.length === 1) {
    return (
      <li>{props.error[0]}</li>
    )
  }

  const errorPaths = props.error.slice(1).map((error: BbcA11yErrorSelector) => (
    <li>{error.xpath}</li>
  ))

  return (
    <li>
      {props.error[0]}
      <ul>
        {errorPaths}
      </ul>
    </li>
  )

  return null
}

type BbcA11yResultsProps = {
  url: string
  errorsFound: number
  results: BbcA11yResultItem[]
}

const BbcA11yResults = (props: BbcA11yResultsProps) => {
  if (!props.results) {
    return null
  }

  const resultItems = props.results.map(result => {
    const resultStyle = {
      color: result.errors.length ? "red" : "green"
    }

    let errorDetails = null

    if (result.errors.length) {
      errorDetails = (
        <ul>
          {result.errors.map(error => <BbcA11yResultErrorDetails error={error} />)}
        </ul>
      )
    }

    return (
      <li key={result.standard.name} style={resultStyle}>
        {result.standard.name}
        {errorDetails}
      </li>
    )
  })

  return (
    <Fragment>
      <h1>Test complete</h1>
      <h2>{props.url}</h2>
      <h3>{props.errorsFound} errors found</h3>

      <ul>
        {resultItems}
      </ul>
    </Fragment>
  )
}
interface BbcA11yResults {
  errorsFound: number
  results: BbcA11yResultItem[]
}

interface TestingInProgressProps {
  testResult: TestResultDocument
}

const TestingInProgress = (props: TestingInProgressProps) => {
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

type TestStatusViewProps = MainLayoutProps & {
  testResult: TestResultDocument
  bbcA11y: BbcA11yResults
}

const TestStatusView = (props: TestStatusViewProps) => (
  <MainLayout {...props}>
    <TestingInProgress testResult={props.testResult} />
    <TestErrors errors={props.testResult.testingErrors} />
    <BbcA11yResults url={props.testResult.url} results={props.bbcA11y.results} errorsFound={props.bbcA11y.errorsFound} />
  </MainLayout >
)

export default TestStatusView
