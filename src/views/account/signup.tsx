import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"
import { PageHeading } from "../page-components/headings"

type SignupViewProps = MainLayoutProps

export default function SignupView(props: SignupViewProps) {
  return (
    <MainLayout {...props}>
      <PageHeading title="Sign up" />

      <form id="signup-form" method="POST" className="form-horizontal">
        <input type="hidden" name="_csrf" value={props._csrf} />
        <div className="form-group row justify-content-md-center">
          <label htmlFor="email" className="col-sm-3 col-form-label text-right font-weight-bold">
            Email
          </label>
          <div className="col-sm-7">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              autoFocus
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group row justify-content-md-center">
          <label htmlFor="password" className="col-sm-3 col-form-label text-right font-weight-bold">
            Password
          </label>
          <div className="col-sm-7">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group row justify-content-md-center">
          <label htmlFor="confirmPassword" className="col-sm-3 col-form-label text-right font-weight-bold">
            Confirm Password
          </label>
          <div className="col-sm-7">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group row justify-content-md-center">
          <div className="offset-sm-3 col-sm-7">
            <button type="submit" className="btn btn-success">
              Signup
            </button>
          </div>
        </div>
      </form>
    </MainLayout>
  )
}
