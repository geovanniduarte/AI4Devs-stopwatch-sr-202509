Prompt inicial con justificación:

PROMPT: Actúa como un desarrollador javascript y html, necesito crear una aplicación web que pueda funcionar en modo cronómetro mostrando el tiempo transcurriendo,  y a su vez pueda funcionar en modo cuenta regresiva, la pantalla de inicio deberá proveerle al usuario la posibilidad de agregar ya sea un cronometro o una cuenta regresiva uno debajo del otro en una columna en la parte inferior, los requerimientos para el modo cronómetro son: 1) Tomando como referencia la imagen cargada "stopwatch.jpg" Como estado inicial,  debe mostrar un texto con el tiempo transcurrido en formato hh:mm:ss en 00:00:00 representado por el texto grande superior en la imagen, debe mostrar un texto de contador de milisegundos inicialmente en 000 representado por el texto pequeño en la parte inferior derecha del texto de tiempo transcurrido, debajo de los textos debe mostrar 3 diferentes botones así:  los botones Start a la izquierda y Clear a la derecha. 4) al presionar el botón Start deben empezar a transcurrir los milisegundos en el texto de contador de milisegundos, cada mil milisegundos deberá empezar en 000 de nuevo y El botón Start se convertirá en un botón con su mismo estilo pero llamado Pause 4) Por cada milisegundo transcurrido deberá sumarse un segundo en el texto de tiempo transcurrido.  5) Mientras el botón Pause esté visible, el contador debe continuar corriendo hasta que el botón "Pause" sea presionado, 6) Cuando el botón "Pause" es presionado, tanto el texto de tiempo transcurrido como el de contador de milisegundos permanecen congelados en este estado y el botón Pause se convierte en el botón "Continue" el cual ahora es de color azul. 7) Cuando el botón "Continúe" sea presionado, los textos de tiempo transcurrido y contador de milisegundos continuan transcurriendo y el botón "Continue" se convierte en el botón "Pause" quedando el botón "Pause" visible.  8) Cuando el botón "Clear" es presionado, todo el stopwatch vuelve a su estado inicial.  Estos son los requerimientos específicos para modo cuenta regresiva: 1) El usuario debe proporcionar el tiempo inicial, en vez de los botones "Start" y "Clear" deberá haber un botón por cada numero del 1 al 10 el cual irá llenando cada uno de los espacios del texto de tiempo transcurrido de izquierda a derecha. un botón llamado "Set" y otro botón llamado "Clear", al presionar, el layout de los elementos está especificado en la imagen "countdown.jpg" 2) Una vez presionado el botón "Set" Los botones "Start" y "Clear" deberán aparecer en pantalla, tal como en la imagen "stopwatch.jpg" 3) El estado inicial esta ahora dado por el tiempo inicial definido en el numeral 2 y los botones "Start" y "Clear" visibles   4) Por cada milisegundo transcurrido deberá restarse un segundo en el texto de tiempo transcurrido.  5) Al finalizar una cuenta regresiva, **muestra una notificación** y **reproduce un sonido de alerta**.  El resultado deberá escribirse en dos archivos principales, "index.html" y "script.js" el segundo deberá referenciarse en el primero, separa en un archivo styles.css.

JUSTIFICACION: Aprovechando que teniamos la demo, la utilicé, entendí todos los casos de uso y desglosé la funcionalida en requerimientos específicos según cada estado, quise hacerlo en un único parrafo, inicialmente con mis palabras pero con bullets para cada uno de los requerimientos, utilicé imagenes tomadas tanto del ejercicio como de la misma demo y las adjunté al prompt inicial.

Resultados parciales con errores o fallos detectados

* Botones no consistentes en el estilo, en cronómetro pequeños y en countdown grandes.
* en countdown el texto se escribía de izquierda a derecha, creo que fué error del prompt, así se escribió inicialmente.
* overlap de textos.

Refinamientos aplicados

