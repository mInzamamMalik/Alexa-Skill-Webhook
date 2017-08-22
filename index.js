var express = require("express");
var bodyParser = require("body-parser");


var app = express();

app.use(bodyParser.json())


app.use('/alexa-webhook', function (req, res, next) {//alexa webhook

    console.log("_____________________________________________________");
    console.log("request: ", req.body);

    if (req.body.request.type === "LaunchRequest") {

        console.log("onLaunch requestId=" + req.body.request.requestId + ", sessionId=" + req.body.session.sessionId);
        var cardTitle = "Hello, World!"
        var speechOutput = "Hi! I'm hotel booking bot, i can book hotel for you"
        var data = buildResponse(req.body.session.attributes, buildSpeechletResponse(cardTitle, speechOutput, "", true))
        console.log("================================================================================================");
        console.log("Response: ", data);
        res.send(data);

    } else if (req.body.request.type === "IntentRequest") {

        onIntent(req.body.request, req.body.session,
            function callback(sessionAttributes, speechletResponse) {

                res.send(buildResponse(sessionAttributes, speechletResponse));
            });
    } else if (req.body.request.type === "SessionEndedRequest") {
        onSessionEnded(req.body.request, req.body.session);
        res.send();
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

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

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
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}
function handleTestRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Hello, World!", "", "true"));
}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}



app.listen(3000, function () {
    console.log("listening to 3000");
})