// const AWS = require('aws-sdk');
const moment = require('moment');






async function sendDailyNotification(){
    try {

        console.log("This is your daily notification!")
       
    } catch (error) {
        console.log(`SendDailyNotification Error:`, error)
    }
   
}

exports.handler = async () => {
    return await sendDailyNotification();
} 