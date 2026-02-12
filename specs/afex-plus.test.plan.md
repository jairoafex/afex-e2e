# Plan de Pruebas Afex+ — Exploración y Validación

## Application Overview

Plan de pruebas para la aplicación Afex+. Objetivo: validar funcionalidades clave (autenticación, búsqueda y gestión de clientes, cotizador/transacciones, consultas y filtros), las validaciones de campo y el manejo de errores. Asunción inicial: estado fresco de la aplicación (sesión no iniciada) y datos de prueba disponibles; usar el cliente de ejemplo `222311233` para flujos relacionados con clientes.

## Test Scenarios

### 1. Autenticación y Navegación

**Seed:** `src/tests/seed.spec.ts`

#### 1.1. Inicio de sesión exitoso

**File:** `tests/auth/login-success.spec.ts`

**Steps:**
  1. Asunción: aplicación en estado fresco; cuenta de prueba válida.
  2. 1) Abrir la aplicación en /.
  3. 2) Hacer clic en el control de login en el banner (si aplica).
  4. 3) Ingresar credenciales válidas y enviar.
  5. 4) Verificar redirección al dashboard y que el nombre de usuario aparece en el banner.

**Expected Results:**
  - Usuario autenticado y token de sesión almacenado.
  - Dashboard visible con datos resumidos.
  - Elemento de usuario en banner muestra el nombre; no hay mensajes de error.

#### 1.2. Inicio de sesión con credenciales inválidas

**File:** `tests/auth/login-fail.spec.ts`

**Steps:**
  1. Asunción: estado fresco.
  2. 1) Intentar iniciar sesión con usuario existente y contraseña incorrecta.
  3. 2) Enviar formulario.
  4. 3) Verificar mensaje de error y que no se redirige.
  5. 4) Intentar con campos vacíos y verificar validación de formulario.

**Expected Results:**
  - Se muestra mensaje de credenciales inválidas; no hay redirección.
  - Campos obligatorios muestran validación si están vacíos.

#### 1.3. Cerrar sesión

**File:** `tests/auth/logout.spec.ts`

**Steps:**
  1. Asunción: usuario autenticado.
  2. 1) Hacer clic en el menú de usuario y seleccionar cerrar sesión.
  3. 2) Confirmar acción si aplica.
  4. 3) Verificar redirección a la pantalla pública y que no se pueden acceder rutas protegidas.

**Expected Results:**
  - Sesión terminada; rutas protegidas devuelven 401 o redirigen al login.
  - Banner muestra opciones para usuario no autenticado.

#### 1.4. Recuperación de contraseña - flujo negativo

**File:** `tests/auth/forgot-password.spec.ts`

**Steps:**
  1. Asunción: usuario no autenticado.
  2. 1) Abrir formulario de recuperación de contraseña.
  3. 2) Enviar correo/RUT inexistente.
  4. 3) Verificar mensaje de error o notificación que no revela existencia del usuario.

**Expected Results:**
  - La aplicación responde de forma segura (mensaje genérico) y no filtra datos del sistema.
  - No se produce redirección a áreas internas.

### 2. Gestión de Clientes (usar cliente 222311233)

**Seed:** `src/tests/seed.spec.ts`

#### 2.1. Búsqueda rápida de cliente por RUT/ID/Nombre

**File:** `tests/clients/search-client.spec.ts`

**Steps:**
  1. Asunción: usuario autenticado y página /transfers/feelookup abierta.
  2. 1) En el campo 'RUT/ID/Nombre' ingresar `222311233` y pulsar buscar.
  3. 2) Verificar que la cartola/tabla se actualiza con el cliente encontrado.
  4. 3) Abrir perfil del cliente encontrado.

**Expected Results:**
  - Cliente `222311233` aparece en resultados con datos básicos (nombre, teléfono, ciudad).
  - Perfil abre sin errores mostrando datos consistentes.

