const {BetaAnalyticsDataClient} = require('@google-analytics/data');

const moment = require('moment')

const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: 'google/high-fly-ops-e8cd1bcd2dbc.json',
  });


let propertyId = '279800863';


async function getHighFlyOpsDailyMetrics(){
    try {

      let startDate = moment().subtract(30, "days").format("yyyy-MM-DD").toString()

      let dailyMetrics = `-- High Fly Ops --\n  `

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
              {
                startDate: startDate,
                endDate: 'today',
              },
            ],
            dimensions: [
              {
                name: 'date',
              },
            ],
            metrics: [
              {
                name: 'screenPageViews',
              },
            ],
          });
      
          response.rows.forEach((row) => {
            let statDate = moment(row.dimensionValues[0].value, "YYYYMMDD").format("MM-DD-yyyy").toString()
            dailyMetrics = dailyMetrics + `${statDate} --> ${row.metricValues[0].value} page views \n  `
          });

        // console.log(`dailyMetrics:`, dailyMetrics)
 
        return {
            successful: true,
            dailyMetrics: dailyMetrics
        }

    } catch (error) {
        console.log(`getHighFlyOpsDailyMetrics Error:`, error)
        return {
            successful: false
        }
    }
   
}

module.exports = {getHighFlyOpsDailyMetrics};