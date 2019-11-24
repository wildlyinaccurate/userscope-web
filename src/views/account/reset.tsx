import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"
import { PageHeading } from "../page-components/headings"

type ResetPasswordViewProps = MainLayoutProps

export default function ResetPasswordView(props: ResetPasswordViewProps) {
  return (
    <MainLayout {...props}>
      <PageHeading title="Reset password" />

      <div className="col-sm-8 offset-sm-2">
        <form method="POST">
          <input type="hidden" name="_csrf" value={props._csrf} />
          <div className="form-group">
            <label htmlFor="password" className="col-form-label font-weight-bold">
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="New password"
              autoFocus
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm" className="col-form-label font-weight-bold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              id="confirm"
              placeholder="Confirm password"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-reset">
              Change password
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
