import React from 'react'
import './MaterialButton.scss'

const MaterialButton:
  React.FC<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
    & { materialSpan?: { id?: string, className?: string } } & { label?: JSX.Element }
  >
  = ({ materialSpan, children, label, ...buttonProps }) => {
    return (
      <button {...buttonProps} className={`material-button ${buttonProps.className || ""}`} >
        <span className={`material-icons ${materialSpan?.className || ""}`} id={materialSpan?.id || ""}>{children}</span>
        {label && label}
      </button>
    )
  }

export default MaterialButton