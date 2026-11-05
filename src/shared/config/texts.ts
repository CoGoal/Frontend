import { LIMITS } from './limits'

export const NOTICES = {
    passwordChanged: 'Пароль изменён. Войдите с новым паролем.',
    emailConfirmed: 'Email подтверждён. Войдите снова.',
}

export const LOGIN_TEXTS = {
    title: 'Вход в аккаунт',
    loginLabel: 'Email или username',
    loginPlaceholder: 'Введите email или username',
    loginRequired: 'Введите email или имя пользователя',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    passwordRequired: 'Введите пароль',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    forgot: 'Забыли пароль?',
    submit: 'Войти',
    submitting: 'Входим…',
    noAccount: 'Нет аккаунта?',
    register: 'Регистрация',
    failed: 'Не удалось войти',
}

export const PROFILE_TEXTS = {
    pendingTitle: 'Готовим ваш профиль…',
    pendingDescription: 'Это может занять несколько секунд. Страница обновится автоматически.',
    errorTitle: 'Не удалось загрузить профиль',
    retry: 'Повторить',
    logout: 'Выйти',
}

export const FORGOT_TEXTS = {
    title: 'Восстановление пароля',
    description:
        'Введите email, указанный при регистрации. Мы отправим временную ссылку для сброса пароля (действует 30 минут)',
    emailLabel: 'Email',
    emailPlaceholder: 'Введите email',
    emailInvalid: 'Введите корректный email',
    submit: 'Получить ссылку',
    sending: 'Отправляем…',
    failed: 'Не удалось отправить ссылку',
    rememberedPassword: 'Вспомнили пароль?',
    login: 'Войти',

  // Экран «письмо отправлено»
    sentAlt: 'Успешно отправлено',
    sentTitle: 'Проверьте почту',
    sentDescription: (email: string) =>
    `Если аккаунт ${email} существует, письмо придёт на этот адрес. Ссылка активна в течение 30 минут.`,
    backToLogin: 'Вернуться на страницу входа',
    notReceived: 'Не пришло письмо?',
    resend: 'Отправить повторно',
}

export const CONFIRM_EMAIL_TEXTS = {
    title: 'Подтверждение email',
    success: 'Новый email подтверждён. Теперь войдите в аккаунт снова.',
    ready: 'Подтвердите новый адрес электронной почты.',
    noToken: 'В ссылке нет токена подтверждения.',
    submit: 'Подтвердить email',
    submitting: 'Подтверждаем…',
    backToLogin: 'Вернуться ко входу',
}

export const PROFILE_PAGE_TEXTS = {
    pageTitle: 'Мой профиль',
    logout: 'Выйти',
    logoutAll: 'Выйти на всех устройствах',
    summaryLabel: 'Данные профиля',
    avatarAlt: 'Аватар',
    coins: (count: number) => `${count} монет`,

  // Имя и аватар
    profileFormLabel: 'Редактирование профиля',
    profileFormTitle: 'Имя и аватар',
    nameLabel: 'Имя',
    nameInvalid: `Введите имя от 1 до ${LIMITS.nameMax} символов`,
    avatarLabel: 'Ссылка на аватар',
    avatarInvalid: 'Укажите ссылку, начинающуюся с http:// или https://',
    avatarTooLong: 'Ссылка слишком длинная',
    avatarHint: 'Чтобы убрать аватар, оставьте ссылку пустой.',
    profileSubmit: 'Сохранить профиль',
        profileSaved: 'Профиль сохранён',

  // Логин
    usernameFormLabel: 'Смена логина',
    usernameFormTitle: 'Логин для входа',
    usernameLabel: 'Новый username',
    usernameInvalid: `От ${LIMITS.usernameMin} до ${LIMITS.usernameMax} символов: латинские буквы, цифры и _`,
    usernameSubmit: 'Изменить логин',
    usernameSaved: 'Логин изменён. Используйте его при следующем входе.',

  // Пароль
    passwordFormLabel: 'Смена пароля',
    passwordFormTitle: 'Смена пароля',
    currentPassword: 'Текущий пароль',
    currentPasswordRequired: 'Введите текущий пароль',
    newPassword: 'Новый пароль',
    confirmPassword: 'Повторите новый пароль',
    passwordsMismatch: 'Пароли не совпадают',
    passwordHint: 'После смены пароля нужно будет войти снова.',
    passwordSubmit: 'Изменить пароль',

  // Email
    emailFormLabel: 'Смена email',
    emailFormTitle: 'Смена email',
    newEmailLabel: 'Новый email',
    emailInvalid: 'Введите корректный email',
    emailPasswordLabel: 'Пароль для смены email',
    emailSubmit: 'Отправить подтверждение',
    emailSent: 'Письмо отправлено на новый адрес. Подтвердите email по ссылке из письма.',
}

