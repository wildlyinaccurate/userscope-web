import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"

type LoginViewProps = MainLayoutProps

const LoginView = (props: LoginViewProps) => (
  <MainLayout {...props}>
    <div className="page-header">
      <h1>Sign in</h1>
      <hr />
    </div>
    <form method="POST" className="form-horizontal">
      <input type="hidden" name="_csrf" value={props._csrf} />
      <div className="form-group row justify-content-md-center">
        <label htmlFor="email" className="col-sm-3 col-form-label text-right font-weight-bold">
          Email
        </label>
        <div className="col-sm-7">
          <input type="email" name="email" id="email" placeholder="Email" autoFocus required className="form-control" />
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
        <div className="offset-sm-3 col-sm-7">
          <button type="submit" className="col-sm-3 btn btn-primary">
            Login
          </button>
          <a href="/forgot" className="btn btn-link">
            Forgot your password?
          </a>
        </div>
      </div>
    </form>
  </MainLayout>
)

export default LoginView
