# Ruta del Hub

Plan de aprendizaje personal en tres vías paralelas, publicado en
[luisgxz.github.io/hub-architecture-roadmap](https://luisgxz.github.io/hub-architecture-roadmap/).

| Página | Vía | Qué contiene |
|---|---|---|
| `index.html` | Portada | Qué toca hoy, progreso, calendario combinado, reglas y bitácora |
| `bases.html` | Bases · Los pilares | Temario de fundamentos: 8 bloques y 27 lecciones, con prompts para estudiarlas |
| `arquitectura.html` | A · El producto | Diez módulos hasta la V1 del Hub y siete etapas post-V1 |
| `devops.html` | B · El proceso | Seis fases de Azure DevOps: pipeline, secrets, environments, staging, policies |

## Estructura

```
index.html            portada
bases.html            temario de fundamentos
arquitectura.html     vía A
devops.html           vía B
repaso.html           redirección a bases.html (la zona de repaso ya no existe)
assets/app.css        design system compartido
assets/app.js         progreso, estado del temario, pestañas, bitácora
assets/roadmap.jpg    el mapa de roadmap.sh
```

## Estado

El progreso de los módulos, la fecha de arranque y el estado de las lecciones de
bases se guardan en `localStorage` del navegador. No se suben a ningún sitio.
La portada tiene exportar/importar en formato JSON para pasarlos a otro equipo.

Claves usadas: `hub.start`, `hub.progress`, `hub.bases`.

La clave antigua `hub.repaso` (repetición espaciada de las tarjetas) quedó sin
uso: el temario se estudia en orden, no por vencimiento, así que no se migra.

## Convenciones de contenido

- Los ejercicios marcados `GENERAL` son portables a cualquier proyecto o entrevista.
- Los marcados `RELOLINK` usan código, pipelines o infraestructura reales, **siempre
  en solo lectura**. No se incluyen credenciales, cadenas de conexión ni datos de clientes:
  solo rutas de archivo y patrones.
- Cada módulo y cada fase termina en un artefacto. Sin artefacto, la semana no cuenta.
- Cada lección de `bases.html` trae temario copiable, prompt de estudio, prueba sin
  mirar y ejercicio. Se cierra cuando puedes explicarla sin la página delante, no
  cuando terminas de leer la explicación.

## Publicar

GitHub Pages sirve la rama `main` desde la raíz. El `.nojekyll` evita que Jekyll
ignore nada. Un `git push` a `main` publica.
