import React, { PropsWithChildren } from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"
import { TestResultDocument } from "userscope-data-models"
import { PageHeading } from "../page-components/headings"

type TestHistoryViewProps = MainLayoutProps & {
  tests: TestResultDocument[]
}

export default function TestHistoryView(props: TestHistoryViewProps) {
  return (
    <MainLayout {...props}>
      <PageHeading title="Test history" />

      <p>
        <b>Showing {props.tests.length} test results</b>
      </p>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">URL</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {props.tests.map(test => (
            <tr key={test._id}>
              <th scope="row" className="text-nowrap">
                <TestResultLink test={test}>{test.createdAt.toLocaleString()}</TestResultLink>
              </th>
              <td>
                <TestResultLink test={test}>{test.url}</TestResultLink>
              </td>
              <td>
                <TestResultLink test={test}>
                  <TestResultSummary test={test} />
                </TestResultLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  )
}

interface TestComponentProps {
  test: TestResultDocument
}

function TestResultLink(props: PropsWithChildren<TestComponentProps>) {
  return <a href={`/test/status/${props.test._id}`}>{props.children}</a>
}

function TestResultSummary({ test }: TestComponentProps) {
  if (test.testingErrors.length) {
    return <span className="text-danger">Did not run</span>
  }

  return <span className="text-success">No errors</span>
}
