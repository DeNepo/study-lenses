# About Fuzz

Fuzz testing is when you use random inputs to test your function. Not completely random, the test cases will all have the correct structure but will have random values. so instead of using an array that looks like this:

- `[ "spain", "portugal", "france", "italy" ]`

You would generate random arrays of strings like this one and use them to test your function:

- `[ "8 #@H=+ /", "~asd i-b", ".089}|", "q<D> [=-" ]`

There are a few very good reasons to practice fuzz testing from early on in your learning:

- Randomly generated tests will catch mistakes in your logic that hand-written ones will miss
- Interpreting the test results will encourage you to think more abstractly since the test cases don't mean anything
- You can test your functions against hundreds of more test cases than you ever could with manually written tests
- It's not just for industry! Fuzz testing can be helpful while you're learning by pointing out mistakes you wouldn't think of testing

To study these exercises you'll need to have your console open, all test results will be logged there.

Enjoy!
