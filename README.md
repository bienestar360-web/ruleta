# 🎡 Ruleta de Descuentos Pata Vercel

Esta es una pequeña aplicación web (solo HTML, CSS y JS vanilla) lista para ser desplegada en Vercel. 
Ofrece una ruleta interactiva donde todos los usuarios ganan un descuento tras ingresar su número de WhatsApp.

## 🚀 Cómo Desplegar en Vercel

**Opcion 1: Vercel CLI (Más rápido si lo tienes)**
1. Abre tu terminal en esta carpeta (`/home/dario/Escritorio/ruleta`).
2. Ejecuta `vercel`.
3. Sigue los pasos que te marque la consola y en segundos tendrás tu URL pública!

**Opción 2: Arrastrar y Soltar en Vercel Web**
1. Entra a [Vercel.com](https://vercel.com) e inicia sesión.
2. Ve a la sección de "Dashboard".
3. Arrastra esta carpeta o los archivos directos a la sección que dice "Drag & Drop".
4. Vercel reconocerá automáticamente que es un sitio estático y te dará una URL.

**Opción 3: Vía GitHub (Recomendado para mantenimiento a largo plazo)**
1. Crea un repositorio en GitHub (ej. `ruleta-descuentos`).
2. Sube estos tres archivos (`index.html`, `style.css`, `script.js`).
3. Entra a Vercel, dale a "Add New..." -> "Project".
4. Conecta tu cuenta de GitHub y selecciona el repositorio de la ruleta.
5. Haz clic en "Deploy".

---

## 💾 Historial de Premios (Log Local)

Para simplificar el uso y evitar configuraciones externas (como Google Sheets o variables de entorno), esta versión guarda los datos **directamente en el navegador**.

### Cómo funciona:
1. **Fácil acceso**: Al final de la página (después de la ruleta) verás una sección llamada **"Historial de Premios"**.
2. **Persistencia**: Los datos se guardan en el `localStorage` del navegador. Incluso si cierras la pestaña o refrescas, los números de WhatsApp y los premios seguirán ahí.
3. **Control**: Al final de la semana, puedes copiar los datos a un Excel manual y presionar el botón **"Limpiar Historial"** para vaciar la lista.

### Ventajas:
- **Privacidad**: Los datos no salen del navegador hacia ningún servidor externo.
- **Rapidez**: No requiere configuración de API ni bases de datos.
- **Sin Costo**: Funciona 100% gratis en cualquier hosting (Vercel, GitHub Pages, etc.).

---

### Ajustes Rápidos
- **Número de contacto**: Cambia el `businessNumber` al final de `script.js` con tu WhatsApp comercial real.
- **Limpiar datos**: Si quieres que un mismo usuario pueda volver a jugar para probar, borra los datos del sitio en tu navegador o usa el botón de limpiar historial.
