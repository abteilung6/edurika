import React, { DetailedHTMLProps, TextareaHTMLAttributes } from 'react'

type TextAreaInputProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

type TextAreaProps = TextAreaInputProps & {
  validationError?: string
}

export const TextArea: React.FC<TextAreaProps> = ({
  validationError,
  ...inputProps
}) => {
  return (
    <div>
      <div className="mt-2">
        <textarea
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          {...inputProps}
        />
        {validationError && (
          <p
            id={`${inputProps.name}-error`}
            className="mt-2 text-sm text-red-600"
          >
            {validationError}
          </p>
        )}
      </div>
    </div>
  )
}
