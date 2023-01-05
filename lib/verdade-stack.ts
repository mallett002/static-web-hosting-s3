import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Route53Construct } from '../lib/constructs/route-53-construct';

export class VerdadeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
      // make route 53 with ACM Cert
      new Route53Construct(this, 'Route53Construct');

      // s3 buckets  
      // cloudfront
      
  }
}
