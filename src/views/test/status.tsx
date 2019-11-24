import React, { Fragment } from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"
import { TestResultDocument } from "userscope-data-models"
import TestingInProgress from "../page-components/test/in-progress"
import TestErrors from "../page-components/test/errors"
import PassedAudit from "../page-components/test/passed-audit"
import FailedAudit from "../page-components/test/failed-audit"

type AuditBySection = {
  [key: string]: BbcA11yResultItem[]
}

function auditsBySection(audits: BbcA11yResultItem[]): AuditBySection {
  const sections: AuditBySection = {}

  audits.forEach(audit => {
    const section = audit.standard.section

    if (!sections.hasOwnProperty(section)) {
      sections[section] = []
    }

    sections[section].push(audit)
  })

  return sections
}

function passedAudits(audits: BbcA11yResultItem[]) {
  return audits.filter(audit => audit.errors.length === 0)
}

function failedAudits(audits: BbcA11yResultItem[]) {
  return audits.filter(audit => audit.errors.length > 0)
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

type BbcA11yResultsProps = {
  url: string
  errorsFound: number
  results: BbcA11yResultItem[]
}

function BbcA11yResults(props: BbcA11yResultsProps) {
  if (!props.results) {
    return null
  }

  const passedSections = auditsBySection(passedAudits(props.results))
  const failedSections = auditsBySection(failedAudits(props.results))

  return (
    <Fragment>
      <div className="row">
        <div className="col-md-6">
          <h1>Test results</h1>
          <h2>{props.errorsFound} accessibility issues found</h2>
        </div>
        <div className="col-md-6 text-right">
          <p className="lead text-muted text-truncate" title={props.url}>
            {props.url}
          </p>
        </div>
      </div>

      {Object.entries(failedSections).map(([sectionName, results]) => (
        <div key={sectionName} className="mt-3">
          <h3>{sectionName}</h3>
          <div className="row">
            {results.map(result => (
              <div className="col-sm-6" key={result.standard.name}>
                <FailedAudit name={result.standard.name} errors={result.errors} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.entries(passedSections).map(([sectionName, results]) => (
        <div key={sectionName} className="mt-3">
          <h3>{sectionName}</h3>
          <div className="row">
            {results.map(result => (
              <div className="col-sm-6" key={result.standard.name}>
                <PassedAudit name={result.standard.name} />
              </div>
            ))}
          </div>
        </div>
      ))}
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
