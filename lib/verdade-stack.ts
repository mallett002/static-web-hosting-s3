import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

import { Route53Construct } from '../lib/constructs/route-53-construct';
import { S3Construct } from '../lib/constructs/s3-construct';
import { CloudFrontConstruct } from '../lib/constructs/cloudfront-construct';

export class VerdadeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
      const route53Construct = new Route53Construct(this, 'Route53Construct');
      const s3Constructs = new S3Construct(this, 'S3Construct');
      const cloudFrontDistributions = new CloudFrontConstruct(this, 'CloudFrontConstruct', {
        assetBucket: s3Constructs.assetBucket,
        certificate: route53Construct.certificate
      });

      new route53.ARecord(this, 'SubdomainAliasRecord', {
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cloudFrontDistributions.subdomainDistribution)),
        zone: route53Construct.hostedZone,
        recordName: 'www',
      });

  }
}
