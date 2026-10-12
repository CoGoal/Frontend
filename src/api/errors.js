export function parseServerError(err, { fieldMap, codeMap = {}, fallback }) {
  if (!err.status) {
    return { form: 'Не удалось связаться с сервером' }
  }

  const result = {}
  const problem = err.problem

  //проходимся по ошибкам и записываем из в соответсвующие поля
  for (const d of problem?.details ?? []) {
    const formField = fieldMap[d.field]
    if (formField) result[formField] = d.message
  }
// если ошибка не связана с полями для ввода данных
if (Object.keys(result).length === 0) {
    const formField = codeMap[problem?.code]
    if (formField) result[formField] = problem.message
    else result.form = problem?.message ?? err.message ?? fallback
  }
 
  return result
}
 