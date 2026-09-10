# ⚡ Pokédex en Python

Proyecto completo de Pokédex implementado en **Python**, combinando el consumo de la API oficial de Pokémon, precarga optimizada en hilos, reproducción de rugidos oficiales (`cries`), estadísticas detalladas, filtros por tipo y doble modalidad (Web con Flask y Escritorio con Tkinter).

---

## 📁 Estructura del Proyecto

```text
pokedex johan/
├── app.py                  # Servidor Web Backend en Python con Flask
├── pokedex_gui.py          # Aplicación de Escritorio nativa en Python (Tkinter)
├── requirements.txt        # Dependencias de Python (Flask)
├── templates/
│   └── index.html          # Plantilla HTML con Jinja2 para Flask
├── static/
│   ├── style.css           # Estilos CSS de la Pokédex
│   └── script.js           # Lógica frontend y reproducción de audio
├── index.html              # Versión web standalone (para abrir directamente)
├── style.css               # Estilos versión directa
└── script.js               # Lógica versión directa
```

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Opción Web (Flask)

1. Abre una terminal en esta carpeta.
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Inicia el servidor Flask:
   ```bash
   python app.py
   ```
4. Abre tu navegador en:
   **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

*Características en Flask:*
- Servidor backend en Python que precarga y almacena en caché en memoria los 151 Pokémon para que la página cargue en milisegundos.
- Endpoints REST en `/api/pokemon` y `/api/pokemon/<id_o_nombre>`.
- Filtrado por tipos y búsqueda gestionados desde Python y el frontend.

---

### 2. Opción Escritorio (Tkinter)

Si deseas una ventana de escritorio nativa de Windows en Python:
```bash
python pokedex_gui.py
```
*No requiere librerías externas (utiliza la librería estándar de Python).*

---

### 3. Modo Directo en Navegador (Sin servidor)
Si solo quieres ver la interfaz rápidamente sin iniciar Python:
- Haz doble clic en el archivo [**`index.html`**](file:///c:/Users/SENA%20CSET/Documents/pokedex%20johan/index.html).
