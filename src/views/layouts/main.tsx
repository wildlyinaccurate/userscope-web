import React, { ReactNode, PropsWithChildren } from "react"
import Header from "../page-components/header"
import FlashMessages, { FlashMessageContainer } from "../page-components/flash"
import Footer, { IPartialPackage } from "../page-components/footer"
import { UserDocument } from "userscope-data-models"

export interface MainLayoutProps {
  title: string
  user: UserDocument
  messages: FlashMessageContainer
  scripts?: ReactNode
  package: IPartialPackage
  revision?: string
  _csrf: string
}

const MainLayout = (props: PropsWithChildren<MainLayoutProps>) => (
  <html className="no-js" lang="en">
    <head>
      <meta charSet="utf-8" />
      <title>{props.title} - UserScope</title>
      <meta
        name="description"
        content="UserScope is an automated accessibility testing tool. Get valuable insights and track your site's accessibility over time."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="csrf-token" content={props._csrf} />
      <meta name="theme-color" content="#fafafa" />

      <link rel="stylesheet" href="/vendor/bootstrap-4.3.1.min.css" />
      <link rel="stylesheet" href="/css/main.css" />
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400&display=swap" rel="stylesheet" />
    </head>

    <body>
      <Header user={props.user} />

      <div className="container pt-5 pl-sm-0 pr-sm-0 pl-lg-3 pr-lg-3">
        <FlashMessages messages={props.messages} />
        {props.children}
      </div>

      <Footer revision={props.revision} package={props.package} />

      <script src="/vendor/jquery-3.3.1.slim.min.js"></script>
      <script src="/vendor/bootstrap-4.3.1.min.js"></script>
      <script src="/vendor/Chart-2.8.0.bundle.min.js"></script>
      <script src="/js/main.js"></script>
      {props.scripts}
    </body>
  </html>
)

export default MainLayout
