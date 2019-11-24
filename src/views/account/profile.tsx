import React from "react"
import MainLayout, { MainLayoutProps } from "../layouts/main"
import { PageHeading, SectionHeading } from "../page-components/headings"

type ProfileViewProps = MainLayoutProps

export default function ProfileView(props: ProfileViewProps) {
  return (
    <MainLayout {...props}>
      <PageHeading title="My account" />

      <form action="/account/profile" method="POST" className="form-horizontal">
        <input type="hidden" name="_csrf" value={props._csrf} />
        <div className="form-group row justify-content-md-center">
          <label htmlFor="email" className="col-sm-3 col-form-label text-right font-weight-bold">
            Email
          </label>
          <div className="col-sm-7">
            <input type="email" name="email" id="email" value={props.user.email} className="form-control" />
          </div>
        </div>
        <div className="form-group row justify-content-md-center">
          <label htmlFor="name" className="col-sm-3 col-form-label text-right font-weight-bold">
            Name
          </label>
          <div className="col-sm-7">
            <input type="text" name="name" id="name" value={props.user.profile.name} className="form-control" />
          </div>
        </div>
        <div className="form-group row justify-content-md-center">
          <label className="col-sm-3 col-form-label text-right font-weight-bold">Gravatar</label>
          <div className="col-sm-7">
            <img
              src={props.user.gravatar(100)}
              width="100"
              height="100"
              alt={props.user.displayName}
              className="profile"
            />
          </div>
        </div>
        <div className="form-group row justify-content-md-center">
          <div className="col-sm-4">
            <button type="submit" className="btn btn btn-primary">
              Update profile
            </button>
          </div>
        </div>
      </form>

      <SectionHeading title="Change password" />

      <form action="/account/password" method="POST" className="form-horizontal">
        <input type="hidden" name="_csrf" value={props._csrf} />
        <div className="form-group row justify-content-md-center">
          <label htmlFor="password" className="col-sm-3 col-form-label text-right font-weight-bold">
            New password
          </label>
          <div className="col-sm-7">
            <input type="password" name="password" id="password" className="form-control" />
          </div>
        </div>
        <div className="form-group row justify-content-md-center">
          <label htmlFor="confirmPassword" className="col-sm-3 col-form-label text-right font-weight-bold">
            Confirm password
          </label>
          <div className="col-sm-7">
            <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" />
          </div>
        </div>
        <div className="form-group row justify-content-md-center">
          <div className="col-sm-4">
            <button type="submit" className="btn btn-primary">
              Change password
            </button>
          </div>
        </div>
      </form>

      <SectionHeading title="Delete account" />

      <form action="/account/delete" method="POST" className="form-horizontal">
        <div className="form-group row justify-content-md-center">
          <p className="offset-sm-3 col-sm-7">
            You can delete your account, but keep in mind this action is irreversible.
          </p>
          <input type="hidden" name="_csrf" value={props._csrf} />
          <div className="col-sm-4">
            <button type="submit" className="btn btn-danger">
              Delete my account
            </button>
          </div>
        </div>
      </form>
    </MainLayout>
  )
}
