import React from "react"

interface HeadingProps {
  title: string
}

export function PageHeading(props: HeadingProps) {
  return (
    <div>
      <h1>{props.title}</h1>
      <hr />
    </div>
  )
}

export function SectionHeading(props: HeadingProps) {
  return (
    <div>
      <h3>{props.title}</h3>
      <hr />
    </div>
  )
}
