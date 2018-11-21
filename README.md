# Guess The Price
Showcase for Bespoken unit-testing and end-to-end testing tools!
Also, fun game for guessing prices, akin to the Price Is Right!!

## Unit-testing
There is no need to add assertions to your code. With our automated unit-testing you create simple [YAML test scripts](https://read.bespoken.io/unit-testing/guide-google/) and then we run them against your code locally.

```yaml
--- # Configuration YAML document
configuration:
  locale: en-US

--- # The --- indicates the start of a new test, which is a self-contained YAML document
- test: "Works for one player" # Optional info about the test
# This test shows how to access any parameter for a unit test directly
- LaunchRequest:
  - payload.google.richResponse.items[0].simpleResponse.textToSpeech == Welcome to guess the price
# For the simple Response thought just indicating the message right away works since we have an internal alias
- GetOnePlayer: tell us your name
- GetContestantName playername=Juan: Juan * Guess the price
- 100 dollars: Your score for that answer is * Guess the price
- GetANumber number=100: Your score for that answer is * Guess the price
- GetANumber number=100: Game ended
```

## TODO
* Add Continuous Integration