#### 2.2. Editar datos de cliente - validaciones

**File:** `tests/clients/edit-client-validate.spec.ts`

**Steps:**
  1. Asunción: cliente `222311233` localizado y perfil abierto.
  2. 1) Editar campos obligatorios (p.ej. teléfono, dirección) con formatos inválidos y enviar.
  3. 2) Verificar mensajes de validación por campo.
  4. 3) Corregir y guardar cambios.
  5. 4) Verificar persistencia de cambios en la vista y en búsqueda.

**Expected Results:**
  - Se muestran validaciones específicas por campo (p. ej. formato de teléfono).
  - Cambios válidos se guardan y se reflejan en búsquedas posteriores.

#### 2.3. Crear nuevo cliente - campos obligatorios

**File:** `tests/clients/create-client.spec.ts`

**Steps:**
  1. Asunción: usuario autenticado y en sección Cliente.
  2. 1) Iniciar flujo de creación de cliente.
  3. 2) Intentar guardar con campos obligatorios faltantes y verificar validaciones.
  4. 3) Completar datos válidos y guardar.
  5. 4) Buscar nuevo cliente y abrir perfil.

**Expected Results:**
  - Guardado bloqueado hasta completar campos obligatorios; mensajes claros.
  - Cliente creado aparece en búsqueda y perfil muestra los datos ingresados.

#### 2.4. Eliminar cliente con confirmación

**File:** `tests/clients/delete-client.spec.ts`

**Steps:**
  1. Asunción: cliente de prueba (no productiva) disponible y abierto.
  2. 1) Iniciar eliminación del cliente.
  3. 2) Verificar prompt de confirmación y opciones (confirmar/cancelar).
  4. 3) Confirmar eliminación y verificar que ya no aparece en búsquedas.

**Expected Results:**
  - Confirmación explícita requerida; tras confirmar el cliente es removido o marcado inactivo.
  - Intento de acceso posterior devuelve mensaje 'No encontrado' o similar.

### 3. Cotizador y Transacciones

**Seed:** `src/tests/seed.spec.ts`

#### 3.1. Cotizar envío - flujo feliz

**File:** `tests/quotes/quote-happy.spec.ts`

**Steps:**
  1. Asunción: usuario autenticado y sección 'Cotizador' visible.
  2. 1) Seleccionar país destino, método de entrega y monto a enviar.
  3. 2) Verificar cálculo de cambio y monto a recibir.
  4. 3) Enviar la cotización y validar que aparece resumen y opción para continuar a operación.

**Expected Results:**
  - Cambio mostrado coincide con tabla de paridades; montos correctos.
  - Resumen accesible y opción para crear operación disponible.

#### 3.2. Validación de montos y divisas

**File:** `tests/quotes/quote-validate-amount.spec.ts`

**Steps:**
  1. Asunción: cotizador abierto.
  2. 1) Ingresar monto inválido (negativo, texto, cero) y verificar validaciones.
  3. 2) Cambiar moneda a una no soportada si la interfaz lo permite y verificar manejo.
  4. 3) Intentar enviar sin seleccionar método de entrega.

**Expected Results:**
  - Interfaz bloquea envío con mensajes claros por montos inválidos.
  - Requerimientos de método de entrega son validados antes de cotizar.

#### 3.3. Crear y cancelar operación

**File:** `tests/transactions/create-cancel.spec.ts`

**Steps:**
  1. Asunción: cotización previa existe.
  2. 1) Desde resumen crear operación completando beneficiario y datos requeridos.
  3. 2) Confirmar creación y verificar estado inicial (p.ej. pendiente).
  4. 3) Intentar cancelar operación y validar cambios de estado y notificaciones.

**Expected Results:**
  - Operación creada con ID y estado visible en historial.
  - Cancelación actualiza estado y el registro refleja auditoría de la acción.

#### 3.4. Historial de operaciones y filtros

