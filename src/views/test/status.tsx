import React, { Fragment } from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"
import { TestResultDocument } from "userscope-data-models"
import TestingInProgress from "views/page-components/test/in-progress"
import TestErrors from "views/page-components/test/errors"

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

interface BbcA11yResultErrorDetailsProps {
  error: BbcA11yResultError
}

function BbcA11yResultErrorDetails(props: BbcA11yResultErrorDetailsProps) {
  if (!props.error) {
    return null
  }

  if (props.error.length === 1) {
    return <li>{props.error[0]}</li>
  }

  const selectors = props.error.slice(1) as BbcA11yErrorSelector[]
  const errorPaths = selectors.map(error => <li key={error.xpath}>{error.xpath}</li>)

  return (
    <li>
      {props.error[0]}
      <ul>{errorPaths}</ul>
    </li>
  )
}

type BbcA11yResultsProps = {
  url: string
  errorsFound: number
  results: BbcA11yResultItem[]
}

function BbcA11yResults(props: BbcA11yResultsProps) {
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
          {result.errors.map(error => (
            <BbcA11yResultErrorDetails key={error[0]} error={error} />
          ))}
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
      <ul>{resultItems}</ul>
    </Fragment>
  )
}

interface BbcA11yResults {
  errorsFound: number
  results: BbcA11yResultItem[]
}

type TestStatusViewProps = MainLayoutProps & {
  testResult: TestResultDocument
  bbcA11y: BbcA11yResults
}

export default function TestStatusView(props: TestStatusViewProps) {
  return (
    <MainLayout {...props}>
      <TestingInProgress testResult={props.testResult} />
      <TestErrors errors={props.testResult.testingErrors} />
      <BbcA11yResults
        url={props.testResult.url}
        results={props.bbcA11y.results}
        errorsFound={props.bbcA11y.errorsFound}
      />
    </MainLayout>
  )
}
