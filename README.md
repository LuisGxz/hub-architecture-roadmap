# Ruta del Hub

Plan de aprendizaje personal en tres vías paralelas, publicado en
[luisgxz.github.io/hub-architecture-roadmap](https://luisgxz.github.io/hub-architecture-roadmap/).

| Página | Vía | Qué contiene |
|---|---|---|
| `index.html` | Portada | Qué toca hoy, progreso, calendario combinado, reglas y bitácora |
| `arquitectura.html` | A · El producto | Diez módulos hasta la V1 del Hub y siete etapas post-V1 |
| `devops.html` | B · El proceso | Seis fases de Azure DevOps: pipeline, secrets, environments, staging, policies |
| `repaso.html` | Repaso | Ocho tarjetas de recuperación activa con repetición espaciada |

## Estructura

```
index.html            portada
arquitectura.html     vía A
devops.html           vía B
repaso.html           zona de repaso
assets/app.css        design system compartido
assets/app.js         progreso, repetición espaciada, pestañas, bitácora
assets/roadmap.jpg    el mapa de roadmap.sh
```

## Estado

El progreso de los módulos, la fecha de arranque y el estado de las tarjetas de
repaso se guardan en `localStorage` del navegador. No se suben a ningún sitio.
La portada tiene exportar/importar en formato JSON para pasarlos a otro equipo.

Claves usadas: `hub.start`, `hub.progress`, `hub.repaso`.

## Convenciones de contenido

- Los ejercicios marcados `GENERAL` son portables a cualquier proyecto o entrevista.
- Los marcados `RELOLINK` usan código, pipelines o infraestructura reales, **siempre
  en solo lectura**. No se incluyen credenciales, cadenas de conexión ni datos de clientes:
  solo rutas de archivo y patrones.
- Cada módulo y cada fase termina en un artefacto. Sin artefacto, la semana no cuenta.

## Publicar

GitHub Pages sirve la rama `main` desde la raíz. El `.nojekyll` evita que Jekyll
ignore nada. Un `git push` a `main` publica.
