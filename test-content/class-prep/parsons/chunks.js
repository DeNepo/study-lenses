/*
  group chunks of code into a single block in the UI
  like in Figure 7:
    https://dl.acm.org/doi/pdf/10.1145/3411764.3445571?casa_token=vxbeDodQXsgAAAAA:CqXsuKdNNsCZfIxjccvKlgYuwyIYSthOCiSxP4xj08M4Y5QIh_ob_9ifSZnQ9gn66u7mMPW8qPQVAQ
*/

// begin chunk
{
  let animal = "dog";
  console.log(animal); // 'dog'
}
// end chunk

// begin chunk
let animal = "cat";
console.log(animal); // "cat"
// end chunk

// --- distractors ---

// begin distractor
{
  let animal = "dog";
  console.log(animal); // 'cat'
}
// end distractor

// begin distractor
let animal = "cat";
console.log(animal); // "dog"
// end distractor
