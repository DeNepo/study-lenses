import { questions } from "./questions/index.js";
import { config } from "./config.js";
import { shuffle } from "./lib/shuffle.js";

export const randomQuestion = ({ nodes, program }) => {
  console.log(config.level);
  const configuredQuestions = [];
  for (const key in questions) {
    if (config[key].ask === true) {
      configuredQuestions.push(...questions[key]);
    }
  }
  // console.log(configuredQuestions);

  const leveledQuestions = [];
  for (const question of configuredQuestions) {
    if (!("level" in question) || question.level <= config.level) {
      leveledQuestions.push(question);
    }
  }
  // console.log(leveledQuestions);

  // shuffle the questions - https://stackoverflow.com/a/46545530
  //  instead of choosing randomly to avoid repetition
  //  can now iterate through predictable
  const shuffledQuestions = shuffle(leveledQuestions);
  // console.log(shuffledQuestions);
  console.log(shuffledQuestions);

  const presentNodeTypes = Object.keys(nodes);
  // console.log(presentNodeTypes);

  const questionObj = shuffledQuestions.find((next) => {
    // supports one node type, make sure that node exists in the program
    if (typeof next.type === "string") {
      return presentNodeTypes.includes(next.type);
    }
    // supports a variety of note types
    if (Array.isArray(next.type)) {
      return presentNodeTypes.some((type) => next.type.includes(type));
    }
    // has it's own decision criteria
    if (typeof next.type === "function") {
      return next.type({ nodes, program });
    }
    // not specified? accept the node
    return true;
  });

  if (!questionObj) {
    return {
      question: "-- no questions match your code and configurations --",
    };
  }

  console.log(questionObj);

  const validity =
    typeof questionObj.type === "function"
      ? questionObj.type({ nodes, program })
      : questionObj.type;

  let validNodes = [];
  if (typeof validity === "string" && validity in nodes) {
    // only one valid node type, so pull that
    validNodes = nodes[validity];
  } else if (Array.isArray(validity)) {
    // merge all valid node types
    validNodes = validity
      .filter((type) => type in nodes)
      .flatMap((type) => nodes[type]);
  }

  const node = validNodes[(validNodes.length * Math.random()) | 0] || null;

  const question = questionObj.template({ node, nodes, program });

  return {
    question,
  };
};
