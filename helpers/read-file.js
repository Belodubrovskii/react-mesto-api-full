const fsPromises = require('fs').promises;

const getJsonFromFile = (path) => {
  return fsPromises.readFile(path)
    .then(data => JSON.parse(data))
    .catch(err => console.log(err))
}

module.exports = {
  getJsonFromFile: getJsonFromFile
}