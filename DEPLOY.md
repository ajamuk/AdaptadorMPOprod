# AdaptadorMPOprod - deploy limpio

Esta carpeta contiene solo los archivos necesarios para crear un repo nuevo y desplegar en Render.

No incluye:

- `.env`
- `.git`
- `.venv`
- `instance/app.db`

## Render

Configura el Web Service con:

```bash
Build Command: pip install -r requirements.txt
Start Command: gunicorn --workers=2 --threads=4 --timeout=120 --bind=0.0.0.0:$PORT app:app
Root Directory: vacio
```

Variables:

```text
ANTHROPIC_API_KEY=...
CLAUDE_MODEL=claude-sonnet-4-20250514
FLASK_DEBUG=0
DATABASE_URL=postgresql://postgres.moctnatviidiohuztugn:TU_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Despues del deploy, comprueba:

```text
https://TU-APP.onrender.com/api/health
```

Debe mostrar:

```json
"db_engine": "postgres"
```
