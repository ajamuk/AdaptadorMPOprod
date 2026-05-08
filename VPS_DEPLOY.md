# Deploy en VPS Ubuntu

Esta guia publica la app en una VPS Ubuntu usando:

- Flask + Gunicorn
- SQLite local persistente
- systemd para mantener la app siempre viva
- Nginx como proxy web
- backup diario de la base de datos

No necesitas Supabase, Neon ni Render Disk.

## 1. Conectarte a la VPS

Desde tu Mac:

```bash
ssh root@IP_DE_TU_VPS
```

## 2. Instalar dependencias del sistema

En la VPS:

```bash
apt update
apt install -y python3 python3-venv python3-pip git nginx curl ufw
```

## 3. Descargar la app

```bash
mkdir -p /opt
cd /opt
rm -rf adaptador-mpo
git clone https://github.com/ajamuk/AdaptadorMPOprod.git adaptador-mpo
cd /opt/adaptador-mpo
```

## 4. Crear entorno Python

```bash
python3 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt
```

## 5. Crear variables de entorno

```bash
nano /opt/adaptador-mpo/.env
```

Pega esto, cambiando la clave:

```env
AI_PROVIDER=kimi
MOONSHOT_API_KEY=TU_CLAVE_DE_KIMI
KIMI_MODEL=moonshot-v1-32k
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-20250514
FLASK_DEBUG=0
DATABASE_URL=
```

Guarda con `Ctrl+O`, Enter, y sal con `Ctrl+X`.

Importante: `DATABASE_URL` debe quedarse vacio para usar SQLite local.

## 6. Probar manualmente

```bash
cd /opt/adaptador-mpo
./.venv/bin/gunicorn --workers=2 --threads=4 --timeout=120 --bind=127.0.0.1:5000 app:app
```

En otra terminal o despues de parar con `Ctrl+C`, puedes comprobar:

```bash
curl http://127.0.0.1:5000/api/health
```

Debe mostrar:

```json
"db_engine":"sqlite"
```

## 7. Instalar servicio systemd

```bash
cp /opt/adaptador-mpo/deploy/adaptador-mpo.service /etc/systemd/system/adaptador-mpo.service
systemctl daemon-reload
systemctl enable adaptador-mpo
systemctl start adaptador-mpo
systemctl status adaptador-mpo --no-pager
```

## 8. Configurar Nginx

```bash
cp /opt/adaptador-mpo/deploy/nginx-adaptador-mpo.conf /etc/nginx/sites-available/adaptador-mpo
ln -sf /etc/nginx/sites-available/adaptador-mpo /etc/nginx/sites-enabled/adaptador-mpo
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

Ahora abre:

```text
http://IP_DE_TU_VPS
```

## 9. Firewall basico

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

## 10. Backup diario de la base

```bash
mkdir -p /opt/adaptador-mpo/backups
cp /opt/adaptador-mpo/deploy/backup-adaptador-mpo.sh /usr/local/bin/backup-adaptador-mpo
chmod +x /usr/local/bin/backup-adaptador-mpo
```

Abre cron:

```bash
crontab -e
```

Anade esta linea al final:

```cron
15 3 * * * /usr/local/bin/backup-adaptador-mpo
```

Esto guarda una copia diaria de `instance/app.db`.

## 11. Actualizar la app en el futuro

Cuando hagamos cambios y los subamos a GitHub:

```bash
cd /opt/adaptador-mpo
git pull origin main
./.venv/bin/pip install -r requirements.txt
systemctl restart adaptador-mpo
systemctl status adaptador-mpo --no-pager
```

## 12. Comandos utiles

Ver logs:

```bash
journalctl -u adaptador-mpo -f
```

Reiniciar app:

```bash
systemctl restart adaptador-mpo
```

Comprobar salud:

```bash
curl http://127.0.0.1:5000/api/health
```

Ver base de datos:

```bash
ls -lh /opt/adaptador-mpo/instance/app.db
```
