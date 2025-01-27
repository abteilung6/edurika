import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type TextInputProps = HTMLInputProps & {
  label?: string
  validationError?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  validationError,
  ...inputProps
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={inputProps.name}
          className="block text-sm/6 font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="mt-2">
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          {...inputProps}
        />
      </div>
      {validationError && (
        <p
          id={`${inputProps.name}-error`}
          className="mt-2 text-sm text-red-600"
        >
          {validationError}
        </p>
      )}
    </div>
  )
}
