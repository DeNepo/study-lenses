v: {
  null;
  break v;
}

if (false);

if (false) null;

if (false) {
  null;
}

if (false) {
  null;
} else {
  null;
}

if (false) {
  null;
} else if (false) {
  null;
} else {
  null;
}

switch (true) {
  case false:
    null;
    break;
  case true:
    null;
    break;
  default:
    null;
    break;
}

while (false);

while (false) null;

while (false) break;

while (false) continue;

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
for (let i = 4; i < 5; i++) break;
for (let i = 4; i < 5; i++) continue;

for (let i = 4; i < 5; i++) {
  null;
  break;
  continue;
}

for (const e of []);

for (const e of []) null;
for (const e of []) break;
for (const e of []) continue;

for (const e of []) {
  null;
  break;
  continue;
}

for (const e in {});

for (const e in {}) null;
for (const e in {}) break;
for (const e in {}) continue;

for (const e in {}) {
  null;
  break;
  continue;
}

(async () => {
  for await (let num of asyncGenerator());
})();

(async () => {
  for await (let num of asyncGenerator()) null;
})();

(async () => {
  for await (let num of asyncGenerator()) break;
})();

(async () => {
  for await (let num of asyncGenerator()) continue;
})();

(async () => {
  for await (let num of asyncGenerator()) {
    null;
    break;
    continue;
    await null;
  }
})();

const v = () => null;

const w = () => {
  null;
  return;
};

const x = function () {
  null;
  return;
};

const y = function y() {
  null;
  return;
};

function z() {
  null;
  return;
}

const vAs = async () => null;
const vAsAw = async () => await null;

const wAs = async () => {
  null;
  await null;
  return;
};

const xAs = async function () {
  null;
  await null;
  return;
};

const yAs = async function y() {
  null;
  await null;
  return;
};

async function zAs() {
  null;
  await null;
  return;
}

async function* asyncGenerator() {
  null;
  await null;
  yield null;
  return;
}

const e = {
  a() {
    null;
    return;
  },
  async b() {
    null;
    await null;
    return;
  },
  get b() {
    null;
    return;
  },
  set b(x) {
    null;
    return;
  },
};

class D {
  constructor() {
    null;
    return;
  }
}

throw null;

try {
  null;
} catch (err) {
  null;
}

try {
  null;
} finally {
  null;
}

try {
  null;
} catch (err) {
  null;
} finally {
  null;
}

// each time a variable is assigned, not priority
//  how to deal with assignments in control flow or default parameters or spread objects?

const a = "";

a;

let b = 1;

b;

b = 2;
