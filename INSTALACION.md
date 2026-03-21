# 🌊 Marea — Guía de instalación en GitHub Pages

## ¿Por qué GitHub Pages?

- ✅ **Gratuito para siempre** (cuenta personal)
- ✅ **HTTPS automático** (necesario para PWA y notificaciones)
- ✅ **Dominio propio gratis**: `tuusuario.github.io/marea`
- ✅ **Fiable y rápido** — infraestructura de Microsoft/GitHub
- ✅ **Sin anuncios, sin límites de visitas**
- ✅ **Actualización automática** al subir archivos

---

## INSTALACIÓN PASO A PASO

### 1. Crea una cuenta en GitHub (si no tienes)
→ https://github.com/signup (gratis)

### 2. Crea un repositorio nuevo
1. Ve a https://github.com/new
2. Nombre del repositorio: `marea` (o el que quieras)
3. Marca **"Public"** (necesario para GitHub Pages gratuito)
4. Haz clic en **"Create repository"**

### 3. Sube los archivos
**Opción A — Desde el navegador (sin instalar nada):**
1. En tu repositorio, haz clic en **"uploading an existing file"**
2. Arrastra los 3 archivos: `index.html`, `sw.js`, `manifest.json`
3. Haz clic en **"Commit changes"**

**Opción B — Con GitHub Desktop (más cómodo):**
1. Descarga GitHub Desktop: https://desktop.github.com
2. Clona tu repositorio
3. Copia los 3 archivos a la carpeta del repositorio
4. Haz clic en "Commit to main" → "Push origin"

### 4. Activa GitHub Pages
1. En tu repositorio, ve a **Settings** (⚙️)
2. En el menú izquierdo, haz clic en **"Pages"**
3. En "Branch", selecciona **"main"** y haz clic en **"Save"**
4. Espera 2–3 minutos
5. Tu agenda estará en: `https://TUUSUARIO.github.io/marea/`

---

## INSTALAR COMO APP EN TUS DISPOSITIVOS

### En el ordenador (Chrome o Edge):
- Abre la URL de tu agenda
- Aparece automáticamente un botón "Instalar app" en la barra de direcciones
- Clic en él → la app se instala como programa nativo

### En iPhone / iPad (Safari):
1. Abre la URL en Safari
2. Toca el botón **Compartir** (cuadrado con flecha ↑)
3. Desplázate y toca **"Añadir a pantalla de inicio"**
4. Toca **"Añadir"** — ya aparece como app

### En Android (Chrome):
- Abre la URL
- Aparece automáticamente el banner "Añadir a pantalla de inicio"
- O: menú ⋮ → "Instalar aplicación"

---

## SINCRONIZACIÓN ENTRE DISPOSITIVOS

### Versión básica (ya incluida):
Los datos se guardan en cada dispositivo localmente. Funciona offline.

### Sincronización real entre todos tus dispositivos:

#### Con Firebase (gratis hasta 50.000 lecturas/día):

1. Ve a https://console.firebase.google.com
2. Haz clic en **"Agregar proyecto"** → ponle nombre → Crear
3. En el menú izquierdo: **Firestore Database** → Crear base de datos → Modo de prueba → Siguiente
4. En el menú izquierdo: **Configuración del proyecto** (⚙️) → **Tus apps** → icono `</>` (web)
5. Registra la app, copia la configuración `firebaseConfig`
6. En tu `index.html`, antes de `</body>`, añade:

```html
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
<script>
  firebase.initializeApp({
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id"
  });
  const db = firebase.firestore();
  const USER_ID = 'mi-agenda'; // cambia esto si quieres compartir entre usuarios

  // Sobreescribe las funciones de guardado y carga
  const _save = save;
  window.save = async function() {
    try {
      await db.collection('marea').doc(USER_ID).set({
        events: S.events,
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem('marea_pages', JSON.stringify(S.pages));
      setSyncState('ok');
    } catch(e) {
      setSyncState('offline');
      _save(); // fallback a localStorage
    }
  };

  window.load = async function() {
    try {
      const doc = await db.collection('marea').doc(USER_ID).get();
      if (doc.exists) {
        const data = doc.data();
        S.events = data.events || {};
      }
      const p = localStorage.getItem('marea_pages');
      if (p) S.pages = JSON.parse(p);
    } catch(e) {
      // fallback a localStorage
      const r = localStorage.getItem('marea_v3');
      if (r) S.events = JSON.parse(r).events || {};
    }
  };

  // Escucha cambios en tiempo real
  db.collection('marea').doc(USER_ID).onSnapshot(doc => {
    if (doc.exists) {
      S.events = doc.data().events || {};
      render();
      setSyncState('ok');
    }
  });
</script>
```

7. Guarda y sube a GitHub Pages → **sincronización en tiempo real** en todos tus dispositivos

---

## ACTUALIZAR LA APP

Cuando quieras añadir mejoras o cambios:
1. Edita los archivos
2. Súbelos de nuevo a GitHub (arrastra y suelta)
3. GitHub Pages se actualiza automáticamente en 1–2 minutos
4. La app en tus dispositivos se actualiza sola (Service Worker)

---

## ATAJOS DE TECLADO

| Tecla | Acción |
|---|---|
| `Y` | Vista año |
| `M` | Vista mes |
| `W` | Vista semana |
| `D` | Vista día |
| `T` | Ir a hoy |
| `N` | Nuevo evento |
| `/` | Búsqueda |
| `← →` | Navegar |
| `Esc` | Cerrar |

---

*Marea v3.0 — Agenda de lujo · Estética marina · 2025–2074*
