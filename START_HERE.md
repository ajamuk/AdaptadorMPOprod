# Empieza aqui - Adaptador MPO

Este es el documento principal para empezar de cero.

La carpeta buena es:

```text
/Users/carlos/Documents/AdaptadorMPOprod
```

El repositorio GitHub es:

```text
https://github.com/ajamuk/AdaptadorMPOprod
```

## Ruta recomendada ahora

Como tienes una VPS 24h online, la opcion recomendada es:

```text
VPS Ubuntu + SQLite local + Gunicorn + Nginx
```

Esto evita Supabase, Neon y discos de pago en Render.

Guia exacta:

```text
VPS_DEPLOY.md
```

## Archivos que deben estar en GitHub

```text
.env.example
.gitignore
DEPLOY.md
Procfile
README.md
START_HERE.md
VPS_DEPLOY.md
app.py
deploy/
render.yaml
requirements.txt
runtime.txt
static/
templates/
```

No subir nunca:

```text
.env
.venv/
__pycache__/
instance/
*.pyc
.DS_Store
backups/
```

## Que hace la app

- Pegar un entrenamiento original.
- Elegir si generar para uno, dos o tres centros.
- Guardar configuracion independiente por centro.
- Guardar memoria permanente por centro.
- Bloquear material puntual para una generacion concreta.
- Generar resultado en texto plano listo para copiar.
- Mantener calentamiento, movilidad y activacion fieles al original.
- Crear briefing de 5 bloques dentro del texto final.

## Variables de entorno en VPS

En `/opt/adaptador-mpo/.env`:

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=tu_clave_de_openrouter
OPENROUTER_MODEL=anthropic/claude-3.5-haiku
APP_PUBLIC_URL=http://IP_DE_TU_VPS
MOONSHOT_API_KEY=
KIMI_MODEL=moonshot-v1-32k
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-20250514
FLASK_DEBUG=0
DATABASE_URL=
```

Importante:

```text
DATABASE_URL=
```

Debe quedarse vacio para usar SQLite local en la VPS.

## Comprobacion clave

Cuando la app este funcionando, abre:

```text
http://IP_DE_TU_VPS/api/health
```

Debe mostrar:

```json
"db_engine": "sqlite"
```

En VPS eso esta bien, porque SQLite vive en:

```text
/opt/adaptador-mpo/instance/app.db
```

## Actualizar la app despues de cambios

En la VPS:

```bash
cd /opt/adaptador-mpo
git pull origin main
./.venv/bin/pip install -r requirements.txt
systemctl restart adaptador-mpo
```
