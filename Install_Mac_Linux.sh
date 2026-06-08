#!/bin/bash

echo "=============================================="
echo "Bienvenido al Instalador de FloatCLI (Mac/Linux)"
echo "=============================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no esta instalado."
    echo "Por favor, descarga e instala Node.js desde https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm no esta instalado."
    exit 1
fi

echo "Instalando dependencias del motor local..."
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/native-host" || exit 1
npm install --silent

if [ $? -ne 0 ]; then
    echo "[ERROR] Fallo al instalar dependencias."
    exit 1
fi

# Add executable permissions to the host script
chmod +x "$DIR/native-host/host.js"
# Make sure it has a shebang at the top, just in case
if ! head -n 1 "$DIR/native-host/host.js" | grep -q "#!/usr/bin/env node"; then
    sed -i.bak '1i\
#!/usr/bin/env node
' "$DIR/native-host/host.js" 2>/dev/null || true
    rm -f "$DIR/native-host/host.js.bak" 2>/dev/null || true
fi

if [ "$(uname)" == "Darwin" ]; then
    TARGET_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
else
    TARGET_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
fi

mkdir -p "$TARGET_DIR"

JSON_PATH="$TARGET_DIR/com.floatcli.terminal.json"

cat <<EOF > "$JSON_PATH"
{
  "name": "com.floatcli.terminal",
  "description": "FloatCLI Native Host",
  "path": "$DIR/native-host/host.js",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://dnpbbaapeddlnjhkegdelipmhopkhgnj/"
  ]
}
EOF

echo "=============================================="
echo "Instalacion completada con exito."
echo "Ya puedes usar la extension FloatCLI."
echo "=============================================="
