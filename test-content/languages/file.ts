function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
    //          ^ = (parameter) obj: string
  } else {
    return obj;
  }
}