**File:** `tests/transactions/history-filter.spec.ts`

**Steps:**
  1. Asunción: operaciones test creadas para el usuario.
  2. 1) Abrir sección de historial/Cartola y aplicar filtro por rango de fecha y monto.
  3. 2) Verificar que la tabla aplica filtros correctamente y paginación funciona.
  4. 3) Exportar resultados si está disponible.

**Expected Results:**
  - Los filtros retornan solo operaciones dentro de criterios; paginación estable.
  - Export incluye las columnas esperadas y es descargable.

### 4. Consultas, Filtros y Reportes

**Seed:** `src/tests/seed.spec.ts`

#### 4.1. Filtrar transacciones por fecha y exportar

**File:** `tests/queries/filter-export.spec.ts`

**Steps:**
  1. Asunción: usuario autenticado con datos de operaciones.
  2. 1) Aplicar filtro por rango de fecha y tipo de operación.
  3. 2) Verificar resultados en tabla y usar botón de exportar/export CSV.
  4. 3) Abrir el archivo exportado y validar columnas críticas.

**Expected Results:**
  - Export contiene filas y columnas esperadas; fechas y montos coinciden con vista.

#### 4.2. Guardar y recuperar consultas frecuentes

**File:** `tests/queries/save-load-query.spec.ts`

**Steps:**
  1. Asunción: UI permite guardado de consultas.
  2. 1) Crear una consulta con filtros complejos y guardarla con nombre.
  3. 2) Cerrar sesión o cambiar sección; volver y cargar la consulta guardada.
  4. 3) Verificar que los filtros se aplican correctamente.

**Expected Results:**
  - Consulta guardada reaplica los mismos filtros y resultados consistentes.

#### 4.3. Búsqueda avanzada usando cliente 222311233

**File:** `tests/queries/advanced-search-client.spec.ts`

**Steps:**
  1. Asunción: cliente `222311233` existe con operaciones registradas.
  2. 1) Ejecutar búsqueda avanzada filtrando por cliente = `222311233` y rango de fechas.
  3. 2) Verificar que aparecen solo las operaciones del cliente.
  4. 3) Exportar o ver detalle de operación.

**Expected Results:**
  - Resultados contienen únicamente operaciones asociadas a `222311233`.
  - Detalle de operación muestra RUT/ID del cliente.

#### 4.4. Manejo de grandes volúmenes y paginación

**File:** `tests/queries/pagination-load.spec.ts`

**Steps:**
  1. Asunción: dataset con >500 registros disponible en ambiente de pruebas.
  2. 1) Ejecutar consulta amplia y navegar por paginación hasta último registro.
  3. 2) Verificar tiempos de respuesta y ausencia de errores en la UI.
  4. 3) Probar salto de página y cambio de tamaño de página (rows per page).

**Expected Results:**
  - Paginación consistente, sin duplicados; la UI maneja carga incremental.
  - Alertas o timeouts manejados con mensajes claros.

### 5. Validaciones, Errores y Resiliencia

**Seed:** `src/tests/seed.spec.ts`

#### 5.1. Campos obligatorios y mensajes de error

**File:** `tests/validation/required-fields.spec.ts`

**Steps:**
  1. Asunción: formularios accesibles.
  2. 1) En formularios de cliente y cotizador intentar enviar dejando campos obligatorios vacíos.
  3. 2) Verificar mensajes por campo y foco en primer error.
  4. 3) Corregir y validar envío correcto.

**Expected Results:**
  - Mensajes de error claros y localizados; primer error enfocado.
  - No se permite persistencia hasta corregir errores.

#### 5.2. Manejo de errores de red y reintentos

**File:** `tests/validation/network-retry.spec.ts`

**Steps:**
  1. Asunción: posibilidad de mockear fallo de red o simular 500.
  2. 1) Forzar fallo de red al enviar una operación/cotización.
  3. 2) Verificar mensaje de error y opción de reintento.
  4. 3) Reintentar y validar comportamiento al recuperarse la red.

