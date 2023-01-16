import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3';

import { DOMAIN, SUB_DOMAIN } from '../../constants';

export interface CloudFrontProps {
    assetBucket: s3.IBucket
    redirectBucket: s3.IBucket
    certificate: cdk.aws_certificatemanager.Certificate
}

export class CloudFrontConstruct extends Construct {
    public readonly subdomainDistribution: cdk.aws_cloudfront.Distribution;
    public readonly OIA: cdk.aws_cloudfront.OriginAccessIdentity;
    public readonly rootDomainDistribution: cdk.aws_cloudfront.Distribution;

    constructor(scope: Construct, id: string, props: CloudFrontProps) {
        super(scope, id);

        this.OIA = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentitySubDomainBucket');
        props.assetBucket.grantRead(this.OIA);

        this.subdomainDistribution = new cloudfront.Distribution(this, 'subDomainDist', {
            defaultBehavior: { 
                origin: new origins.S3Origin(props.assetBucket, {originAccessIdentity: this.OIA}),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            domainNames: [SUB_DOMAIN],
            certificate: props.certificate,
            defaultRootObject: 'index.html',
          });


        this.rootDomainDistribution = new cloudfront.Distribution(this, 'rootDomainDist', {
            defaultBehavior: { 
                origin: new origins.S3Origin(props.redirectBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED
            },
            domainNames: [DOMAIN],
            certificate: props.certificate
          });
    }
}
