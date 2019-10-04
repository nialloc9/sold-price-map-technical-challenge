const { NODE_ENV, AWS_ID, AWS_KEY, INGRESS_BUCKET, INGRESS_KEY, EGRESS_BUCKET, EGRESS_KEY } = process.env;

module.exports = {
    env: NODE_ENV,
    aws: {
        id: AWS_ID,
        key: AWS_KEY,
        s3: {
            ingressBucket: INGRESS_BUCKET,
            ingressKey: INGRESS_KEY,
            egressBucket: EGRESS_BUCKET,
            egressKey: EGRESS_KEY,
        }
    }
}