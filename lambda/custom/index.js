/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const LaunchRequest = {
  canHandle(handlerInput) {
    const {request} = handlerInput.requestEnvelope;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    const speechOutput = 'Bienvenido a tu calculadora. Puedes pedirme sumar, restar, multiplicar o dividir dos números. Dime que operación quieres hacer';
    const reprompt = 'Puedes pedirme sumar, restar, multiplicar o dividir dos números. Dime que operación quieres hacer';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const {request} = handlerInput.requestEnvelope;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {

    const speechOutput = 'Hasta pronto!';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const HelpIntent = {
  canHandle(handlerInput) {
    const {request} = handlerInput.requestEnvelope;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {

    const speechOutput = 'Puedes pedirme sumar, restar, multiplicar o dividir dos números. Dime que operación quieres hacer';
    const reprompt = 'Puedes pedirme sumar, restar, multiplicar o dividir dos números. Dime que operación quieres hacer';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const OperacionIntent =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'OperacionIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'El resultado es ';
        let bye = '. Hasta pronto!';

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots); 
        
        let numero_1;
        let numero_2;
  
        //   SLOT: numerouno 
        if (slotValues.numerouno.heardAs && slotValues.numerouno.heardAs !== '') {
            numero_1 = parseInt(slotValues.numerouno.heardAs);
        } else {
            return responseBuilder
            .speak('No te he entendido. Por favor repite la operación')
            .reprompt('No te he entendido. Por favor repite la operación')
            .getResponse();
        }
        
        //   SLOT: numerodos 
        if (slotValues.numerodos.heardAs && slotValues.numerodos.heardAs !== '') {
            numero_2 = parseInt(slotValues.numerodos.heardAs);
        } else {
            return responseBuilder
            .speak('No te he entendido. Por favor repite la operación')
            .reprompt('No te he entendido. Por favor repite la operación')
            .getResponse();
        }
        
        //   SLOT: operacion 
        if (slotValues.operacion.heardAs && slotValues.operacion.heardAs !== '' && 
            slotValues.operacion.ERstatus === 'ER_SUCCESS_MATCH' && 
            slotValues.operacion.resolved) {
            let operacion = slotValues.operacion.resolved;
            if(operacion === 'adicion') {
              return responseBuilder
                .speak(say + (numero_1 + numero_2) + bye)
                .getResponse();
            }
            if(operacion === 'substraccion') {
              return responseBuilder
                .speak(say + (numero_1 - numero_2) + bye)
                .getResponse();
            }
            if(operacion === 'multiplicacion') {
              return responseBuilder
                .speak(say + (numero_1 * numero_2) + bye)
                .getResponse();
            }
            if(operacion === 'division') {
              return responseBuilder
                .speak(say + (numero_1 / numero_2) + bye)
                .getResponse();
            }

        } else {
          return responseBuilder
            .speak('No te he entendido. Por favor repite la operación')
            .reprompt('No te he entendido. Por favor repite la operación')
            .getResponse();
        }
    }
};

const UnhandledIntent = {
  canHandle(handlerInput) {
    return true;
  },
  handle(handlerInput) {
    console.log(JSON.stringify(handlerInput.requestEnvelope));
    return handlerInput.responseBuilder
      .speak('Error')
      .reprompt('Error')
      .getResponse();
  }
}

function randomElement(myArray) { 
    return(myArray[Math.floor(Math.random() * myArray.length)]); 
} 

function getSlotValues(filledSlots) { 
    const slotValues = {}; 
 
    Object.keys(filledSlots).forEach((item) => { 
        const name  = filledSlots[item].name; 
 
        if (filledSlots[item] && 
            filledSlots[item].resolutions && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0] && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) { 
            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) { 
                case 'ER_SUCCESS_MATCH': 
                    slotValues[name] = { 
                        heardAs: filledSlots[item].value, 
                        resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name, 
                        ERstatus: 'ER_SUCCESS_MATCH' 
                    }; 
                    break; 
                case 'ER_SUCCESS_NO_MATCH': 
                    slotValues[name] = { 
                        heardAs: filledSlots[item].value, 
                        resolved: '', 
                        ERstatus: 'ER_SUCCESS_NO_MATCH' 
                    }; 
                    break; 
                default: 
                    break; 
            } 
        } else { 
            slotValues[name] = { 
                heardAs: filledSlots[item].value || '', // may be null 
                resolved: '', 
                ERstatus: '' 
            }; 
        } 
    }, this); 
 
    return slotValues; 
}

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    ExitHandler,
    SessionEndedRequestHandler,
    HelpIntent,
    OperacionIntent,
    UnhandledIntent
  )
  .lambda();