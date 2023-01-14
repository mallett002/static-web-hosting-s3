import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {DOMAIN} from '../../constants';

export class Route53Construct extends Construct {
  public readonly certificate: cdk.aws_certificatemanager.Certificate;
  public readonly hostedZone: route53.IHostedZone;

  constructor(scope: Construct, id: string) {
    super(scope, id);
      const zoneId = process.env.HOSTED_ZONE_ID || '';

      // Get the hosted zone that was created with domain name purchase:
      this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `HostedZone`, {
        hostedZoneId: zoneId,
        zoneName: DOMAIN,
      });

      // Request a public cert:
      this.certificate = new acm.Certificate(this, 'williamAlanMallettCert', {
        domainName: DOMAIN,
        certificateName: 'William Alan Mallett Cert',
        subjectAlternativeNames: [`*.${DOMAIN}`], // wildcard certificate for all subdomains
        validation: acm.CertificateValidation.fromDns(this.hostedZone)
      });
  }
}
