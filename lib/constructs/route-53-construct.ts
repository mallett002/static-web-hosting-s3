import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class Route53Construct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
      const hostedZone = new route53.HostedZone(this, 'HostedZone', {
        zoneName: 'williamalanmallett.link',
      });
      
      const cert = new acm.Certificate(this, 'williamAlanMallettCert', {
        domainName: 'williamalanmallett.link',
        certificateName: 'William Alan Mallett Cert',
        subjectAlternativeNames: ['*.williamalanmallett.link'],
        validation: acm.CertificateValidation.fromDns(hostedZone)
      });

      new route53.CnameRecord(this, `CnameApiRecord`, {
        recordName: 'api',
        zone: hostedZone,
        domainName: 'williamalanmallett.link',
      });

      new route53.CnameRecord(this, `CnameApiRecord`, {
        recordName: 'api',
        zone: hostedZone,
        domainName: 'www.williamalanmallett.link',
      });

      // new route53.ARecord(this, 'AliasRecord', {
      //   zone: hostedZone,
      //   target: route53.RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
      //   // or - route53.RecordTarget.fromAlias(new alias.ApiGatewayDomain(domainName)),
      // });

  }
}
