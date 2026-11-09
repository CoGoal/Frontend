import { SERVER_ERROR_TEXTS as T } from '../config/texts'
import type { ApiError } from './types'

interface ParseOptions {
  fieldMap?: Record<string, string>
  codeMap?: Record<string, string>
  fallback?: string
}
export type FormErrors = Partial<Record<string, string>>

export function parseServerError(
  err: unknown,
  { fieldMap = {}, codeMap = {}, fallback = T.defaultFallback }: ParseOptions = {},
): FormErrors {
  const error = err as ApiError
  if (!error.status) return { form: T.noConnection }

  const result: FormErrors = {}
  for (const detail of error.problem?.details ?? []) {
    const field = fieldMap[detail.field]
    if (field) result[field] = detail.message
  }
  if (!Object.keys(result).length) {
    const code = error.problem?.code
    const message = (code && T.byCode[code]) || error.problem?.message || (error.status >= 500
      ? T.serviceUnavailable : fallback)
    result[(code && codeMap[code]) || 'form'] = message
  }
  return result
}