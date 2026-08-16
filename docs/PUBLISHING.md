# Publicación automática

Moni UI valida y publica el paquete desde GitHub Actions.

## Configuración inicial en npm

Esta configuración se realiza una sola vez y evita guardar un `NPM_TOKEN` de larga duración en GitHub:

1. Abre la configuración de `@moni-labs/moni-ui` en npm.
2. En **Trusted Publisher**, selecciona **GitHub Actions**.
3. Configura estos valores:
   - Organization or user: `moni-spa`
   - Repository: `moni-ui`
   - Workflow filename: `publish.yml`
   - Environment: déjalo vacío

## Flujo habitual

1. Actualiza `version` en `package.json` siguiendo SemVer.
2. Crea el commit y haz push a `main`.
3. CI ejecuta las pruebas, genera `dist` e inspecciona el paquete.
4. El workflow de publicación comprueba si la versión ya existe en npm.
5. Si es nueva, la publica con provenance; si ya existe, finaliza sin error.

Los pull requests nunca publican paquetes. También se puede reintentar una publicación desde **Actions → Publish to npm → Run workflow**.

## Versionado

- Patch (`0.3.2` → `0.3.3`): correcciones compatibles.
- Minor (`0.3.2` → `0.4.0`): funcionalidades compatibles.
- Major (`0.3.2` → `1.0.0`): cambios incompatibles.
