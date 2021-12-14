// @ts-check
// import { SyncWalker } from './sync.js';
// import { AsyncWalker } from './async.js';

const SyncWalker = require('./sync');
const AsyncWalker = require('./async');

/** @typedef { import('estree').BaseNode} BaseNode */
/** @typedef { import('./sync.js').SyncHandler} SyncHandler */
/** @typedef { import('./async.js').AsyncHandler} AsyncHandler */

/**
 *
 * @param {BaseNode} ast
 * @param {{
 *   enter?: SyncHandler
 *   leave?: SyncHandler
 * }} walker
 * @returns {BaseNode}
 */
module.exports.walk = function walk(ast, { enter, leave }) {
  const instance = new SyncWalker(enter, leave);
  return instance.visit(ast, null);
};

/**
 *
 * @param {BaseNode} ast
 * @param {{
 *   enter?: AsyncHandler
 *   leave?: AsyncHandler
 * }} walker
 * @returns {Promise<BaseNode>}
 */
module.exports.asyncWalk = async function asyncWalk(ast, { enter, leave }) {
  const instance = new AsyncWalker(enter, leave);
  return await instance.visit(ast, null);
};
