/**
 * utility method for trimming input data in request body
 *
 * @param {object} obj
 * @returns object with trimmed values
 */
const trimmer = (obj) => {
  const keys = Object.keys(obj);
  const trimmedValues = {};
  keys.forEach((key) => {
    if (typeof obj[key] === 'string') {
      trimmedValues[key] = obj[key].trim();
    }
  });
  return trimmedValues;
};

export default trimmer;
