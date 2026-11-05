export const ENDPOINTS = {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    logoutAll: '/auth/logout-all',
    forgotPassword: '/auth/password/forgot',
    resetPassword: '/auth/password/reset',
    confirmEmail: '/auth/email/confirm',
    changePassword: '/auth/change-password',
    account: '/auth/me',
    username: '/auth/me/username',
    profile: '/users/me',
    emailChange: '/users/me/email-change',
} as const