while (false);

while (false) null;

while (false) {
  null;
  break;
  continue;
}

do {
  null;
  break;
  continue;
} while (false);

for (let i = 4; i < 5; i++);

for (let i = 4; i < 5; i++) null;

for (let i = 4; i < 5; i++) {
  null;
  break;
  continue;
}

for (const e of []);

for (const e of []) null;

for (const e of []) {
  null;
  break;
  continue;
}

for (const e in {});

for (const e in {}) null;

for (const e in {}) {
  null;
  break;
  continue;
}

(async function () {
  for await (let num of (async function* asyncGenerator() {})()) {
    break;
    continue;
    await null;
  }
})();