**Expected Results:**
  - UI informa error de red y ofrece reintento; reintento exitoso completa la acción.

#### 5.3. Sesión expirada y comportamiento

**File:** `tests/validation/session-expiry.spec.ts`

**Steps:**
  1. Asunción: token con expiración corta o posibilidad de invalidarlo.
  2. 1) Iniciar una tarea de larga duración; forzar expiración de sesión.
  3. 2) Intentar acción que requiere autenticación y verificar manejo (redirect/login modal).
  4. 3) Re-autenticar y verificar reintento o restauración de contexto si corresponde.

**Expected Results:**
  - Usuario es redirigido o se solicita login; flujo no deja la aplicación en estado inconsistente.
  - Acción puede reintentarse tras login o el usuario es guiado.

#### 5.4. Mensajes y códigos de error consistentes

**File:** `tests/validation/error-codes.spec.ts`

**Steps:**
  1. Asunción: API devuelve códigos de error estandarizados.
  2. 1) Provocar distintos errores (400, 403, 404, 500) via inputs o mocks.
  3. 2) Verificar que la UI muestra mensajes adecuados y logs cuando corresponde.
  4. 3) Confirmar que el usuario recibe instrucciones de resolución cuando aplicable.

**Expected Results:**
  - Mensajes mapeados por código; no se exponen stack traces al usuario.
  - Soporte/auditoría recibe información suficiente en logs.

### 6. Interfaz, Accesibilidad y Rendimiento

**Seed:** `src/tests/seed.spec.ts`

#### 6.1. Responsividad básica (mobile/desktop)

**File:** `tests/ui/responsive.spec.ts`

**Steps:**
  1. Asunción: la aplicación es responsive.
  2. 1) Verificar layout en anchos 375px, 768px, 1366px.
  3. 2) Comprobar que menús y formularios son utilizables en cada breakpoint.
  4. 3) Validar que elementos cruciales no se superponen.

**Expected Results:**
  - Layouts adaptativos sin pérdida de funcionalidad; menús accesibles en mobile.

#### 6.2. Navegación por teclado y etiquetas ARIA

**File:** `tests/ui/a11y-keyboard.spec.ts`

**Steps:**
  1. Asunción: aplicable soporte a11y.
  2. 1) Navegar por la página usando tab/shift+tab para alcanzar controles críticos.
  3. 2) Activar acciones con Enter/Espacio y verificar foco lógico.
  4. 3) Revisar presencia de etiquetas ARIA en elementos interactivos.

**Expected Results:**
  - Todos los controles alcanzables por teclado; foco visible; ARIA presente para elementos complejos.

#### 6.3. Carga inicial y rendimiento de lista

**File:** `tests/ui/load-performance.spec.ts`

**Steps:**
  1. Asunción: entorno de pruebas tiene datos de ejemplo.
  2. 1) Medir tiempo de carga de la página principal y de la vista Cartola/Tabla.
  3. 2) Navegar entre secciones y medir latencia de respuesta de la tabla al aplicar filtros.
  4. 3) Repetir prueba con cache frío y caliente.

**Expected Results:**
  - Tiempos de carga dentro de umbrales aceptables; degradación documentada.
  - UI no se bloquea y paginación mantiene rendimiento.

#### 6.4. Logs y auditoría visible en UI (si aplica)

**File:** `tests/ui/audit-logs.spec.ts`

**Steps:**
  1. Asunción: existe sección admin/logs con permisos.
  2. 1) Acceder a sección de auditoría como admin.
  3. 2) Buscar acciones realizadas sobre cliente `222311233` y verificar trazabilidad.
  4. 3) Confirmar timestamps y usuario ejecutor.

**Expected Results:**
  - Entradas de auditoría muestran quién hizo qué y cuándo; trazabilidad consistente.
