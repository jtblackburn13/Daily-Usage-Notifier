const AWS = require('aws-sdk');
const moment = require('moment');


const costexplorer = new AWS.CostExplorer({region:process.env.REGION});



async function getCurrentMonthUsage(){
    try {

        var date = new Date();
        var StartDate = moment().startOf('month').format('YYYY-MM-DD');
        var EndDate = moment(date).format('YYYY-MM-DD');
        console.log('StartDate ' + StartDate);
        console.log('EndDate ' + EndDate);

        let totalCostForMonth = 0
        let yesterdayCost = 0

        let response = await costexplorer.getCostAndUsage({
            TimePeriod: {
                End: EndDate, 
                Start: StartDate
            },
            Granularity: 'DAILY',
            Metrics: ['BlendedCost'],
            // GroupBy:[{
            //     Type:"DIMENSION",
            //     Key:"SERVICE"
            // }]
        }).promise();

        for (let i = 0; i < response.ResultsByTime.length; i++) {
            const point = response.ResultsByTime[i];
            // console.log(JSON.stringify(point, null, 4))

            totalCostForMonth = totalCostForMonth + parseFloat(point.Total.BlendedCost.Amount)
            if(point.TimePeriod.End == EndDate){
                yesterdayCost = parseFloat(point.Total.BlendedCost.Amount)
            }
        }

        let usageUpdate = `-- AWS Usage --\n     Yesterday: $${yesterdayCost.toFixed(2)} \n     This month: $${totalCostForMonth.toFixed(2)}`
        return {
            successful: true,
            usageUpdate: usageUpdate
        }

    } catch (error) {
        console.log(`getCurrentMonthUsage Error:`, error)
        return {
            successful: false
        }
    }
   
}

module.exports = {getCurrentMonthUsage};