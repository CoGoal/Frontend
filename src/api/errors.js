export function parseServerError(err, { fieldMap = {}, codeMap = {}, fallback = 'Не удалось выполнить запрос' } = {}) {
  if (!err.status) return { form: 'Не удалось связаться с сервером. Попробуйте ещё раз.' }
  const result = {}
  for (const detail of err.problem?.details ?? []) {
    const field = fieldMap[detail.field]
    if (field) result[field] = detail.message
  }
  if (!Object.keys(result).length) {
    const code = err.problem?.code
    const messages = {
      INVALID_CREDENTIALS: 'Неверный логин или пароль',
      ACCOUNT_LOCKED: 'Слишком много попыток входа. Попробуйте через 30 минут.',
      TOKEN_EXPIRED: 'Ссылка устарела или уже использована. Запросите новую.',
    }
    const message = messages[code] || err.problem?.message || (err.status >= 500
      ? 'Сервис временно недоступен. Попробуйте ещё раз.' : fallback)
    result[codeMap[code] || 'form'] = message
  }
  return result
}
