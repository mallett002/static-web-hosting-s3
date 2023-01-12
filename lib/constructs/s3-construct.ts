import { Construct } from 'constructs';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { resolve } from 'path';
import { RedirectProtocol } from 'aws-cdk-lib/aws-s3';

export class S3Construct extends Construct {
    public readonly assetBucket: s3.Bucket;
    public readonly redirectBucket: s3.Bucket;

    constructor(scope: Construct, id: string) {
      super(scope, id);

      this.assetBucket = new s3.Bucket(this, 'AssetBucket', {
        encryption: s3.BucketEncryption.S3_MANAGED,
        accessControl: s3.BucketAccessControl.PRIVATE,
        bucketName: 'www.williamalanmallett.link',
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true
      });

      new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
        sources: [s3Deploy.Source.asset(resolve(__dirname, '../../dist'))],
        destinationBucket: this.assetBucket,
        retainOnDelete: false
      });

      this.redirectBucket = new s3.Bucket(this, 'RedirectBucket', {
        bucketName: 'williamalanmallett.link',
        removalPolicy: RemovalPolicy.DESTROY,
        websiteRedirect: {
            hostName: 'www.williamalanmallet.link',
            protocol: RedirectProtocol.HTTPS
        }
      });
    }
  }