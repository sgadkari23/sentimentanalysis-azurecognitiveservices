const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var responsemsg = null
    var result = []
    if(req.body!=undefined)
    {
        var array = req.body
        var i,j, temporary, chunk = 10;
        for (i = 0,j = array.length; i < j; i += chunk) {
            temporary = array.slice(i, i + chunk);
            temporaryResult = await analyzeNews(temporary)
            result.push(...temporaryResult.documents)
        }
        for(i=0; i<array.length;i++)
        {
            for(j=0;j<result.length;j++)
            {
                if(array[i].id == result[j].id)
                {
                    var sentiment;
                    if(result[j].score<0.4)
                    {
                        sentiment = "negative"
                    }
                    else if(result[j].score>0.6)
                    {
                        sentiment = "positve"
                    }
                    else
                    {
                        sentiment = "neutral"
                    }

                    array[i] = {...array[i], 'score': result[j].score, 'sentiment': sentiment}
                    break;
                }
            }
        }

    }
    
    var finalResult = {}
    finalResult['data'] = array
    context.bindings.outputDocument = JSON.stringify(finalResult)
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: array
    };
}

const analyzeNews = async function(newsData) {
    const response = await axios({
      url: "https://assign3dm.cognitiveservices.azure.com/text/analytics/v2.1/sentiment",
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': "1bf1e5af329c4f0e8c496e6e45bbea6f"
      },
      data: {
        documents: newsData
      }
    });
    return response.data;
};