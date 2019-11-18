import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"

type ResetPasswordViewProps = MainLayoutProps

const ResetPasswordView = (props: ResetPasswordViewProps) => (
  <MainLayout {...props}>
    <div className="page-header">
      <h1>Reset password</h1>
      <hr />
    </div>

    <div className="col-sm-8 offset-sm-2">
      <form method="POST">
        <input type="hidden" name="_csrf" value={props._csrf} />
        <div className="form-group">
          <label htmlFor="password" className="col-form-label font-weight-bold">New Password</label>
          <input type="password" name="password" id="password" placeholder="New password" autoFocus required className="form-control" />
        </div>

        <div className="form-group">
          <label htmlFor="confirm" className="col-form-label font-weight-bold">Confirm Password</label>
          <input type="password" name="confirm" id="confirm" placeholder="Confirm password" required className="form-control" />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-reset">Change password</button>
        </div>
      </form>
    </div>
  </MainLayout>
)

export default ResetPasswordView
