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

export const SIDEBAR_TEXTS = {
  navLabel: 'Основное меню',
  home: 'Главная',
  goals: 'Цели',
  pacts: 'Пакты',
  notifications: 'Уведомления',
  profile: 'Профиль',
  settings: 'Настройки',
}

export const HEADER_TEXTS = {
  profile: 'Профиль',
  notifications: 'Уведомления',
  coins: 'Баланс монет',
}

export const PROFILE_VIEW_TEXTS = {
  pageTitle: 'Мой профиль',
  avatarAlt: 'Аватар',
  statsLabel: 'Статистика',
  completedGoals: 'Выполнено целей',
  activeGoals: 'Активные цели',
  completedPacts: 'Завершено пактов',
  coins: 'Баланс монет',
  edit: 'Редактировать',
}

export const GOALS_TEXTS = {
  title: 'Мои цели и пакты',
  tabsLabel: 'Фильтр целей',
  tabAll: 'Все',
  tabInPact: 'В пакте',
  tabCompleted: 'Завершены',
  emptyAll: 'Пока целей нет',
  emptyInPact: 'Пока нет целей в пакте',
  emptyCompleted: 'Пока нет завершённых целей',
}

export const SIDE_CARDS_TEXTS = {
  historyTitle: 'История монет',
  historyDescription: 'Начисления и списания',
  historyLink: 'Все операции',
  achievementsTitle: 'Достижения',
  achievementsEmpty: 'Пока нет достижений',
  achievementsLink: 'Все достижения',
  lookTitle: 'Мой образ',
  lookDescription: 'Аватар, рамка и значки',
  lookLink: 'Настроить профиль',
}

export const EDIT_PROFILE_TEXTS = {
  pageTitle: 'Редактирование профиля',
  avatarAlt: 'Аватар',
  backToProfile: 'Назад в профиль',
  logout: 'Выйти',
  logoutAll: 'Выйти на всех устройствах',

  nameLabel: 'Имя',
  nameInvalid: `Введите имя от 1 до ${LIMITS.nameMax} символов`,
  usernameLabel: 'Username',
  usernameInvalid: `От ${LIMITS.usernameMin} до ${LIMITS.usernameMax} символов: латинские буквы, цифры и _`,
  emailLabel: 'Email',
  emailInvalid: 'Введите корректный email',
  emailHint: 'После сохранения на новый адрес придёт письмо со ссылкой для подтверждения',

  currentPasswordLabel: 'Текущий пароль',
  currentPasswordHint: 'Нужен, только если вы меняете email или пароль',
  currentPasswordRequired: 'Введите текущий пароль',
  newPasswordLabel: 'Новый пароль',
  newPasswordPlaceholder: `Минимум ${LIMITS.passwordMin} символов`,
  confirmPasswordLabel: 'Повторите новый пароль',
  passwordsMismatch: 'Пароли не совпадают',
  passwordHint: 'После смены пароля нужно будет войти снова',

  submit: 'Сохранить',
  submitting: 'Сохраняем…',
  nothingChanged: 'Вы ничего не изменили',
  profileSaved: 'Изменения сохранены',
  emailSent: 'Письмо отправлено на новый адрес. Подтвердите email по ссылке из письма.',
}