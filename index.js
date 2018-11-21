// Import the appropriate service and chosen wrappers
const {
  dialogflow,
  Image,
} = require('actions-on-google');
const express = require('express');
const bodyParser = require('body-parser');
const product = require("./lib/products");
const game = require("./lib/game");


// Create an app instance
const app = dialogflow();

const AppContexts = {
  START_MODE: '_start_mode', // Prompt the user to start or restart the game.
  SETUP_USERS: '_setup_users', // User is trying to guess the number.
  GAME_ROUND: '_game_round',
  TELL_SCORE: '_tell_score',
}


// Register handlers for Dialogflow intents

app.intent('Default Welcome Intent', conv => {
  conv.contexts.set(AppContexts.START_MODE, 1);

  conv.data.state = AppContexts.START_MODE;
  conv.ask('Welcome to guess the price, how many persons are playing today?');
});

const askFirstPlayerName = (conv, playerQuantity) => {
    conv.data.currentPlayerSetup = 0;
    conv.contexts.set(AppContexts.SETUP_USERS, 1);
    conv.data.playerQuantity = playerQuantity;
    conv.data.players = [];

    const askPlayerName = playerQuantity == 1
        ? "Great, please tell us your name"
        : "Great, contestant one please tell us, what is your name?";

    conv.ask(askPlayerName);
};

const evaluateContext = (conv, contextToSearch) => {
    const context = conv.contexts.get(contextToSearch);
    return context;
}

const reprompt = (conv) => {
  // If we reprompt we have to keep alive the current context again
  if (evaluateContext(conv, AppContexts.START_MODE)) {
    conv.contexts.set(AppContexts.START_MODE);
    conv.ask(`We didn't get how many players`);
  } else if (evaluateContext(conv, AppContexts.SETUP_USERS)) {
    conv.contexts.set(AppContexts.SETUP_USERS);
    conv.ask(`Please repeat your name`);
  } else if (evaluateContext(conv, AppContexts.GAME_ROUND)) {
    conv.contexts.set(AppContexts.GAME_ROUND);
    conv.ask(`Please repeat your answer`);
  } else {
    // Should never enter here, including it to have a default if states fail
    conv.close('We are sorry, please try to start the game again');
  }
}

app.intent('GetOnePlayer', conv => {
  if (evaluateContext(conv, AppContexts.START_MODE)) {
    askFirstPlayerName(conv, 1);
    return;
  }
  reprompt(conv);
});

app.intent('GetANumber', (conv, {number})  => {
  if (evaluateContext(conv, AppContexts.START_MODE)) {
    askFirstPlayerName(conv, number);
    return;
  } else if (evaluateContext(conv, AppContexts.GAME_ROUND)) {
    evaluateUserResponse(conv, number);
    return;
  }
  reprompt(conv);
});

app.intent('GetContestantPrice', (conv, {number})  => {
  if (evaluateContext(conv, AppContexts.GAME_ROUND)) {
    evaluateUserResponse(conv, number);
    return;
  }
  reprompt(conv);
});

app.intent('GetPlayerNumber', (conv, {number})  => {
  if (evaluateContext(conv, AppContexts.START_MODE)) {
    askFirstPlayerName(conv, number);
    return;
  }
  reprompt(conv);
});


app.intent('Default Fallback Intent', conv => {
  reprompt(conv);
});