export const REGISTER_TEXTS = {
    title: 'Регистрация',

    nameLabel: 'Имя',
    namePlaceholder: 'Иван Иванов',
    nameRequired: 'Введите имя',
    nameTooLong: `Не больше ${LIMITS.nameMax} символов`,

    usernameLabel: 'Username',
    usernamePlaceholder: '@username',
    usernameInvalid: `От ${LIMITS.usernameMin} до ${LIMITS.usernameMax} символов: латинские буквы, цифры и _`,

    emailLabel: 'Email',
    emailPlaceholder: 'example@email.com',
    emailInvalid: 'Введите корректный email',

    passwordLabel: 'Пароль',
    passwordPlaceholder: `Минимум ${LIMITS.passwordMin} символов`,

    confirmLabel: 'Подтверждение пароля',
    confirmPlaceholder: 'Повторите пароль',
    confirmRequired: 'Подтвердите пароль',
    passwordsMismatch: 'Пароли не совпадают',

    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',

    submit: 'Регистрация',
    submitting: 'Создаём…',
    failed: 'Не удалось создать аккаунт',

    haveAccount: 'Уже есть аккаунт?',
    login: 'Войти',
}

export const RESET_TEXTS = {
    title: 'Восстановление пароля',

  // Ссылка без токена или устаревшая
    linkInvalid: 'Ссылка недействительна или срок её действия истёк.',
    linkInvalidAsk: 'Ссылка недействительна или срок её действия истёк. Запросите новую.',
    getNewLink: 'Получить новую ссылку',

  // Форма
    description: 'Придумайте новый пароль для вашего аккаунта.',
    passwordLabel: 'Новый пароль',
    passwordPlaceholder: `Минимум ${LIMITS.passwordMin} символов`,
    confirmLabel: 'Подтверждение пароля',
    confirmPlaceholder: 'Повторите пароль',
    confirmRequired: 'Подтвердите пароль',
    passwordsMismatch: 'Пароли не совпадают',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    submit: 'Сохранить пароль',
    submitting: 'Сохраняем…',

  // Успех
    doneTitle: 'Пароль успешно изменён!',
    doneDescription: 'Теперь вы можете войти с новым паролем.',

  // Ссылка внизу
    allDone: 'Всё готово?',
    rememberedPassword: 'Вспомнили пароль?',
    login: 'Войти',
}

export const VALIDATION_TEXTS = {
    passwordTooShort: `Минимум ${LIMITS.passwordMin} символов`,
    passwordTooLong: `Не больше ${LIMITS.passwordMaxBytes} байт: для кириллицы лимит короче`,
}

export const SERVER_ERROR_TEXTS = {
    noConnection: 'Не удалось связаться с сервером. Попробуйте ещё раз.',
    defaultFallback: 'Не удалось выполнить запрос',
    serviceUnavailable: 'Сервис временно недоступен. Попробуйте ещё раз.',

  // Ответы сервера по коду ошибки
    byCode: {
    INVALID_CREDENTIALS: 'Неверный логин или пароль',
    ACCOUNT_LOCKED: 'Слишком много попыток входа. Попробуйте через 30 минут.',
    TOKEN_EXPIRED: 'Ссылка устарела или уже использована. Запросите новую.',
    } as Record<string, string>,
}

export const APP_NAME = 'CoGoal'