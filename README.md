<div align="center">

# 🎮 ROXS RUNNER — Deploy or Die!

**Un endless runner pixel art con bugs, pipelines rotos y mucho fuego. 🔥**

Creado para **[ROXSFEST 2026](https://roxsfest.com)** · *Build with Fire. Deploy with Power.*

**HTML5 · CSS3 · Js**

</div>

## 🚀 ¿De qué se trata?

Ayudá a **Roxs** a llegar a producción: corré, saltá obstáculos DevOps (bugs, errores HTTP 500, alertas y pipelines fallidos), recolectá tecnologías y superá tu propio récord.

Es un minijuego arcade para jugar desde una computadora o un celular. El personaje principal utiliza el archivo `roxsfest.png`, incluido en la **raíz** del repositorio.

## ▶️ Ejecutar el juego localmente

Cloná el repositorio de GitHub:

```bash
git clone https://github.com/roxsross/roxs-runner-fest.git
cd roxs-runner-fest
```

Abrí `index.html` en Chrome, Firefox, Safari o Edge. Reemplazá `TU-USUARIO` por el usuario o la organización donde publiques el repositorio.

> No necesitás instalar Node.js, ejecutar `npm install` ni configurar un backend. Si el navegador restringe el acceso a archivos locales, podés usar un servidor estático, como Live Server de VS Code.

**¿Querés jugar online?** Cuando actives GitHub Pages, agregá acá el enlace directo al juego para que cualquiera pueda abrirlo sin clonar el proyecto.

## 🕹️ Controles

| Acción | Computadora | Celular o tablet |
| --- | --- | --- |
| Saltar | `Espacio` o `↑` | Tocar el juego o **SALTAR** |
| Pausar / continuar | `P` o botón `Ⅱ` | Botón `Ⅱ` |
| Activar / silenciar audio | Botón `🔊/🔇` | Botón `🔊/🔇` |
| Volver a jugar | **RETRY DEPLOY** | **RETRY DEPLOY** |

## 🏆 Mecánicas

- 🏃‍♀️ **Carrera automática:** esquivá obstáculos saltando en el momento justo.
- 🐛 **Caos en producción:** evitá bugs, contenedores rotos, errores y alertas.
- ☁️ **Coleccionables DevOps:** recolectá ítems de tecnologías para obtener puntos adicionales.
- 📈 **Dificultad progresiva:** el juego acelera a medida que avanzás.
- 💾 **Récord local:** tu mejor puntaje se guarda en `localStorage` del navegador.
- 🔊 **Efectos arcade:** sonido activable desde la interfaz.

**Logros especiales:**

| Puntos | Mensaje |
| ---: | --- |
| 295 | 🔥 **ON FIRE!** |
| 500 | 🚀 **DEPLOY MASTER!** |
| 1000 | 👑 **DEVOPS LEGEND!** |

> El récord es **individual y local**: no hay cuentas de usuario ni tabla de clasificación pública. Para incorporar un ranking compartido haría falta almacenamiento en un servicio externo.

## 📁 Archivos del repositorio

```text
roxs-runner/
├── index.html       # Página, canvas y controles
├── style.css        # Estilos arcade y diseño adaptable
├── game.js          # Juego: física, obstáculos, colisiones y puntos
├── roxsfest.png     # Imagen original del personaje
├── PROMPT.md        # Especificación para agentes de IA
└── README.md        # Documentación del repositorio
```

**Importante:** no muevas `roxsfest.png` a una carpeta `assets/`: el código la carga desde `./roxsfest.png`.

## 🛠️ Stack técnico

| Tecnología | Uso |
| --- | --- |
| HTML5 + Canvas API | Escenario y renderizado |
| CSS3 | Interfaz, animaciones y responsive |
| JavaScript Vanilla | Bucle de juego, controles y lógica |
| Web Audio API | Efectos de sonido |
| localStorage | Mejor puntuación por navegador |

Sin frameworks, librerías externas ni build step.

## 🌐 Publicar gratis con GitHub Pages

1. Creá un repositorio en GitHub, por ejemplo `roxs-runner`, y subí estos archivos a la raíz de la rama `main`.
2. En el repositorio, entrá en **Settings → Pages**.
3. En **Build and deployment**, seleccioná **Deploy from a branch**.
4. Elegí **`main`** y la carpeta **`/(root)`**, y guardá los cambios.
5. Cuando GitHub termine de publicar, el juego normalmente estará en:

   `https://TU-USUARIO.github.io/roxs-runner/`

La URL anterior es **un ejemplo**: reemplazá el usuario y el nombre del repo según corresponda. GitHub Pages puede demorar unos minutos en publicar.

## 🤝 Contribuciones

¿Tenés ideas para nuevos obstáculos, efectos o mejoras de accesibilidad? ¡Las contribuciones son bienvenidas!

1. Creá un *fork* del repositorio.
2. Abrí una rama: `git checkout -b feat/mi-mejora`.
3. Hacé cambios pequeños y comprobá que el juego siga funcionando en desktop y móvil.
4. Enviá un *Pull Request* explicando qué cambiaste.

**Por favor:** mantené el proyecto en HTML, CSS y JavaScript nativos, sin dependencias nuevas salvo que se acuerde previamente. No reemplaces ni alteres `roxsfest.png` sin autorización; es la identidad visual del personaje.

## 🤖 Construido y mejorado con IA

El archivo **[`PROMPT.md`](./PROMPT.md)** explica cómo reconstruir y evolucionar el juego con un agente de programación como Kiro, Claude Code o Copilot.

Podés darle a tu agente esta instrucción:

> Leé `README.md` y `PROMPT.md`, analizá `index.html`, `style.css` y `game.js`, y proponé mejoras al videojuego. Mantené `roxsfest.png` en la raíz, respetá su diseño y no agregues frameworks.

## 🧪 Verificación rápida

Antes de publicar o enviar un PR, comprobá que:

- Se vea Roxs en la pantalla inicial y durante la partida.
- Funcionen el salto, las colisiones y el reinicio.
- La puntuación aumente y el récord se conserve después de recargar.
- Se pueda jugar desde una pantalla táctil.
- No haya errores en la consola del navegador.

## 📜 Licencia

**Pendiente de definir.** Antes de publicar el proyecto como open source, agregá un archivo `LICENSE` con la licencia que elijas. La licencia del **código** y los permisos de uso de la **imagen `roxsfest.png`** pueden definirse por separado.

---

<div align="center">

**Made with 🔥 by Roxs**  
**[ROXSFEST 2026](https://roxsfest.com)** · *Build with Fire. Deploy with Power.*

</div>
