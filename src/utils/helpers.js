const _ = require("lodash");

const standardizeInput = (inputs = []) => {
  let returnArray = [];
  inputs.forEach((input) => {
    if (typeof input === "string") {
      returnArray.push(input);
    } else if (Array.isArray(input)) {
      returnArray = [...returnArray, ...input];
    }
  });
  return _.uniq(_.compact(returnArray));
};

const retrieveMentionedEmails = (text) => {
  const pattern = /\B@\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/gi;
  const emails = (text.match(pattern) || []).map((m) => m.replace(/^@/, ""));
  return _.uniq(emails);
};

module.exports = {
  standardizeInput,
  retrieveMentionedEmails,
};
