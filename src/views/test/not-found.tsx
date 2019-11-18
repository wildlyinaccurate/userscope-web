import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"

type TestNotFoundViewProps = MainLayoutProps

const TestNotFoundView = (props: TestNotFoundViewProps) => (
    <MainLayout {...props}>
        <div className="col-sm-8 offset-sm-2 text-center">
            <h1>Test result not found</h1>
            <p>The test you requested could not be found.</p>
        </div>
    </MainLayout>
)

export default TestNotFoundView
