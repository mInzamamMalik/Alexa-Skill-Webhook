var express = require("express");
var bodyParser = require("body-parser");


var app = express();

app.use(bodyParser.json())

const skillId = "amzn1.ask.skill.063173ce-f192-4a0d-a3e0-8ba3c9e0d1e2"
function buildResponse(sessionAttributes, speechText, cardObj, repromptObj) {
    var response = {
        "version": "1.0",
        "sessionAttributes": sessionAttributes || {},
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": speechText || "default speech out"
            },
            "card": cardObj || {
                "type": "Simple",
                "title": "Simple title",
                "content": speechText
            },
            "reprompt": repromptObj || {},
            "shouldEndSession": false
        }
    }
    return response;
}
app.use('/alexa-webhook', function (req, res, next) {//alexa webhook

    console.log("request: ", req.body);

    if (req.body.request.type === "LaunchRequest") {
        console.log("Launch request___________________________________________________________________________________________");
        var speechOutput = "Hi I am hotel booking bot, i can book hotel for you"
        var data = buildResponse(req.body.session.attributes, speechOutput)

        console.log("Launch response================================================================================================");
        console.log("Response: ", data);
        res.send(data);

    } else if (req.body.request.type === "IntentRequest") {
        console.log("intent request_____________________________________________________");
        console.log("intent name: ", req.body.request.intent.name);

        switch (req.body.request.intent.name) {
            case 'booking':

                console.log("booking slots ", req.body.request.intent.slots);

                var slotsArr = Object.keys(req.body.request.intent.slots);

                for (let i = 0; i < slotsArr.length; i++) {

                    let item = slotsArr[i];
                    console.log("slot item: ", item);
                    if (!item.value) {

                        var reprompt = {
                            "outputSpeech": {
                                "type": "PlainText",
                                "text": "this is re prompt text"
                            }
                        }
                    }
                }



                var card = {
                    "type": "Standard",
                    "title": "card title",
                    "content": "this is content of card",
                    "text": "this is some text of card",
                    "image": {
                        "smallImageUrl": "https://assets-cdn.github.com/images/modules/open_graph/github-mark.png",
                        "largeImageUrl": "https://bgcdn.s3.amazonaws.com/wp-content/uploads/2013/04/5-2-God-is-in-Nature.jpg"
                    }
                }

                var resData = buildResponse(req.body.session.attributes, "this is speech out", card)
                console.log("intent Response ====> ", resData);
                res.send(resData);
                break;

            default:
                console.log("Unknown intent", req.body.intent.name);
        }
    } else if (req.body.request.type === "SessionEndedRequest") {
        var resData = buildResponse(req.body.session.attributes, "End request called")
        res.send(resData);
    }
    // res.send(buildSpeechletResponse("Hello"));
    // res.send(buildSpeechletResponse("Hi, I'm hotel booking bot, I can book hotel for you in any city of the world"));

    // function buildSpeechletResponse(speech, title, repromptText, shouldEndSession) {
    //     return {
    //         version: "1.0",
    //         sessionAttributes: "dklsjdflskd",
    //         response: {
    //             outputSpeech: {
    //                 type: "PlainText",
    //                 text: speech
    //             }
    //         }

    //     };
    // }
});


/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent, intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'TestIntent') {
        handleTestRequest(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
// function onSessionEnded(sessionEndedRequest, session) {
//     console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
//         + ", sessionId=" + session.sessionId);

//     // Add any cleanup logic here
// }
// function handleTestRequest(intent, session, callback) {
//     callback(session.attributes,
//         buildSpeechletResponseWithoutCard("Hello, World!", "", "true"));
// }

// ------- Helper functions to build responses -------

// function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
//     return {
//         outputSpeech: {
//             type: "PlainText",
//             text: output
//         },
//         card: {
//             type: "Simple",
//             title: title,
//             content: output
//         },
//         reprompt: {
//             outputSpeech: {
//                 type: "PlainText",
//                 text: repromptText
//             }
//         },
//         shouldEndSession: shouldEndSession
//     };
// }

// function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
//     return {
//         outputSpeech: {
//             type: "PlainText",
//             text: output
//         },
//         reprompt: {
//             outputSpeech: {
//                 type: "PlainText",
//                 text: repromptText
//             }
//         },
//         shouldEndSession: shouldEndSession
//     };
// }

// function buildResponse(sessionAttributes, speechletResponse) {
//     return {
//         version: "1.0",
//         sessionAttributes: sessionAttributes,
//         response: speechletResponse
//     };
// }



app.listen(3000, function () {
    console.log("listening to 3000");
})