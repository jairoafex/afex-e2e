Feature: Validar modulo de recaudacion de giros

  Scenario: 001 Crear giro a Peru deposito usando BCP
    Given Usuario inicia el navegador y valida cargue de AFEX+
    Then Usuario visualiza el formulario de cotizacion
    Then Usuario ingresa el pais <pais>
    Then Usuario selecciona el metodo de pago <metodo>
    Then Usuario ingresa el monto a <tipo_monto>
    Then Usuario ingresa el monto aleatorio en moneda <moneda>
   
    Examples:
      | pais   |  metodo   | tipo_monto | moneda |
      | "Perú" | "Efectivo"| "Recibir"   | "PEN"  |