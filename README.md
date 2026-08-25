<div align="center">

# Cufa

*Organizador académico para estudiantes universitarios*

[Características](#características) • [Empezando](#empezando) • [Variables de entorno](#variables-de-entorno) • [Scripts](#scripts) • [Release automática](#release-automática) • [Estructura del proyecto](#estructura-del-proyecto) • [Modelo de datos](#modelo-de-datos)

</div>

Cufa es una aplicación móvil para Android que ayuda a un estudiante universitario a organizar su carrera por cuatrimestres: materias, trabajos prácticos, evaluaciones, temas a repasar y notas, todo pensado para quien además de estudiar trabaja o tiene poco tiempo disponible.

> [!NOTE]
> La aplicación funciona completamente sin conexión a internet. Todos los datos se guardan de forma local en el dispositivo.

## Características

- **Carrera:** onboarding inicial para cargar los datos de la carrera y lista de asignaturas asociadas.
- **Asignaturas:** creación, edición y eliminación, con horarios opcionales y cuenta regresiva mientras dura la clase.
- **Evaluaciones:** parciales, finales, recuperatorios, trabajos prácticos y presentaciones, con fecha, enlace, notas y lista de temas. Se ordenan por proximidad y se resaltan con un código de colores según el tiempo restante.
- **Notas:** notas libres o asociadas a una asignatura, con listado resumido y detalle editable.
- **Pantalla principal:** muestra primero las evaluaciones próximas y luego las asignaturas de la carrera.

> [!IMPORTANT]
> La versión actual soporta una sola carrera activa. El soporte para múltiples carreras está planeado para una versión futura.

## Stack técnico

- [Expo](https://expo.dev) (React Native) con [Expo Router](https://docs.expo.dev/router/introduction/) para la navegación
- [NativeWind](https://www.nativewind.dev) (Tailwind CSS) para los estilos
- [Zustand](https://zustand.docs.pmnd.rs) para el estado global
- Persistencia local mediante patrón repository, sin dependencia de backend

## Empezando

### Requisitos

- [Node.js](https://nodejs.org) 20.19.5
- [Expo Go](https://expo.dev/go) en tu dispositivo, o un emulador de Android/iOS configurado

### Instalación

```bash
npm install
```

### Ejecutar la app

```bash
npm start
```

Esto abre el bundler de Expo. Desde ahí podés escanear el código QR con Expo Go o elegir una plataforma específica:

```bash
npm run android
npm run ios
npm run web
```

## Variables de entorno

El proyecto usa dos variables relacionadas con [Sentry](https://sentry.io) para el reporte de errores.

| Variable | Tipo | Dónde vive |
| --- | --- | --- |
| `EXPO_PUBLIC_SENTRY_DSN` | Pública | `.env` local y `eas.json` (por `build profile`) |
| `SENTRY_AUTH_TOKEN` | Secreta | [EAS Environment Variables](https://expo.dev) (dashboard o `eas env:set`) |

- **`EXPO_PUBLIC_SENTRY_DSN`**: identifica el proyecto de Sentry al que se envían los eventos. No es un secreto (Sentry la documenta como segura para incluir en código de cliente), pero se maneja como variable de entorno para poder cambiarla por ambiente sin tocar código. Se define localmente en un archivo `.env` en la raíz:

  ```bash
  # .env
  EXPO_PUBLIC_SENTRY_DSN=https://...@....ingest.us.sentry.io/...
  ```

- **`SENTRY_AUTH_TOKEN`**: se usa en build time para subir source maps y crear releases en Sentry. Este sí es un secreto — nunca debe vivir en `.env`, en `eas.json` ni en el repositorio. Se configura como **EAS Secret**, con visibilidad `secret`:

  ```bash
  eas env:set --name SENTRY_AUTH_TOKEN --value "sntrys_TU_TOKEN" --scope project --visibility secret --environment production
  ```

  También se puede cargar desde el dashboard de Expo, en **Environment Variables** dentro de la configuración del proyecto.

> [!IMPORTANT]
> `.env` está en `.gitignore` y no debe commitearse. Si `SENTRY_AUTH_TOKEN` llegó a estar en un `.env` commiteado alguna vez, hay que rotarlo desde **Developer Settings → Auth Tokens** en Sentry.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Compila y ejecuta la app en Android |
| `npm run ios` | Compila y ejecuta la app en iOS |
| `npm run web` | Ejecuta la app en el navegador |
| `npm run lint` | Corre el linter del proyecto |
| `npm run reset-project` | Reinicia la plantilla base de Expo Router |

> [!TIP]
> Corré `npx expo-doctor` de tanto en tanto para verificar que las dependencias del proyecto coincidan con las que espera el SDK de Expo instalado.

## Build de producción

Para generar el APK de producción manualmente con [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
eas build --platform android --profile production-apk
```

## Release automática

El workflow [`.github/workflows/release.yml`](./.github/workflows/release.yml) automatiza la generación de builds y su publicación como release de GitHub.

**Disparador:** se ejecuta al pushear un tag que empiece con `v` (por ejemplo `v1.0.0`):

```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

```bash
git push --follow-tags
```

**Qué hace:**

1. Instala las dependencias del proyecto con `Node.js 20.19.5`.
2. Autentica `eas-cli` contra Expo usando el secret `EXPO_TOKEN`.
3. Genera un `.apk` con el perfil `production-apk` (para instalación directa en un dispositivo).
4. Genera un `.aab` con el perfil `production` (el formato que requiere Play Store).
5. Crea una release de GitHub para el tag pusheado, adjuntando ambos archivos (`cufa.apk` y `cufa.aab`).

> [!IMPORTANT]
> El workflow necesita el secret `EXPO_TOKEN` configurado en el repositorio (**Settings → Secrets and variables → Actions**). Se genera desde [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens).

> [!NOTE]
> El `.aab` queda adjunto a la release, pero no se sube automáticamente a Play Store. Subirlo es un paso manual, o se puede automatizar más adelante agregando `eas submit` al workflow.

## Estructura del proyecto

```
app/
├── app                 # Rutas de Expo Router
│   └── (tabs)          # Navegación principal por tabs
├── assets              # Íconos e imágenes
├── components          # Componentes de UI por dominio (evaluation, note, subject, ui)
├── constants           # Constantes compartidas
├── hooks               # Hooks personalizados
├── lib                 # Utilidades (fechas, rangos de semana, etc.)
├── stores              # Estado global con Zustand
└── types               # Tipos de dominio
```

## Modelo de datos

La aplicación gira en torno a cuatro entidades: `Career`, `Subject`, `Note` y `Evaluation`. El detalle completo de los campos y las reglas de negocio (asociación obligatoria de evaluaciones a una asignatura, código de colores por proximidad, etc.) está documentado en [PRODUCT.md](./PRODUCT.md).
