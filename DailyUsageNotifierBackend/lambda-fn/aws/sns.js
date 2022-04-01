const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");


async function publishToTopic(message){
    try {
        const sns = new SNSClient(process.env.REGION)

        const publishCommand = new PublishCommand({
            Message: message,
            TopicArn: process.env.SNS_TOPIC_ARN,
        });

        await sns.send(publishCommand);

    } catch (error) {
        console.log(`publishToTopic Error:`, error)
    }
}

module.exports = {publishToTopic};