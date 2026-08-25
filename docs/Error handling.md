# Manejo de errores

Convenciones para capturar, normalizar y reportar errores en la app.

## Principios

1. Nunca se hace `throw` de literales (strings, números, objetos planos). Siempre `Error` o subclases.
2. El `catch` se tipa como `unknown`, nunca `any`. Se verifica el tipo antes de acceder a propiedades.
3. No se sobrescribe `error.message`. El contexto adicional se agrega con `cause`, preservando el error original.
4. Sentry se llama a través de un helper centralizado (`reportError`), nunca directamente desde componentes.
5. `Sentry.flush()` no se usa en el flujo normal. Es para casos puntuales donde el proceso puede terminar antes de enviar el evento (cierre de app, función serverless).

## Helper de normalización

[app/lib/error.ts](../app/lib/error.ts)

```typescript
export function normalizeError(error: unknown, message: string): Error {
  const original = error instanceof Error ? error : new Error(String(error))
  return new Error(message, { cause: original })
}
```

`cause` mantiene el stack y el error original accesibles vía `error.cause`, en vez de perderlos al reescribir el mensaje.

## Helper de reporte

[app/lib/error.ts](../app/lib/error.ts)


```typescript
type ErrorContext = Record<string, unknown>
type ErrorTags = Record<string, string>

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
```

### `tags` vs `extra`

| | Uso | Tipo | Búsqueda en Sentry |
|---|---|---|---|
| `tags` | Dimensiones para filtrar/buscar (pantalla, acción, plan) | strings simples | Sí, indexado |
| `extra` | Datos de contexto no buscables (payload, ids, estado) | cualquier valor serializable | No |
| `contexts` | Objetos estructurados agrupados (ej. `formContext`) | objeto anidado | No |

Tags mal usados (con valores muy variables, como un `userId` único por request) degradan el índice de Sentry. Ids únicos van en `extra`, no en `tags`.

## Uso en componentes

```typescriptreact
<Pressable
  onPress={() => {
    reportError(new Error('Fallo simulado'), 'Error al presionar botón', {
      tags: { screen: 'Home' },
      extra: { userId: currentUser?.id },
    })
  }}
>
  <Text>try</Text>
</Pressable>
```

## Clases de error de dominio

Cuando distintos tipos de falla requieren manejo distinto (no solo reporte), se definen subclases en vez de reusar `Error` genérico:

```typescript
export class ApiError extends Error {
  constructor(message: string, public statusCode: number, cause?: unknown) {
    super(message, { cause })
    this.name = 'ApiError'
  }
}
```

Esto permite discriminar con `instanceof` en los `catch` que necesitan comportamiento distinto según el origen del error (red, validación, auth), en vez de solo reportarlo.

## Lint

Se recomienda la regla `no-throw-literal` de `typescript-eslint` para evitar `throw` de valores que no sean instancias de `Error`.

## Checklist antes de mergear

- [ ] Ningún `throw` de literales.
- [ ] Errores reportados vía `reportError`, no `Sentry.captureException` directo.
- [ ] `tags` solo con valores de baja cardinalidad.
- [ ] Sin `Sentry.flush()` fuera de los casos de cierre de proceso.
