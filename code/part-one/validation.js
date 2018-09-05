'use strict';

const { createHash } = require('crypto');

const { verify } = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that:
 *   - have negative amounts
 *   - were improperly signed
 *   - have been modified since signing
 */
const isValidTransaction = ({ amount, recipient, signature, source }) => {
  return amount > 0 && verify(source, source + recipient + amount, signature);
};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if:
 *   - their hash or any other properties were altered
 *   - they contain any invalid transactions
 */
const isValidBlock = ({ hash, nonce, previousHash, transactions }) => {
  const transactionString = (
    transactions.map(({ signature }) => signature).join('')
  );

  const message = previousHash + transactionString + nonce;

  return (
    transactions.every(
      isValidTransaction
    ) && hash === createHash('sha256').update(message).digest('hex')
  );
};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. It should reject any blockchain that:
 *   - is a missing genesis block
 *   - has any block besides genesis with a null hash
 *   - has any block besides genesis with a previousHash that does not match
 *     the previous hash
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = ({ blocks }) => {
  if (blocks[0].transactions.length !== [] || blocks[0].previousHash !== null) {
    return false;
  }

  if (blocks.slice(1).some(({ previousHash }) => previousHash === null)) {
    return false;
  }

  if (blocks.slice(1).some(block => !isValidBlock(block))) {
    return false;
  }

  return true;
};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  // Your code here

};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
