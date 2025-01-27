import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface MockResponseOptions<T> {
  data: T
  status?: number
  statusText?: string
  headers?: Record<string, string>
}

export const mockAxiosResponse = <T>({
  data,
  status = 200,
  statusText = 'OK',
  headers = {}
}: MockResponseOptions<T>): AxiosResponse<T> => {
  return {
    data,
    status,
    statusText,
    headers,
    config: {} as unknown as InternalAxiosRequestConfig
  }
}

export const mockAxiosErrorResponse = <T>({
  response,
  message
}: {
  message?: string
  response: MockResponseOptions<T>
}): AxiosError<T> => {
  const error = new Error(message)
  return Object.assign(error, {
    config: undefined,
    response: mockAxiosResponse<T>(response),
    isAxiosError: true,
    toJson: () => ({})
  }) as unknown as AxiosError<T>
}
