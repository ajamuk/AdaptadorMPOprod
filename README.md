# Adaptador MPO

Web app interna para adaptar entrenamientos de CrossFit Metropolitano a varios centros usando IA por API.

La version limpia para produccion esta pensada para:

- Flask + Gunicorn.
- VPS Ubuntu como hosting recomendado.
- SQLite local persistente en la VPS.
- Kimi o Claude como proveedor de IA.

Para empezar desde cero, lee primero:

```text
START_HERE.md
```

Si vas a desplegar en una VPS, usa:

```text
VPS_DEPLOY.md
```

## Archivos principales

```text
app.py                 Backend Flask, base de datos, prompts y llamadas a IA.
templates/index.html   Interfaz HTML.
static/app.js          Logica de botones, guardado y generacion.
static/styles.css      Estilos corporativos.
requirements.txt       Dependencias Python.
runtime.txt            Version Python recomendada.
Procfile               Arranque para Render.
render.yaml            Configuracion opcional tipo blueprint.
DEPLOY.md              Guia corta de deploy.
START_HERE.md          Guia principal paso a paso.
```

## Desarrollo local

```bash
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
cp .env.example .env
./.venv/bin/python app.py
```

Abre:

```text
http://127.0.0.1:5000
```

## Variables de entorno

```text
AI_PROVIDER=kimi
MOONSHOT_API_KEY=tu_clave_de_kimi
KIMI_MODEL=moonshot-v1-32k
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-20250514
FLASK_DEBUG=0
DATABASE_URL=
```

Si `DATABASE_URL` esta vacio, la app usa SQLite local. En una VPS esto es lo recomendado.

Para volver a Claude, cambia:

```text
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=tu_clave_de_anthropic
```
