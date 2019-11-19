import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"

type ForgotPasswordViewProps = MainLayoutProps

const ForgotPasswordView = (props: ForgotPasswordViewProps) => (
  <MainLayout {...props}>
    <div className="page-header">
      <h1>Forgot password</h1>
      <hr />
    </div>

    <div className="col-sm-8 offset-sm-2">
      <form method="POST">
        <input type="hidden" name="_csrf" value={props._csrf} />
        <div className="form-group">
          <p>Enter your email address below and we will send you password reset instructions.</p>
          <label htmlFor="email" className="col-form-label font-weight-bold">
            Email
          </label>
          <input type="email" name="email" id="email" placeholder="Email" autoFocus required className="form-control" />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  </MainLayout>
)

export default ForgotPasswordView
