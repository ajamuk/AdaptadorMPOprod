#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/adaptador-mpo"
DB_FILE="$APP_DIR/instance/app.db"
BACKUP_DIR="$APP_DIR/backups"
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"

mkdir -p "$BACKUP_DIR"

if [ -f "$DB_FILE" ]; then
  cp "$DB_FILE" "$BACKUP_DIR/app-$STAMP.db"
  find "$BACKUP_DIR" -type f -name 'app-*.db' -mtime +30 -delete
fi
