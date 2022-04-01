const cdk = require('@aws-cdk/core');
const targets = require('@aws-cdk/aws-events-targets');
const lambda = require('@aws-cdk/aws-lambda');
const events = require('@aws-cdk/aws-events');
const sns = require('@aws-cdk/aws-sns');
const subscriptions = require('@aws-cdk/aws-sns-subscriptions');
const iam = require('@aws-cdk/aws-iam')

// const sqs = require('aws-cdk-lib/aws-sqs');

class DailyUsageNotifierBackendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const DailyNotificationTopic = new sns.Topic(this, `DailyNotification-Topic`)

    const DailyUsageNotifier = new lambda.Function(this, `DailyUsageNotifier`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fn'),
      timeout: cdk.Duration.seconds(60),
      memorySize: 1024,
      environment: {
        SNS_TOPIC_ARN: DailyNotificationTopic.topicArn,
        REGION: 'us-east-1',
      }
    });

    DailyNotificationTopic.grantPublish(DailyUsageNotifier)
    DailyNotificationTopic.addSubscription(new subscriptions.SmsSubscription('+14697661066'));

    // 👇 create a policy statement
    const cePolicy = new iam.PolicyStatement({
      actions: ['ce:*'],
      resources: ['*'],
    });

    // 👇 add the policy to the Function's role
    DailyUsageNotifier.role.attachInlinePolicy(
      new iam.Policy(this, 'ce-policy', {
        statements: [cePolicy],
      }),
    );

    const eventRule = new events.Rule(this, 'DailyUsageNotifierScheduleRule', {
      schedule: events.Schedule.cron({ minute: '0', hour: '13', weekDay:"MON-FRI" }) //events.Schedule.rate(cdk.Duration.minutes(15)),
    });
    eventRule.addTarget(new targets.LambdaFunction(DailyUsageNotifier))

    
  }
}

module.exports = { DailyUsageNotifierBackendStack }