* Hice Prompt enginering, cargandole la imagen de la sección para que me organizara el prompt en secciones
* Agregué las correcciones a los errores que tenía en el prompt inicial, 
    - llenado de derecha a izquierda
    - pedí consistencia en botones.
    - en partes específicas reiteré que tome las imagenes como referencia para el layout y evitar errores visuales como overlaps de textos y elementos.

Prompt final

## Rol

- Actúa como un desarrollador con experiencia en JavaScript, HTML y CSS para aplicaciones web interactivas.

## Contexto

- Necesito una aplicación web que funcione tanto en modo cronómetro como en modo cuenta regresiva.
- El usuario podrá agregar múltiples temporizadores de cualquiera de los dos tipos en una columna ubicada en la parte inferior de la pantalla.
- El diseño y disposición deben seguir las referencias visuales “stopwatch.jpg” y “countdown.jpg”.

## Resultado Deseado

- El desarrollo debe dividirse en tres archivos:
    - `index.html`: Estructura base, incluye referencias a scripts y estilos.
    - `script.js`: Lógica funcional de cronómetros y cuentas regresivas.
    - `styles.css`: Estilos visuales y layout.
- Cada modo debe cumplir fielmente con los requerimientos funcionales y visuales especificados.

## Tono y Estilo

- El código debe seguir buenas prácticas y estar debidamente comentado.
- Usa nombres descriptivos y respeta el layout de las imágenes de referencia.
- Estilo profesional, limpio y mantenible.

## Opciones y Requerimientos

### Modo Cronómetro

- Estado inicial: muestra el tiempo `00:00:00` (grande arriba) y los milisegundos `000` (pequeño abajo a la derecha).
- Ten en cuenta las imágenes de referencia para ubicar el texto de los milisegundos justo debajo a la derecha del texto de tiempo y evitar que haga overlap con los contenedores.
- Debajo debe haber dos botones: Start (izquierda) y Clear (derecha).
- Al presionar Start:
    - Inician los milisegundos (000–999), por cada 1000 ms se suma un segundo y los ms reinician a 000.
    - Start se convierte en Pause con mismo estilo.
- Pause:
    - Congela ambos textos y cambia a botón Continue (azul).
- Continue:
    - Retoma el conteo y se convierte de nuevo en Pause.
- Clear:
    - Reinicia el estado inicial.

### Modo Cuenta Regresiva

- Inicialmente el usuario define el tiempo mediante botones del 1 al 10, llenando de derecha a izquierda el texto de tiempo, ultimo numero escrito queda de último a la derecha.
- Ten en cuenta el layout en la imagen “countdown.jpg” para ubicar los botones responsivamente dentro de la caja contenedora de cada cuenta regresiva.
- Debajo hay botones Set y Clear.
- Cuando se presiona Set:
    - Aparecen botones Start y Clear (como en el cronómetro).
    - El tiempo definido es el punto de partida.
- Start:
    - Cada milisegundo transcurrido, resta un segundo al tiempo.
- Al finalizar:
    - Mostrar una notificación y reproducir un sonido de alerta.
- Clear:
    - Vuelve al estado inicial.


- El usuario puede añadir múltiples cronómetros o cuentas regresivas, todos independientes entre sí.
- Los textos no deben hacer overlap entre ellos.
- Los botones deben tener el mismo tamaño ya sea en cronómetro o countdown

## Salida/Output Style

- Entregar únicamente los tres archivos `index.html`, `script.js` y `styles.css`, preparados para usarse directamente, sin explicaciones adicionales.

Breve explicación de por qué el último prompt funcionó mejor

* La prompt engineering hizo el prompt inicial mas conciso.
* Aunque las imagenes estaban referenciadas al inicio del enunciado, hubo necesidad de volverlas a enunciar en momentos específicos ya que aluncinaba un poco en temas de UI.
* fuí más explicito con los errores que se evidenciaron en la primera iteración.