import { Construct } from 'constructs';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { resolve } from 'path';
import { RedirectProtocol } from 'aws-cdk-lib/aws-s3';
import { DOMAIN, SUB_DOMAIN } from '../../constants';

export class S3Construct extends Construct {
    public readonly assetBucket: s3.Bucket;
    public readonly redirectBucket: s3.Bucket;

    constructor(scope: Construct, id: string) {
      super(scope, id);

      // S3 Bucket for subdomain (The one with index.html)
      this.assetBucket = new s3.Bucket(this, 'AssetBucket', {
        bucketName: SUB_DOMAIN,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      });

      new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
        sources: [s3Deploy.Source.asset(resolve(__dirname, '../../dist'))],
        destinationBucket: this.assetBucket,
        retainOnDelete: false
      });

      // Redirect bucket that goes to the assetBucket
      this.redirectBucket = new s3.Bucket(this, 'RedirectBucket', {
        bucketName: DOMAIN,
        removalPolicy: RemovalPolicy.DESTROY,
        websiteRedirect: {
            hostName: SUB_DOMAIN,
            protocol: RedirectProtocol.HTTPS
        }
      });
      
    }
  }