# Prompt para un agente de IA — ROXS RUNNER: Deploy or Die!

## Rol y objetivo
Actuá como desarrollador senior especializado en juegos web arcade con HTML5 Canvas, CSS3 y JavaScript Vanilla. Construí un videojuego real, completo y jugable llamado **ROXS RUNNER — DEPLOY OR DIE!**, para **ROXSFEST 2026**, inspirado en el runner del dinosaurio de Chrome, pero con una identidad visual pixel art, temática DevOps y estética retro/neón. No entregues una maqueta ni pseudocódigo: implementá los archivos funcionales.

Si recibís este repositorio, primero examiná y preservá sus archivos actuales, corregí problemas e implementá mejoras sin perder funcionalidades. Si te piden reconstruirlo desde cero, seguí todas las especificaciones de este documento.

## Estructura obligatoria (todo en la raíz)

```text
roxs-runner/
├── index.html
├── style.css
├── game.js
├── roxsfest.png
└── PROMPT.md
```

- **`roxsfest.png` ya existe** y es el personaje principal. No la modifiques ni generes otra imagen. Cargala mediante `new Image()` y `src = './roxsfest.png'`; en la pantalla de inicio usá `src="./roxsfest.png"`.
- No crees carpetas `assets`, `images` ni `public`. No uses dependencias, frameworks, librerías, TypeScript, Node ni recursos remotos obligatorios.
- El proyecto debe poder ejecutarse abriendo directamente `index.html` en el navegador, sin servidor ni instalación.

## Jugabilidad
- Endless runner lateral: Roxs se mantiene hacia la izquierda; suelo, fondo y obstáculos se desplazan hacia la izquierda; el personaje avanza automáticamente.
- Controles: **Espacio** o **Flecha arriba** para saltar, **P** para pausar/reanudar, toque/clic en el canvas para saltar y botón táctil «SALTAR» para móviles. Prevení scroll de la página con los controles y las repeticiones de teclas.
- Física con gravedad, velocidad vertical, suelo y **un solo salto por aterrizaje**. Detección de colisiones AABB justa: ajustá la hitbox al cuerpo visible de Roxs sin incluir márgenes transparentes de la imagen.
- Como `roxsfest.png` es una imagen fija, simulá la carrera con un balanceo suave, pequeña inclinación y partículas, sin inventar fotogramas ni deformar el sprite. Respetá la relación de aspecto y `image-rendering: pixelated`.
- Obstáculos dibujados mediante Canvas, sin imágenes externas: `BUG`, `500`, `CI FAIL`, contenedor roto (`BOX`) y `ALERT`. Deben aparecer por la derecha y poder esquivarse. Asegurá distancias mínimas y velocidad razonable para impedir situaciones imposibles.
- Coleccionables dibujados con Canvas: Docker, Kubernetes, AWS, Git y Terraform. Deben aparecer a alturas alcanzables; al tocarlos, desaparecer, sumar **25 puntos**, mostrar `+25`, partículas y un sonido.
- SCORE crece con la distancia recorrida y los coleccionables. DEPLOYS cuenta los coleccionables. BEST conserva el récord con `localStorage` bajo `roxsRunnerBest` (y funciona aunque localStorage esté restringido).
- Mostrar milestones **solo una vez por partida**: al alcanzar **295**, «🔥 ON FIRE!»; **500**, «🚀 DEPLOY MASTER!»; **1000**, «👑 DEVOPS LEGEND!». Animaciones breves sin interrumpir la partida.
- Dificultad progresiva: EASY (0–99), NORMAL (100–299), HARD (300–599), EXPERT (600–999), ON FIRE (1000+). Incremento gradual de velocidad y frecuencia, con límites que preserven la jugabilidad.

## Pantallas y diseño
- **Inicio**: «ROXS RUNNER», «DEPLOY OR DIE!», «ROXSFEST 2026», avatar `roxsfest.png`, mensaje «¡Ayudá a Roxs a llegar a producción sin romper el pipeline!», instrucciones y botón **🚀 START DEPLOY**.
- **Durante la partida**: HUD con SCORE, BEST, DEPLOYS y LEVEL; botones de pausa y sonido; escenario Canvas responsive.
- **Pausa**: título «⏸ DEPLOY PAUSED», botón «▶ RESUME» y congelación efectiva de física, puntuación, spawns y animación del juego.
- **Game Over**: «💥 PIPELINE FAILED!», SCORE, BEST, DEPLOYS COMPLETED y botón «🔄 RETRY DEPLOY». Elegí un comentario al azar de: «En mi máquina funcionaba.», «¿Quién hizo push a main?», «Otro viernes en producción.», «Rollback y seguimos.», «El pipeline tenía otros planes.», «¿Probaste reiniciarlo?». Si corresponde, mostrar «🏆 NEW HIGH SCORE!».
- Estética arcade/pixel art con fondo oscuro `#090914`, rosa `#FF2D95`, magenta `#D946EF`, violeta `#8B5CF6`, cian `#00F5FF`, blanco, verde éxito y rojo error. Fondo Canvas con estrellas, servidores, nubes, circuitos, suelo con cuadrícula y parallax no distractor.
- Partículas en saltos, aterrizajes, recompensas y colisiones; microinteracciones en botones y HUD. Mantener buen contraste, legibilidad, rendimiento y experiencia en pantallas pequeñas.
- Branding: **ROXSFEST 2026**, lema **«Build with Fire. Deploy with Power.»**, pie **«Made with 🔥 by Roxs»** y enlace a `https://roxsfest.com` con `target="_blank"` y `rel="noopener noreferrer"`.

## Sonido y arquitectura
- Sonidos retro básicos con **Web Audio API** para comenzar, saltar, recolectar, hit, récord y ON FIRE; interruptor de sonido. Desbloquear audio únicamente tras interacción del usuario; no descargar audios.
- Implementar loop único con `requestAnimationFrame` y delta time limitado; estados `MENU`, `PLAYING`, `PAUSED`, `GAME_OVER`. Separar responsabilidades de Player, Obstacle, Collectible, Particle, Background, Game, AudioManager/UI.
- Redimensionar el canvas visualmente conservando una resolución lógica consistente para las colisiones. Evitar múltiples loops y temporizadores huérfanos al reiniciar. Pausar cuando la pestaña quede oculta.
- No introducir errores de consola. Manejar de forma segura imagen no cargada y APIs opcionales.

## Entregables y pruebas
Entregá **código completo** y funcional para `index.html`, `style.css` y `game.js`, utilizando el `roxsfest.png` ya presente sin moverlo. Verificá manualmente o con pruebas los siguientes flujos: cargar imagen, inicio, salto por teclado/touch, gravedad, obstáculos, colisiones, coleccionables, score, récord persistente, milestones, aumento de dificultad, pausa/reanudación, game over/reintento, sonidos y diseño móvil. No declares probado algo que no hayas ejecutado realmente.

**Resultado buscado:** un minijuego DevOps arcade jugable y compartible durante ROXSFEST 2026. **BUILD WITH FIRE. DEPLOY WITH POWER.**
