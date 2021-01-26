{
  const b = (x) => (x === 0 ? x : b(x - 1) + x);
  console.log(b); // possible to log the uninstrumented function?
  // possibly by finding the original source location and logging that instead?
  //   this might be a console overwrite
}

{
  // if a function returns from inside a block, the leave trap is not called
  //  could be handled if rendering is not inline but done by observing/proxying a scope stack
}

{
  // how to handle hoisting?
}

{
  // for non-supported features, just log that it isn't supported and don't trace?
}

{
  // does the Dynamic Scoping heisenbug seem relevant to course level material?
}

{
  // syntax errors in code
}
