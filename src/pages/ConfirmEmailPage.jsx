import { useConfirmEmail } from '../api/hooks'
import { parseServerError } from '../api/errors'
import './LoginPage.css'

export default function ConfirmEmailPage({ token, onGoToLogin }) {
  const confirm = useConfirmEmail()
  return <main className="login-page"><div className="login-card">
    <h2 className="login-title">Подтверждение email</h2>
    <p className="login-description" role="status">{confirm.isSuccess
      ? 'Новый email подтверждён. Теперь войдите в аккаунт снова.'
      : token ? 'Подтвердите новый адрес электронной почты.' : 'В ссылке нет токена подтверждения.'}</p>
    {confirm.isError && <p className="login-form-error" role="alert">{parseServerError(confirm.error).form}</p>}
    {token && !confirm.isSuccess && <button className="login-submit-button" disabled={confirm.isPending}
      onClick={() => confirm.mutate(token)}>{confirm.isPending ? 'Подтверждаем…' : 'Подтвердить email'}</button>}
    <button className="resend-link" onClick={onGoToLogin}>Вернуться ко входу</button>
  </div></main>
}
