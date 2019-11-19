import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"

type TestErrorViewProps = MainLayoutProps

export default function TestErrorView(props: TestErrorViewProps) {
  return (
    <MainLayout {...props}>
      <div className="col-sm-8 offset-sm-2 text-center">
        <h1>Test error</h1>
        <p>We weren&apos;t able to run your test.</p>
      </div>
    </MainLayout>
  )
}
