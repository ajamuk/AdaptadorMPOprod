# Deploy en Render

Guia corta para publicar la app desde cero.

## Configuracion del servicio

En Render crea un `Web Service` con estos valores:

```text
Language: Python 3
Branch: main
Root Directory: vacio
Build Command: pip install -r requirements.txt
Start Command: gunicorn --workers=2 --threads=4 --timeout=120 --bind=0.0.0.0:$PORT app:app
```

## Variables de entorno

Anade estas variables en `Environment`:

```text
ANTHROPIC_API_KEY=tu_clave_de_anthropic
CLAUDE_MODEL=claude-sonnet-4-20250514
FLASK_DEBUG=0
DATABASE_URL=postgresql://postgres.xxxxx:TU_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require
```

## Comprobacion

Cuando termine el deploy, abre:

```text
https://TU-APP.onrender.com/api/health
```

Tiene que mostrar:

```json
"db_engine": "postgres"
```

Si muestra `"sqlite"`, falta `DATABASE_URL` o esta mal escrito.

## Si no guarda cambios

1. Comprueba `/api/health`.
2. Debe salir `"db_engine": "postgres"`.
3. Revisa que `DATABASE_URL` no tenga saltos de linea.
4. Revisa que la URL termine en `?sslmode=require`.
5. Haz `Manual Deploy` despues de cambiar variables.

