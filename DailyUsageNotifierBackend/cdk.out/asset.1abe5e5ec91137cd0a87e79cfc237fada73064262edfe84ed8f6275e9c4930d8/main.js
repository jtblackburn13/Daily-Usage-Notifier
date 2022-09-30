const {getCurrentMonthUsage} = require('./aws/costExplorer');
const {publishToTopic} = require('./aws/sns');

const {getHighFlyOpsDailyMetrics} = require('./google/analytics');


async function sendDailyNotification(){
    try {

        // get usage update by querying Cost Explorer
        let usageUpdateResponse = await getCurrentMonthUsage()
        if(!usageUpdateResponse.successful){
            return
        }

        // get usage update by querying Cost Explorer
        let hfoMetricsResponse = await getHighFlyOpsDailyMetrics()
        if(!hfoMetricsResponse.successful){
            return
        }

        // compile text message
        let textMessage = `${usageUpdateResponse.usageUpdate} \n\n ${hfoMetricsResponse.dailyMetrics}`
        console.log(textMessage)

        await publishToTopic(textMessage)
       
    } catch (error) {
        console.log(`SendDailyNotification Error:`, error)
    }
}

exports.handler = async () => {
    return await sendDailyNotification();
} 