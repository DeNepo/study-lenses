import { questions } from './questions.js';
import { shuffle } from '../lib/shuffle.js';

export const randomQuestion = (config, { nodes, program, code, type }) => {
  // console.log(nodes);

  // all questions matching the language feature configurations
  const configuredQuestions = questions.filter((question) => {
    if (!('features' in question)) {
      return true;
    }
    if (Array.isArray(question.features)) {
      return question.features.some((feature) => config[feature].ask === true);
    }
    return false;
  });

  // all questions matching the configured question levels
  const leveledQuestions = configuredQuestions.filter((question) => {
    if (!('levels' in question)) {
      return true;
    }
    if (Array.isArray(question.levels)) {
      return question.levels.some((level) => config.levels.includes(level));
    }
    return false;
  });

  // shuffle the questions - https://stackoverflow.com/a/46545530
  const shuffledQuestions = shuffle(leveledQuestions);

  // get all the node types present in this program
  const presentNodeTypes = Object.keys(nodes);

  let filtered = null;
  // now that possible questions are shuffled
  //  can just use the first one that addresses present node types
  const questionObj = shuffledQuestions.find((question) => {
    if (!('nodeTypes' in question)) {
      return true;
    }
    if (Array.isArray(question.nodeTypes)) {
      // supports a variety of note types
      return presentNodeTypes.some((type) => question.nodeTypes.includes(type));
    }
    // has it's own decision criteria
    if (typeof question.nodeTypes === 'function') {
      try {
        const returned = question.nodeTypes({ nodes, program, code, type });
        if (Array.isArray(returned) && returned.length !== 0) {
          filtered = returned;
        }
        return returned;
      } catch (err) {
        return false;
      }
    }

    return false;
  });
  // console.log(questionObj);

  if (!questionObj) {
    return {
      question: '-- no questions match your code and configurations --',
    };
  }

  const validity =
    typeof questionObj.nodeTypes === 'function'
      ? questionObj.nodeTypes({ nodes, program, code, type })
      : questionObj.nodeTypes;

  let validNodes = [];
  if (typeof validity === 'string' && validity in nodes) {
    // only one valid node type, so pull that
    validNodes = nodes[validity];
  } else if (Array.isArray(validity)) {
    // merge all valid node types
    validNodes = validity
      .filter((type) => type in nodes)
      .flatMap((type) => nodes[type]);
  }

  // randomly select one node of the correct type
  const node = validNodes[(validNodes.length * Math.random()) | 0] || null;

  const question = questionObj.template({
    node,
    nodes,
    program,
    code,
    type,
    filtered,
  });

  return typeof question === 'string'
    ? {
        question,
      }
    : question;
};
