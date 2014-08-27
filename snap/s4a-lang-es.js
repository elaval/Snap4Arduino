s4aTempDict = {

/*
    Special characters: (see <http://0xcc.net/jsescape/>)

    Ä, ä   \u00c4, \u00e4
    Ö, ö   \u00d6, \u00f6
    Ü, ü   \u00dc, \u00fc
    ß      \u00df
*/
    // primitive blocks:

    /*
        Attention Translators:
        ----------------------
        At this time your translation of block specs will only work
        correctly, if the order of formal parameters and their types
        are unchanged. Placeholders for inputs (formal parameters) are
        indicated by a preceding % prefix and followed by a type
        abbreviation.

        For example:

            'say %s for %n secs'

        can currently not be changed into

            'say %n secs long %s'

        and still work as intended.

        Similarly

            'point towards %dst'

        cannot be changed into

            'point towards %cst'

        without breaking its functionality.
    */

    // arduino:
    'Connect Arduino':
        'Conectar Arduino',

    'Disconnect Arduino':
        'Desconectar Arduino',

    'analog reading %analogPin':
        'lectura analógica %analogPin',

    'digital reading %digitalPin':
        'lectura digital %digitalPin',

    'connect arduino at %port':
        'conectar arduino en puerta %port',

    'setup digital pin %digitalPin as %pinMode':
        'configurar pin %digitalPin como %pinMode',

    'set digital pin %digitalPin to %b':
        'fijar pin digital %digitalPin en %b',

    'set servo %servoPin to %servoValue':
        'fijar servo %servoPin en %servoValue',

    'set PWM pin %pwmPin to %n':
        'fijar pin PWM %pwmPin en %n',

    // makers:
    'led on':
        'prender led',

    'led off':
        'apagar led',

    'buzzer at %buzzerval':
        'bocina en %buzzerval',

    'temperature':
        'temperatura',

    'ligth':
        'luz',

    'sound':
        'sonido',

    'potentiometer':
        'potenciometro',

    'switch':
        'botón',

    'Authorize Twitter Account':
        'Autorizar cuenta Twitter',

    'send Tweet %s':
        'enviar Tweet %s',





};

// Add attributes to original SnapTranslator.dict.es
for (var attrname in s4aTempDict) { SnapTranslator.dict.es[attrname] = s4aTempDict[attrname]; }
