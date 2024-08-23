positions = [['48%','20%'], ['24%','40%'], ['24%','60%'], ['48%','80%'], ['74%','60%'], ['74%','40%']];
lowLandProb = 0.9;
highLandProb = 0.5;
targets = [[1, 2, 3, 4, 5, 0], 
[4, 3, 4, 5, 1, 1], 
[3, 2, 3, 4, 0, 0], 
[5, 4, 5, 0, 2, 2]]

correctResponses = [[2, 1], [2, 1], [1, 2, 1], [2, 2, 1]];
introPlanetColors = [];


function assignValues(config){
    
    introPlanets = config[0].Planet_Feedback;
    console.log(introPlanets)
    rewardPlanetColors = config[0].Rew_Planets;
    console.log(rewardPlanetColors)
    introPlanetColors = config[0].Practise;
    console.log(introPlanetColors)
        
    planetPoints = config[0].planetRewards;
    console.log(planetPoints)
    
    introTurns = config[0].conditionsFeedback.notrials;
    console.log(introTurns)
    introRocketStart = config[0].conditionsFeedback.starts;
    console.log(introRocketStart)
    introNoise = config[0].conditionsFeedback.noise;
    console.log(introNoise)  
    
    // MISSING?
    // trainPlanets = config[0].planetsPractise;
    // console.log(trainPlanets)
    // trainRocketStart = config[0].startsPractise;
    // console.log(trainRocketStart)
    // trainNoise = config[0].conditionsPractise.noise;
    // console.log(trainNoise)
    // trainTurns = config[0].conditionsPractise.notrials;
    // console.log(trainTurns)
    
    mainPlanets = config[0].planetsExp;
    console.log(mainPlanets)
    mainTurns = config[0].conditionsExp.notrials;
    console.log(mainTurns)
    mainNoise =  config[0].conditionsExp.noise
    mainRocketStart = config[0].startsExp;
    console.log(mainRocketStart)

    actionCost = config[0].actionCost;
    console.log(actionCost)

    indexExp = config[0].indexExp;
    console.log(indexExp)
    labelsExp = config[0].labelsExp;
    console.log(labelsExp)
}
config = JSON.parse(config);
assignValues(config);

// alert(mydata[0].age);

// $.ajax({
//     dataType: "json",
//     url: "config.json",
//     success: function(data) {
//         assignValues(data);
//         console.log(introPlanetColors);
//         main();
//     }
// });

