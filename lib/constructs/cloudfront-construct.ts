import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface CloudFrontProps {
    assetBucket: s3.IBucket,
    certificate: cdk.aws_certificatemanager.Certificate
}

export class CloudFrontConstruct extends Construct {
  constructor(scope: Construct, id: string, props: CloudFrontProps) {
    super(scope, id);

    new cloudfront.Distribution(this, 'distro', {
        defaultRootObject: 'index.html',
        certificate: props.certificate,
        domainNames: ['www.williamalanmallett.link'],
        defaultBehavior: {
          origin: new origins.S3Origin(props.assetBucket),
          // origin access controll?
        },
      });




//     Cloudfront for www s3 bucket
// “This distribution will go directly to your www bucket to grab the index.html”
// - Origin domain: www.williamalanmallett.link.s3.us-east-1.amazonaws.com (origin for cloudfront, the s3 bucket)
// - Name: same as domain
// - Origin access: Origin access control settings
// - Origin access control: www bucket name
// - Default cache: redirect http to https
// - Settings use only North America and Europe
// - Alternate domain name: www.williamalanmallett.link
// - Custom ssl cert: cert created previously
// - Default root object: index.html
// - This created a policy to add to the www bucket:
// {
//     "Version": "2008-10-17",
//     "Id": "PolicyForCloudFrontPrivateContent",
//     "Statement": [
//         {
//             "Sid": "AllowCloudFrontServicePrincipal",
//             "Effect": "Allow",
//             "Principal": {
//                 "Service": "cloudfront.amazonaws.com"
//             },
//             "Action": "s3:GetObject",
//             "Resource": "arn:aws:s3:::www.williamalanmallett.link/*",
//             "Condition": {
//                 "StringEquals": {
//                     "AWS:SourceArn": "arn:aws:cloudfront::175849613020:distribution/E22T61Y0N8EM5J"
//                 }
//             }
//         }
//     ]
// }


  }
}
