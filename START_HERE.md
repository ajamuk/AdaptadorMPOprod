# Empieza aqui - Adaptador MPO

Este es el documento principal para empezar de cero. Usa esta carpeta como la version limpia:

```text
/Users/carlos/Documents/AdaptadorMPOprod
```

No uses las copias antiguas de `New project` para subir a GitHub. La carpeta correcta es `AdaptadorMPOprod`.

## 1. Archivos que deben subirse a GitHub

Sube exactamente estos archivos y carpetas:

```text
.env.example
.gitignore
DEPLOY.md
Procfile
README.md
START_HERE.md
app.py
render.yaml
requirements.txt
runtime.txt
static/
templates/
```

No subas estos archivos aunque existan en algun momento:

```text
.env
.venv/
__pycache__/
instance/
*.pyc
.DS_Store
```

## 2. Que hace la app

La app permite:

- Pegar un entrenamiento original.
- Elegir si generar para uno, dos o tres centros.
- Guardar configuracion independiente por centro.
- Guardar memoria permanente por centro.
- Bloquear material puntual para una generacion concreta.
- Generar un resultado en texto plano listo para copiar.
- Mantener calentamiento, movilidad y activacion fieles al original.
- Crear un briefing de 5 bloques dentro del texto final.

## 3. Variables que necesitas

En Render debes crear estas variables de entorno:

```text
ANTHROPIC_API_KEY=tu_clave_de_anthropic
CLAUDE_MODEL=claude-sonnet-4-20250514
FLASK_DEBUG=0
DATABASE_URL=postgresql://postgres.xxxxx:TU_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Importante: `DATABASE_URL` debe terminar con:

```text
?sslmode=require
```

## 4. Crear GitHub desde cero

1. En GitHub crea un repo nuevo, por ejemplo `adaptador-mpo-prod`.
2. Sube el contenido de la carpeta `AdaptadorMPOprod`.
3. Si usas GitHub Desktop, arrastra esa carpeta como repositorio local.
4. Haz commit con un mensaje como:

```text
Initial clean production version
```

5. Publica el repo en GitHub.

## 5. Crear Supabase desde cero

1. Entra en Supabase.
2. Crea un proyecto nuevo.
3. Ve a `Connect`.
4. Elige `Direct` o `Transaction pooler`.
5. Copia la connection string tipo URI.
6. Sustituye `[YOUR-PASSWORD]` por la password real.
7. Anade al final `?sslmode=require` si no aparece.

Ejemplo de formato:

```text
postgresql://postgres.xxxxx:password@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require
```

No hace falta crear tablas manualmente. La app las crea sola al arrancar.

## 6. Crear Render desde cero

1. En Render pulsa `New`.
2. Elige `Web Service`.
3. Conecta el repo nuevo de GitHub.
4. Configura:

```text
Language: Python 3
Branch: main
Root Directory: vacio
Build Command: pip install -r requirements.txt
Start Command: gunicorn --workers=2 --threads=4 --timeout=120 --bind=0.0.0.0:$PORT app:app
```

5. En `Environment`, anade las variables del punto 3.
6. Pulsa `Deploy Web Service`.

## 7. Comprobacion despues del deploy

Abre:

```text
https://TU-APP.onrender.com/api/health
```

Debe verse algo parecido a:

```json
{
  "ok": true,
  "anthropic_api_configured": true,
  "db_engine": "postgres",
  "model": "claude-sonnet-4-20250514"
}
```

La clave es:

```text
"db_engine": "postgres"
```

Si aparece `"sqlite"`, Render no esta leyendo `DATABASE_URL`.

## 8. Prueba de guardado

Despues del deploy:

1. Abre la web.
2. Despliega un centro.
3. Cambia el nombre a `Parla`, `Getafe` o `Las Rosas`.
4. Pulsa `Guardar configuracion`.
5. Recarga la pagina.
6. Si el cambio sigue ahi, Supabase esta guardando bien.

## 9. Prueba de Claude

1. Pega un entrenamiento pequeno.
2. Selecciona solo un centro.
3. Pulsa generar.
4. Si falla, revisa que `ANTHROPIC_API_KEY` este en Render y no tenga espacios.

## 10. Orden recomendado de trabajo

1. Primero confirma que `/api/health` dice `postgres`.
2. Luego confirma que guardar configuracion persiste tras recargar.
3. Luego mete la informacion real de Parla, Getafe y Las Rosas.
4. Luego prueba una generacion simple.
5. Por ultimo comparte el enlace con el equipo.

