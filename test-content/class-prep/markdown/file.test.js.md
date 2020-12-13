# hello

so there's a function:

```js
const reverse = (str) => str.split("").reverse().join("");
```

that reverses strings:

```js
const expect = require("chai").expect;

describe("asdf", () => {
  it("fdsa", () => {
    expect(reverse("asdf")).to.equal("fdsa");
  });
});
```
