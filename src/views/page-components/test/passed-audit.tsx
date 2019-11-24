import React from "react"
import CheckCircle from "@material-ui/icons/CheckCircleOutlined"

interface PassedAuditProps {
  name: string
}

export default function PassedAudit(props: PassedAuditProps) {
  return (
    <h5 className="text-success">
      <CheckCircle className="mr-1" />
      {props.name}
    </h5>
  )
}
