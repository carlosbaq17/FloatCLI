# 🚀 FloatCLI - Vibe Coding Terminal

FloatCLI es la herramienta definitiva para integrar tu entorno de desarrollo nativo directamente en tu navegador. Mediante la API moderna de Document Picture-in-Picture, FloatCLI superpone una terminal flotante persistente (siempre visible) que te acompaña a través de todas las pestañas de tu navegador sin bloqueos y de forma altamente customizable con un motor de división interno (Split Panes).

---

## 🏗 Arquitectura Híbrida

Transparencia y seguridad son nuestros pilares. FloatCLI utiliza una arquitectura de **Native Messaging** estructurada en dos componentes:

1. **El Monitor (Extensión Chrome):** Actúa como una interfaz segura en el navegador. Controla la ventana PiP, la gestión de pestañas y el motor visual de *Split Panes*, sin tener acceso directo a tus archivos.
2. **El Motor Local (Native Host):** **(Este repositorio)** Contiene el backend en Node.js que procesa el entorno de terminal real (PowerShell/Bash) de forma aislada e intercomunicada.

Esta separación técnica garantiza que la extensión pueda interactuar con el sistema operativo sin comprometer en ningún momento la seguridad ni las políticas restrictivas (CSP) del navegador web, delegando la capa de ejecución nativa puramente a tu entorno local.

---

## ⚙️ Instalación en 2 Pasos

Para enlazar la extensión de la tienda con tu ordenador, sigue estas instrucciones:

### Paso 1: Instalar la UI desde la Chrome Web Store
Descarga la extensión oficial desde la tienda de Google:
👉 [FloatCLI en Chrome Web Store](#) *(Enlace de descarga próximamente)*

### Paso 2: Configurar este Backend (Motor Local)
Descarga el código fuente de este repositorio y configúralo en tu equipo:
1. Clona o descarga el repositorio y extráelo en una carpeta permanente en tu ordenador.
2. Entra a la subcarpeta `native-host`:
   ```bash
   cd ruta/al/repositorio/native-host
   npm install
   ```
3. Vuelve a la raíz del repositorio y ejecuta (doble clic) el archivo **`install_windows.bat`**.

> ¡Y eso es todo! Abre la extensión desde tu navegador y empieza a disfrutar de FloatCLI.

---

## 🔒 Privacidad Absoluta

FloatCLI se ejecuta **100% de manera local** en tu máquina. 
No recopila métricas, no incluye analíticas y **no se envía absolutamente ningún dato** a servidores de terceros ni a la nube. El código del backend es open source y está aquí disponible para que puedas auditarlo tú mismo.
