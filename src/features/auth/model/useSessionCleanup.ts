import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../../entities/session/model/authStore'
import { ROUTES } from '../../../shared/config/routes'

export function useSessionCleanup(skipRedirect: boolean) {
    const navigate = useNavigate()
    const client = useQueryClient()
    const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))
    const previousSession = useRef(hasSession)

    useEffect(() => {
        if (!hasSession) {
        client.cancelQueries()
        client.removeQueries()
        if (previousSession.current && !skipRedirect) {
            navigate(ROUTES.login, { replace: true })
        }
        }
        previousSession.current = hasSession
    }, [hasSession, client, skipRedirect, navigate])
}