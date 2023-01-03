#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VerdadeStack } from '../lib/verdade-stack';

new VerdadeStack(
  new cdk.App(),
  'VerdadeStack', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
  }
);
