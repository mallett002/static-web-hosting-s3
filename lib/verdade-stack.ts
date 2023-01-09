import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Route53Construct } from '../lib/constructs/route-53-construct';
import { S3Construct } from '../lib/constructs/s3-construct';
import { CloudFrontConstruct } from '../lib/constructs/cloudfront-construct';

export class VerdadeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
      const route53 = new Route53Construct(this, 'Route53Construct');
      const s3Constructs = new S3Construct(this, 'S3Construct');

      const cloudFrontDistributions = new CloudFrontConstruct(this, 'CloudFrontConstruct', {
        assetBucket: s3Constructs.assetBucket,
        certificate: route53.certificate
      });

// TODO: Route traffic for domain to cloud front distribution
// - Create 2 records for hosted zone
// - www one and non-www one
// - Record names www.williamalanmallett.link and williamalanmallett.link
// - Route traffic to cloud front distribution
// - Alias to cloud front domains ex: d1g7g1ejth3vcr.cloudfront.net
//     - Make sure www one goes to correct distribution and non-www to non-www distribution
  }
}
