import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  fullWidth?: boolean
}

export const Button = ({
  fullWidth = false,
  children,
  ...props
}: ButtonProps) => {
  const fullWidthStyle = fullWidth ? 'w-full' : ''
  return (
    <button
      type="button"
      className={[
        'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-75',
        fullWidthStyle
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
