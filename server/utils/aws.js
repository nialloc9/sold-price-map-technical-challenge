const aws = require('aws-sdk');
const fs = require('fs');

const config = require('./config');

const s3 = new aws.S3({ accessKeyId: config.aws.id, secretAccessKey: config.aws.key });

/**
 * @description loads the ingress data from s3
 */
module.exports.loadFromS3 = async (Bucket, Key) => new Promise((resolve, reject) => {
    s3.getObject({ Bucket, Key },  
        (err, data) => err ? reject(err) : resolve(data.Body))
})

/**
 * @description uploads a file to S3
 */
module.exports.uploadToS3 = async (name) => new Promise((resolve, reject) => {
    fs.readFile(name, (err, data) => {

        if (err) {
            reject(err)
        };

        const params = {
            Bucket: config.aws.s3.egressBucket,
            Key: config.aws.s3.egressKey,
            Body: data,
            ACL: 'public-read'
        };

        s3.upload(params, (s3Error, data) => {
            s3Error ? reject(s3Error) : resolve(data);
        });
     });
})