app.intent('GetContestantName', (conv, {playername}) => {
  if (!evaluateContext(conv, AppContexts.SETUP_USERS)) {
    reprompt(conv);
    return;
  }

  const currentPlayer = conv.data.currentPlayerSetup;

  let finishedRegistration = false;
  if (currentPlayer + 1 >=  conv.data.playerQuantity) {
    conv.contexts.set(AppContexts.GAME_ROUND, 1);
    finishedRegistration = true;
  }

  conv.data.players[currentPlayer] = {
      name: playername,
  };

  if (finishedRegistration) {
      const firstPlayer = conv.data.players[0];
      const productChoice = product.getProduct();
      let productEmision = "Okay, let's start the game: " + firstPlayer.name;
      productEmision += " your product is " + productChoice.name + ", " + productChoice.description;
      productEmision += ". Guess the price!";
      const imageObj = {
          url: productChoice.image,
          alt: productChoice.name
      };

      conv.data.currentPlayerGame = 0;

      conv.data.currentProduct = productChoice;
      conv.data.currentRound = 0;

      conv.ask(productEmision);
      conv.ask(new Image(imageObj));
  } else {
      // We keep the context alive
      conv.contexts.set(AppContexts.SETUP_USERS, 1);
      conv.data.currentPlayerSetup = currentPlayer + 1;

      const askPlayerName = "Contestant " +  (currentPlayer + 2) + " please tell us, what is your name?";
      conv.ask(askPlayerName);
  }
});

const evaluateUserResponse = function (conv, contestantPrice) {
    const lastProduct = conv.data.currentProduct;
    const currentPlayerIndex = conv.data.currentPlayerGame;
    const currentPlayer = conv.data.players[currentPlayerIndex];
    const playerQuantity = conv.data.playerQuantity;
    const yourPriceIsSpeech = (playerQuantity > 1 ? currentPlayer.name + ", you" : " You") +
        " said " + contestantPrice +  " , the actual price was " + lastProduct.price + " dollars. ";
    const score = game.getScore(contestantPrice, lastProduct.price);
    const currentRound = conv.data.currentRound;

    if (currentRound > 0) {
        conv.data.players[currentPlayerIndex]["score"].push(score);
    } else {
        conv.data.players[currentPlayerIndex]["score"] = [score];
    }

    const productChoice = product.getProduct();

    const endOfRound = currentPlayerIndex + 1 >= playerQuantity;
    let nextQuestion;
    if (endOfRound) {
        conv.data.currentRound = currentRound + 1;

        if (currentRound + 1 >= 3) {
            conv.contexts.set(AppContexts.TELL_SCORE, 1);
            if (conv.data.playerQuantity == 1) {
                const finalPlayerScoreList = conv.data.players[0]["score"];
                const finalScore = finalPlayerScoreList.reduce((acc, val) => acc + val);
                conv.close("Game ended, your final score was: " + finalScore);
            } else {
                const players = conv.data.players;
                const winner = players.reduce((result, player) => {
                    const playerScore = player.score.reduce((acc, val) => acc + val);
                    if (!result.finalScore || result.finalScore < playerScore) {
                        result = Object.assign({}, player);
                        result.finalScore = playerScore;
                    }
                    return result;
                }, {});
                const finalResults =
                    "Game ended, the winner is " + winner.name + " with " + winner.finalScore + " points. Congratulations!";
                conv.close(finalResults);
            }
            return;
        }
    }

    conv.contexts.set(AppContexts.GAME_ROUND, 1);

    if (conv.data.playerQuantity == 1) {
        nextQuestion = "Your next product is ";
    } else {
        const nextPlayerIndex = !endOfRound ?  currentPlayerIndex + 1 : 0;
        const nextPlayer = conv.data.players[nextPlayerIndex];
        conv.data.currentPlayerGame = nextPlayerIndex;
        nextQuestion = "Now is " + nextPlayer.name + " turn. Your next product is ";
    }

    conv.data.currentProduct = productChoice;

    nextQuestion += productChoice.name + ", " + productChoice.description;
    nextQuestion += ". Guess the price!";

    const imageObj = {
        image: productChoice.image,
        alt: productChoice.name
    };

    const speechOutput = yourPriceIsSpeech + "Your score for that answer is " + score + " points. " + nextQuestion;

    conv.ask(speechOutput);
    conv.ask(new Image(imageObj));
};

const server = express().use(bodyParser.json(), app).listen(3000);

module.exports = server;
