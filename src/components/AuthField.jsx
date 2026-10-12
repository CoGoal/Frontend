export default function AuthField({
  name, type = 'text', placeholder, autoComplete, value, onChange, error, children,
}) {
  const errorId = `${name}-error`

  return (
    <div className="login-field">
      <div className="login-password">
        <input
          className={`login-input${error ? ' login-input--error' : ''}`}
          type={type}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {children}
      </div>
      {error && <p id={errorId} className="login-field-error">{error}</p>}
    </div>
  )
}