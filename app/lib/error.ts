import * as Sentry from "@sentry/react-native"

type ErrorContext = Record<string, unknown>
type ErrorTags = Record<string, string>

export function normalizeError(error: unknown, message: string): Error {
    const original = error instanceof Error ? error : new Error(String(error))
    return new Error(message, { cause: original })
}

export function reportError(
    error: unknown,
    message: string,
    options?: { tags?: ErrorTags; extra?: ErrorContext }
) {
    const normalized = normalizeError(error, message)
    Sentry.captureException(normalized, {
        tags: options?.tags,
        extra: options?.extra,
    })
}
