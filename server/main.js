const LineByLineReader = require('line-by-line');
const fs = require('fs');
const { convertToApplicationDataStructure, sortByPrice, assignMeta, pipeline } = require("./utils/transformers");
const { loadFromS3, uploadToS3 } = require("./utils/aws")
const config = require("./utils/config")

/**
 * @description extract data from s3
 */
const extract = () => new Promise(async (resolve, reject) => {
  const data = await loadFromS3(config.aws.s3.ingressBucket, config.aws.s3.ingressKey);

  fs.writeFile("/tmp/data.txt", data, (err) => {

      if(err) {
          return reject(err)
      }

      resolve()
  }); 
})

/**
 * @description transform data into application data structure
 */
const transform = () => new Promise((resolve, reject) => {
  const lineReader = new LineByLineReader('/tmp/data.txt');
    const data = [];

    lineReader.on('error', () => {
        return reject("An error occurred reading the file")
    });
    
    lineReader.on('line', (line) => {
        data.push(convertToApplicationDataStructure(line));
    });
    
    lineReader.on('end', function () {
    
      const response = pipeline(data, [sortByPrice, assignMeta]);

      return resolve(response)

    });
})

/**
 * @description load new json file into s3 to be read by client
 */
const load = async data => {

  fs.writeFileSync(`/tmp/${config.aws.s3.egressKey}`, JSON.stringify(data, null, 2) , 'utf-8');

  await uploadToS3(`/tmp/${config.aws.s3.egressKey}`)
}

module.exports.extractLoadUpload = async () => {

  await extract();
  
  const newData = await transform();
  
  await load(newData);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Success'
      },
      null,
      2
    ),
  };
};

module.exports.fetchData = async () => {

  const data = await loadFromS3(config.aws.s3.egressBucket, config.aws.s3.egressKey);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Success',
        data
      },
      null,
      2
    ),
  };
};