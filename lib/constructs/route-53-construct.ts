import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class Route53Construct extends Construct {
  public readonly certificate: cdk.aws_certificatemanager.Certificate;

  constructor(scope: Construct, id: string) {
    super(scope, id);
      const zoneId = process.env.HOSTED_ZONE_ID || '';

      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `HostedZone`, {
        hostedZoneId: zoneId,
        zoneName: 'williamalanmallett.link',
      });

      this.certificate = new acm.Certificate(this, 'williamAlanMallettCert', {
        domainName: 'williamalanmallett.link',
        certificateName: 'William Alan Mallett Cert',
        subjectAlternativeNames: ['*.williamalanmallett.link'],
        validation: acm.CertificateValidation.fromDns(hostedZone)
      });

      // new route53.ARecord(this, 'AliasRecord', {
      //   zone: hostedZone,
      //   target: route53.RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
      //   // or - route53.RecordTarget.fromAlias(new alias.ApiGatewayDomain(domainName)),
      // });

  }
}
