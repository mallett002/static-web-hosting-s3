import { Construct } from 'constructs';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { resolve } from 'path';
import { RedirectProtocol } from 'aws-cdk-lib/aws-s3';

export class S3Construct extends Construct {
    public readonly assetBucket: s3.Bucket;

    constructor(scope: Construct, id: string) {
      super(scope, id);

      // Create the www one with the index.html
      // won't have static web hosting enabled
      // use https
      this.assetBucket = new s3.Bucket(this, 'AssetBucket', {
        bucketName: 'www.williamalanmallett.link',
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true
        // websiteIndexDocument: 'index.html',
        // publicReadAccess: true,
      });

      new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
        // sources: [s3Deploy.Source.asset('.')],
        sources: [s3Deploy.Source.asset(resolve(__dirname, '../../dist'))],
        destinationBucket: this.assetBucket,
        retainOnDelete: false
      });

      // Create the non www one that will redirect to the www one
      // will have static web hosting enabled
      // use https
      const redirectBucket = new s3.Bucket(this, 'RedirectBucket', {
        bucketName: 'williamalanmallett.link',
        removalPolicy: RemovalPolicy.DESTROY,
        websiteRedirect: {
            hostName: 'www.williamalanmallet.link',
            protocol: RedirectProtocol.HTTPS
        }
      });
    }
  }