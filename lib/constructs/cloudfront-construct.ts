import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface CloudFrontProps {
    assetBucket: s3.IBucket
    certificate: cdk.aws_certificatemanager.Certificate
}

export class CloudFrontConstruct extends Construct {
    public readonly subdomainDistribution: cdk.aws_cloudfront.Distribution;
    public readonly originAccessIdentity: cdk.aws_cloudfront.OriginAccessIdentity;

    constructor(scope: Construct, id: string, props: CloudFrontProps) {
        super(scope, id);

        this.originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');
        
        props.assetBucket.grantRead(this.originAccessIdentity);

        this.subdomainDistribution = new cloudfront.Distribution(this, 'SubdomainDistribution', {
            defaultRootObject: 'index.html',
            enabled: true,
            certificate: props.certificate,
            domainNames: ['www.williamalanmallett.link'],
            defaultBehavior: {
                origin: new origins.S3Origin(props.assetBucket, {originAccessIdentity: this.originAccessIdentity}),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            }
        });

        // use OAC over OAI: https://lightrun.com/answers/aws-aws-cdk-cloudfront-support-origin-access-control
    }
}
