Feature: Validar modulo de recaudacion de giros

  Scenario: 001 Crear giro a Peru deposito usando BCP
    Given Usuario inicia el navegador y valida cargue de AFEX+
    When Usuario ingresa el cliente <cliente>
    Then Usuario visualiza al cliente correctamente
    Then Usuario ingresa el pais <pais>
    Then Usuario selecciona el metodo de pago <metodo>
    Then Usuario ingresa el monto a <tipo_monto>
    Then Usuario ingresa el monto aleatorio en moneda <moneda>
    Then Usuario indica que cliente no presencial
    When Usuario da click en Buscar Agentes
    Then Usuario visualiza el agente <agente> el tipo transaccion <transaccion> y selecciona la cotizacion
   
    Examples:
    |  cliente  |  pais  |  metodo   | tipo_monto | moneda |        agente           | transaccion |
    |"222311233"| "Perú" | "Depósito"| "Recibir"  | "PEN"  | "Banco De Credito Bcp"  | "Depósito"  |