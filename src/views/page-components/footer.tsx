import React from "react"

export interface PartialPackage {
  name: string
  version: string
}

interface FooterProps {
  package: PartialPackage
  revision: string
}

export default function Footer(props: FooterProps) {
  return (
    <footer className="mt-5 py-5">
      <div className="container text-center">
        <small>
          {props.package.name} v{props.package.version} {props.revision}
        </small>
      </div>
    </footer>
  )
}
