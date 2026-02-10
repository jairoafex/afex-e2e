@ui
@epic_RecaudacionGiros
@feature_CrearGiro
Feature: Validar modulo de recaudacion de giros

 @bcp
 @deposito
  Scenario Outline: 001 Crear giro a Peru deposito usando BCP
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
    When Usuario da click en boton siguiente
    Then Usuario visualiza el formulario para seleccion de beneficiario
    When Usuario da click en la opcion Nuevo Beneficiario
    Then Usuario ingresa el nombre del beneficiario
    Then Usuario ingresa el apellido del beneficiario
    Then Usuario selecciona el tipo de cuenta <tipo_cuenta>
		Then Usuario ingresa el numero cuenta o wallet <wallet>
    When Usuario da click en continuar
    Then Usuario visualiza la pantalla de resumen de giro
    When Usuario da click en crear transferencia
    Then Usuario da click en la opcion de recaudacion en efectivo
    Then Usuario da click en la opcion vender y registrar
    When Usuario da click en la opcion de recaudar
    Then Usuario visualiza modal recaudacion
    When Usuario finaliza sincronizacion del giro ve mensaje exitoso
    Then Usuario visualiza pantalla de detalle del giro del agente <agente>
    
    Examples:
    |  cliente  |  pais  |  metodo   | tipo_monto | moneda |        agente           | transaccion |    tipo_cuenta     |   wallet       |
    |"222311233"| "Perú" | "Depósito"| "Recibir"  | "PEN"  | "Banco De Credito Bcp"  | "Depósito"  | "CUENTA CORRIENTE" | "3213123123232"|



    @interbank  
    @regression
    @Efectivo
    Scenario: 002 Crear giro en efectivo a Peru con promocode usando Interbank
        Given Usuario inicia el navegador y valida cargue de AFEX+
		    When Usuario ingresa el cliente <cliente>
		    Then Usuario visualiza al cliente correctamente
		    Then Usuario ingresa el pais <pais>
		    Then Usuario selecciona el metodo de pago <metodo>
		    Then Usuario ingresa el monto a <tipo_monto>
		    Then Usuario ingresa el monto aleatorio en moneda <moneda>
		    Then Usuario ingresa el codigo de promocode <promocode>
		    Then Usuario indica que cliente no presencial
		    When Usuario da click en Buscar Agentes
		    Then Usuario visualiza el agente <agente> el tipo transaccion <transaction> y selecciona la cotizacion
		    When Usuario da click en boton siguiente
		    Then Usuario visualiza el formulario para seleccion de beneficiario
        When Usuario da click en la opcion Nuevo Beneficiario
        Then Usuario ingresa el nombre del beneficiario
        Then Usuario ingresa el apellido del beneficiario
        Then Usuario ingresa el telefono del beneficiario <phone>
        When Usuario da click en continuar
        Then Usuario visualiza la pantalla de resumen de giro
        When Usuario da click en crear transferencia
        Then Usuario da click en la opcion de recaudacion en efectivo
        Then Usuario da click en la opcion vender y registrar
        When Usuario da click en la opcion de recaudar
        Then Usuario visualiza modal recaudacion
        When Usuario finaliza sincronizacion del giro ve mensaje exitoso
        Then Usuario visualiza pantalla de detalle del giro del agente <agente>
Examples:
  | cliente    |    pais   | metodo 		   |  ciudad |  transaction  |	promocode | tipo_monto |  moneda  |    phone  |     agente        |
  | "166296056"|  "Perú"   | "Efectivo"  | "Cusco" |  "Efectivo"   | "GIROCLUB2"| 	"Enviar" |   "USD"  |"987654321"|   "Interbank"     |
 
  @yape @regression
	 Scenario: 010 Genera un envios a Peru usando Yape Wallet
        Given Usuario inicia el navegador y valida cargue de AFEX+
		    When Usuario ingresa el cliente <cliente>
		    Then Usuario visualiza al cliente correctamente
		    Then Usuario ingresa el pais <pais>
		    Then Usuario selecciona el metodo de pago <metodo>
		    Then Usuario ingresa el monto a <tipo_monto>
		    Then Usuario ingresa el monto aleatorio en moneda <moneda>
		    Then Usuario indica que cliente no presencial
		    When Usuario da click en Buscar Agentes
		    Then Usuario visualiza el agente <agente> el tipo transaccion <transaction> y selecciona la cotizacion
		    When Usuario da click en boton siguiente
		    Then Usuario visualiza el formulario para seleccion de beneficiario
		    When Usuario da click en la opcion Nuevo Beneficiario
		    When Usuario ingresa el nombre del beneficiario <nombre_beneficiario>
		    Then Usuario ingresa el apellido del beneficiario <apellido_beneficiario>
		    Then Usuario ingresa el numero cuenta o wallet <wallet>
		    Then Usuario ingresa el nombre del proposito <proposito>    
		    When Usuario da click en continuar
		    Then Usuario visualiza la pantalla de resumen de giro
		    When Usuario da click en crear transferencia
        Then Usuario da click en la opcion de recaudacion en efectivo
        Then Usuario da click en la opcion vender y registrar
        When Usuario da click en la opcion de recaudar
        Then Usuario visualiza modal recaudacion
        When Usuario finaliza sincronizacion del giro ve mensaje exitoso
        Then Usuario visualiza pantalla de detalle del giro del agente <agente>
		    
Examples:
  | cliente 	  |  pais  |    metodo  | tipo_monto| moneda  | agente | transaction | nombre_beneficiario |  apellido_beneficiario |    wallet     |  proposito |   
  |	"91982196"	| "Perú" | "Depósito" | "Recibir"	|  "PEN"  | "Yape" |   "Wallet"	 |     "Luis"		       | 		"Mejia Desamockbcp" | "51967274003"	| "Regalo"   | 
	