//////////////////////////////////////////////////////////
////////              FUNCTIONS               ////////////

// PUSH DATA FUNCTION
// function pushDataTrain(){
//     trainData.responses.RT = trainRTarray;
//     trainData.responses.keys = trainKeysArray;
  
//     trainData.states = trainStateArray;
//     trainData.points = trainPointsArray;
//     trainData.planetConfigurations = trainPlanets;
//     trainData.conditions.notrials = trainTurns;
//     trainData.conditions.noise = trainNoise;
//   };
  
function pushDataMain(){
  mainData.responses.RT = mainRTarray;
  mainData.responses.keys = mainKeysArray;

  mainData.states = mainStateArray;
  mainData.points = mainPointsArray;
  mainData.planetConfigurations = mainPlanets;
  mainData.conditions.notrials = mainTurns;
  mainData.conditions.noise = mainNoise;
};

///////////////////////////////
// INITIALIZATION FUNCTIONS


function assignPlanet(arrayRow){
  $('#planets .planet').each(function(i) {
      pl = arrayRow[i];
      $(this).attr('data-planet-img',pl);
      pl = (planetPoints[pl-1] > 0) ? "+"+planetPoints[pl-1]:planetPoints[pl-1];
      $(this).attr('data-points',pl);
  });
};

function initializeSquares(numSquares){
  if (numSquares == 2) {
    squaresWrapper.attr('data-num-squares','2');
  } else{
    squaresWrapper.attr('data-num-squares','3');
  }
};

// needs to happen only once, change initialize screen function; 
function initializePointsBar(){
  updatePointsBar();
  $('#points-wrapper').removeClass('inactive');
};

function initializeRocket(rocketPos) {
  rocket.removeAttr('style');
  rocket.attr('data-pos',rocketPos-1);
};

function initializeAsteroids(noise){
  if (noise == 'high'){
    $('#game-container').addClass('asteroids');
  } else if (noise == 'low'){
    $('#game-container').removeClass('asteroids');
  }
}

function initializeGameScreen(){
  if(isIntroduction){
    args = [introPlanets[trial], introTurns[trial],introRocketStart[trial]];
  // } else if (isTraining){
  //   args = [trainPlanets[trial], trainTurns[trial], trainRocketStart[trial]];
  //   asteroidTrial = [5,10,15];
  } else if (isMain){
    args = [mainPlanets[trial], mainTurns[trial], mainRocketStart[trial]];
  }

  planetsForMiniBlock = args[0];
  turnsForMiniblock = args[1];
  rocketPos = args[2];

  turnsLeft = turnsForMiniblock;
  assignPlanet(planetsForMiniBlock);
  initializeSquares(turnsForMiniblock);
  if(trial == 0){
    initializePointsBar();
  }
  initializeRocket(rocketPos);
  
  if(!isIntroduction){
    initializeAsteroids(mainNoise[trial])
  }
};

//  UPDATE FUNCTIONS

function planetReward(newPos){
  if (isIntroduction){ conf = introPlanets[trial];
  // } else if (isTraining) { conf = trainPlanets[trial];
  } else if (isMain) { conf = mainPlanets[trial];}

  reward = planetPoints[conf[newPos]-1];
  // console.log('current reward: ', reward)
  return reward
};

function updatePoints(newPos){
  points += planetReward(newPos);
};
// rgb(227, 0, 28)
// rgb(0, 0, 255)
function updatePointsBar() {
  
  fillingW = points/2000*100;
  fillingW = (fillingW > 100) ? 100: fillingW; // take care of overflow
  $('#points-filling').width(fillingW + '%');
  if (fillingW <= 12.5){
    $('#red-points-filling').css({'opacity':1})
  } else if (fillingW > 12.5 && $('#red-points-filling').css('opacity') != 0){
    $('#red-points-filling').css({'opacity': 0})
  }
};

function updateScore(newPos){
  updatePoints(newPos);
  updatePointsBar();
};
// SHIP NAVIGATION FUNCTIONS

function getTargetPosition(regime){
  pos = rocket.attr('data-pos');
  newTarget = targets[regime][pos];
  newPos = positions[newTarget];
  newPos[2] = newTarget;
  return newPos
};

function executeMove(key, prob){
  if (key == move && !rocket.hasClass('animating')) {
    newPos = getTargetPosition(0);

  } else if (key == jump && !rocket.hasClass('animating') ){
    
    missProb = Math.random();         // probability to miss target at jump
    newTarget = Math.random() <= 0.5; // choose random neighbour of target to land on
    newTarget = newTarget ? 2 : 3;
    
    if (isIntroduction){
      noiseLevel = 'low'     // hack to ensure that it always
      missProb = 0;           // lands during end of intro
    // } else if(isTraining) {
    //   noiseLevel = trainNoise[trial];
    } else if(isMain) {
      noiseLevel = mainNoise[trial];
    }

    if (noiseLevel == 'low'){         // if no asteroids present
      miss = missProb > lowLandProb
      // console.log(missProb)
    } else {
      miss = missProb > highLandProb
    }

    if (miss) {
      newPos = getTargetPosition(newTarget);
    } else {
      newPos = getTargetPosition(1);
    }
  }
  updateScore(newPos[2]);
  animateRocket(newPos);
  turnsLeft--;
};

function executeIntroMove(key, prob){
  if (key == jump && !rocket.hasClass('animating')){
    
    missProb = prob;                  
    newTarget = Math.random() <= 0.5; // choose random neighbour of target to land on
    newTarget = newTarget ? 2 : 3;

    if (isLearningUncertaintyLow){         // if no asteroids present
      willMiss = missProb > lowLandProb;
      cb = lowUncertaintyCallback
    } else {
      willMiss = missProb > highLandProb;
      cb = highUncertaintyCallback
    };

    if (willMiss) {             // if rocket misses jump target
      newPos = getTargetPosition(newTarget);
      missed = true;
    } else {  
      newPos = getTargetPosition(1);
    };
    newPos[3] = resetPos;
    // displayScore($('#score-jump'));
    animateRocket(newPos, cb);
  }
};


function revertAnimation(newPos){
  setTimeout(function(){
    $(gameStage).addClass('inactive');
    if (screen == 12){
      $('#planetNumbers').addClass('inactive');
    } else if (screen == 17) {
      $('#game-container').removeClass('asteroids');
    }
    setTimeout(function(){
      clearRocketStyle(newPos);
      rocket.removeClass('inactive animating');
      $(gameStage).removeClass('inactive');

      isReverting = false;
      
      if (screen == 12){
        $('#planetNumbers').removeClass('inactive');
      } else if (screen == 17) {
        $('#game-container').addClass('asteroids');
      }     
      if (screen == 16 || screen == 17) {
        running = false;
      }
    },1000)
  },500)
};


function pointsColor(){
    rocketPos = rocket.attr('data-pos');
    rocketPos = parseInt(rocketPos) + 1; 

    planetIdentity = $("#planet"+ rocketPos).attr('data-planet-img');

    if (planetIdentity > 3){
      $('#planet' + rocketPos).addClass("good")
    } else if (planetIdentity < 3){ 
      $('#planet' + rocketPos).addClass("bad")
    } else {
      $('#planet' + rocketPos).addClass("neutral")
    }
} 
function animateRocket(posInfo, cb) {

rocket.addClass('animating');
animStart = new Date();

if(screen >= 26 || isMain){
// if(screen >= 26 || isMain || isTraining){
    $('.showing-points').removeClass('showing-points');
    $('.good, .bad, .neutral').removeClass('good bad neutral')
    
}
rocket.animate({
    top:posInfo[0],
    left:posInfo[1],
// }, 500, function(){
}, 500, function(){

  animEnd = new Date(); //unnecessary?g
    // console.log('time elapsed is:' + (animEnd.getTime() - animStart.getTime()));
    rocket.removeClass('animating');
    rocket.attr('data-pos',posInfo[2]);
    if(screen >= 26 || isMain){
    // if(screen >= 26 || isMain || isTraining){
    pointsColor()
    $('#planet'+(posInfo[2]+1)).addClass('showing-points');
    }

    if (isMain){
    // if(isTraining || isMain){
    animationEndTime = new Date();
    // console.log('time elapsed2 is:' + (animationEndTime.getTime() - animStart.getTime()));
    animationEnd.push(animationEndTime.getTime());
    console.log('animationEnd: ' + animationEndTime.getTime())
    states.push(+rocket.attr('data-pos')+1);
    if (points <= 0){
      gameover = true;
      gameOverResultsUpdate();
      setTimeout(function(){

        // if (isTraining){
        //     trainCallback();
        // } else {
        mainCallback();
        // }
        gameover = false;
        }, 2000)
    }
    // console.log("t="+trial+', left: ' +turnsLeft+" animationEnd time: "+ animationEnd);
    }

    if (typeof(cb) == 'function') {
    if (posInfo.length == 4) {
        cb(posInfo[3]);
    } else {
        cb();
    }
    }
});
};

// DATA COLLECTION FUNCTIONS


// function recordRT(){
//   // no longer necessary
// };

// function recordKey(){
//   keys.push(keycode == move ? 1:2);
// };

// function recordState() {
//   states.push(+rocket.attr('data-pos')+1);
// };


// function recordPoints(){
//   ps.push(points);
// }


function recordData(){
  if(trial !=-1){
    screenTransition = true;                            // doubled since used to initialize screen as well
    mainKeysArray.push(keys);
    states.unshift(mainRocketStart[trial]);
    mainStateArray.push(states);
    mainPointsArray.push(ps);
    
    rt.push(keyPress[0] - stimulusDisplay);
    rt.push(keyPress[1] - stimulusDisplay);
    rt.push(keyPress[2] - stimulusDisplay);
    // rt.push(keyPress[1] - animationEnd[0]);
    // console.log(keyPress, stimulusDisplay, animationEnd)
    // rt.push(keyPress[2] - animationEnd[1])
    mainRTarray.push(rt);
    
    rt = []; 
    stimulusDisplay = [];
    keyPress = [];
    animationEnd = [];
    keys = [];
    states = [];
    ps =[];
  } else {
    rt = []; 
    stimulusDisplay = [];
    keyPress = [];
    animationEnd = [];
    keys = [];
    states = [];
    ps =[];
  }
 
}
function keyToPosition(keycode) {
  if (keycode == 49 || keycode == 97) {
    response = 1;
  } else if (keycode == 50  || keycode == 98) {
    response = 2;
  } else if (keycode == 51  || keycode == 99) {
    response = 3;
  } else if (keycode == 52  || keycode == 100) {
    response = 4;
  } else if (keycode == 53  || keycode == 101) {
    response = 5;
  } else if (keycode == 54  || keycode == 102) {
    response = 6;
  } else {
    response = false;
  }
  return response
};

// CONTROL FLOW FUNCTIONS FOR INTRO PART

function  practiceMove(keycode){ 
if(keycode==move){
  if(!rocket.hasClass('animating') && !wrongKey && !isEnding){
    newPos = getTargetPosition(0)
    animateRocket(newPos, practiceMoveCallback)
    practiceCounter++;
  }
} else {
  if (!rocket.hasClass('animating') && !isEnding && !wrongKey) {
    wrongKey = true;
    displayWrongKey('#wrong-key-clockwise', ['MOVE',move]);
  }
}
}

function practiceMoveCallback(){
// NOWDEBUG
if (practiceCounter == 6) {
// if (practiceCounter == 1) {
  isEnding = true;
  setTimeout( function(){
    practiceCounter=0;
    practiceJumpTotal = 0;
    points = 1000;
    initializePointsBar();
    screenSwitch(gameStage,'#screen-jump-1');
    screen--;
    setTimeout(function (){
      screenSwitch('#screen-jump-1', '#screen-jump-2');
      isEnding = false;
    },6000)
  },1000)
}
};

function practiceJump(keycode){
if(keycode==jump){
  isTransitioning = isReverting || isEnding;
  if(!rocket.hasClass('animating') && $('#wrong-key-jump').hasClass('inactive') && !isTransitioning){
    if (practiceCounter < 5){
      resetPos = practiceCounter+1;
    } else {
      resetPos = practiceCounter-5;
    }
    practiceJumpTotal += 1;
    newPos = getTargetPosition(1);
    newPos[3] = resetPos;
    animateRocket(newPos, practiceJumpCallback);
    practiceCounter++;
  }
} else {
  if (!rocket.hasClass('animating') && !isEnding && !wrongKey && !isReverting) {
    wrongKey = true;
    displayWrongKey('#wrong-key-jump', ['JUMP',jump]);
  }
}
};

function practiceJumpCallback(resetPos){
// NOWDEBUG
if (practiceCounter == 12){
// if (practiceCounter == 1){
  isEnding = true;
  setTimeout( function(){
    isEnding = false;
    screenSwitch(gameStage, '#flightPattern-1');
    dispPattern = true;
    setTimeout(function(){
      dispPattern = false;
    },2000)
    points = 1000
  },1000)    
} else {
  isReverting = true;
  setTimeout(function(){
    revertAnimation(resetPos);
  },1000)
}
};


function playNumberGame(){
if(!$('#flightPattern-2').hasClass('inactive')) {
  $('#flightPattern-2').addClass('inactive');
  $(gameStage+', #planetNumbers').removeClass('inactive');
  clearRocketStyle(testStarts[numberGameCounter]-1);
  $('.back').addClass('inactive')

} else{

  isNotDispMessage = $('#right-position, #wrong-postion, #wrong-number').hasClass('inactive')
  isTransitioning = isReverting || isEnding;  
  if(!rocket.hasClass('animating') && isNotDispMessage && !isTransitioning) {

    userResponse = keyToPosition(keycode);
    correctResponse = userResponse == rightAnswers[numberGameCounter % 18];
    // console.log('trial: '+numberGameCounter+ ' correct:' + answersGuessed);
    if (correctResponse) {
      answersGuessed++;
      progressNumberGame([$('#right-position'),500]);
    } else if (!correctResponse && userResponse != false) {
      progressNumberGame([$('#wrong-position'),2000]);
    } else if (userResponse == false){
      $('#wrong-number').removeClass('inactive');
      setTimeout(function(){
        $('#wrong-number').addClass('inactive');
      },500);
    }
  }
}
}


function progressNumberGame(args){
element = args[0];
timeout = args[1];
isReverting = true;                           // not really reverting yet, but necessary due setTimeout bellow
numberGameCounter++;
resetPos = testStarts[numberGameCounter % 18]-1;
      // testStarts = [1,2,3,4,5,6,2,5,1,6,3,4,3,6,4,1,5,2];
    // rightAnswers = [5,4,5,6,2,2,4,2,5,2,5,6,5,2,6,5,2,4];
// console.log('resetPos ',resetPos);
newPos = getTargetPosition(1);
newPos[3] = resetPos;
element.removeClass('inactive');
setTimeout(function(){
  element.addClass('inactive');
  animateRocket(newPos, numberGameCallback);
},timeout);
};


// true callback
function numberGameCallback(resetPos){
// NOWDEBUG
if(answersGuessed == 17 || ((numberGameCounter)/18 == 3)){
// if(answersGuessed == 17 || ((numberGameCounter)/2 ==1)){ 
  isEnding = true; 
  setTimeout(function() {
    // prepare next instruction screen
    screenSwitch('#planetNumbers','#jump-uncertainty-1');
    screen--;
    $('#game-container').addClass('inactiveStrong');
    mainData.noPatternTrainings = Math.ceil(numberGameCounter/18);
    //reset vars for move uncertainty display
    clearRocketStyle(0);
    points = 1000;
    playing = false;

    setTimeout(function(){
      screenSwitch('#jump-uncertainty-1','#jump-uncertainty-2');
      isEnding = false;
    },3000);
    
  },1000);
} else {
  
  // if( numberGameCounter % 3 == 0 && numberGameCounter != 0) {
  if( numberGameCounter % 18 == 0 && numberGameCounter != 0) {
    answersGuessed = 0;
  }
  setTimeout(function(){
    revertAnimation(resetPos);
  },1000)
} 
};

// // // debug callback
// function numberGameCallback(resetPos){
//   if(answersGuessed == 17 || ((numberGameCounter)/2 ==1)){ 
//   // if(answersGuessed == 17 || ((numberGameCounter)/18 ==3)){            // DON'T FORGET TO CHANGE THIS AFTER BUILDING THE REST
//   setTimeout(function() {
//     // prepare next instruction screen
//     screenSwitch('#planetNumbers','#jump-uncertainty-1');
//     $('#game-container').addClass('inactiveStrong');
//     //  reset vars for move uncertainty display
//     clearRocketStyle(0);
//     points = 1000;
//     initializePointsBar();
//   },1000);
// } else if( numberGameCounter % 3 == 0 && numberGameCounter != 0) {
// // } else if( numberGameCounter % 18 == 0 && numberGameCounter != 0) {
//   answersGuessed = 0;
//   revertAnimation(resetPos);
// } else {
//   revertAnimation(resetPos);
//   }
// };

function learnLowUncertainty(){

if (!$('#jump-uncertainty-5').hasClass('inactive')) {
  // setup rocket and stage
  $('#jump-uncertainty-5').addClass('inactive');
  $('#game-container').removeClass('inactiveStrong');
      $('.back').addClass('inactive')
  isReverting = false;
  running = false;
  uncertaintyTotal = 0;
  isLearningUncertaintyLow = true;
  missed = false;

} else{
  if(keycode==jump){
     if($('#wrong-key-jump').hasClass('inactive') && !running){
      running = true;
      if (uncertaintyCounter < 5){
        resetPos = uncertaintyCounter+1;
      } else {
        resetPos = uncertaintyCounter-5;
      }
      executeIntroMove(keycode, missProbLow[uncertaintyTotal]);
      // console.log(uncertaintyTotal, uncertaintyCounter, missProbLow[uncertaintyTotal])
      uncertaintyTotal++;
      uncertaintyCounter++;
    }
  } else if (!running){
    displayWrongKey('#wrong-key-jump', ['JUMP',jump]);
  };
};
};

function lowUncertaintyCallback(resetPos){
// NOWDEBUG
if (uncertaintyTotal == 12){
// if (uncertaintyTotal == 1){
  setTimeout(function(){

    $('#game-container').addClass('inactiveStrong asteroids');
    $('#jump-uncertainty-6').removeClass('inactive');         
    screen++;
    // initializePointsBar();
    isLearningUncertaintyLow = false;
    points = 1000
    uncertaintyTotal = 0;
    uncertaintyCounter = 0;
    running = false;
    playing = false;
  },1000);
} else {
  if (missed){
    setTimeout(function(){
      $('#missed-target').removeClass('inactive');
      setTimeout(function(){
        $('#missed-target').addClass('inactive');
        revertAnimation(resetPos);
        missed = false;
      },2000);
    },1000)
  } else{
    setTimeout(function(){
      revertAnimation(resetPos);
    },1000)
  }
}
};

function learnHighUncertainty(){
if(!$('#jump-uncertainty-6').hasClass('inactive')){
  $('#jump-uncertainty-6').addClass('inactive');
  clearRocketStyle(0);
  $('#game-container').removeClass('inactiveStrong');
} else {
  if(keycode==jump){
    if($('#wrong-key-jump').hasClass('inactive') && !running){
      running = true;
      if (uncertaintyCounter < 5){
        resetPos = uncertaintyCounter+1;
      } else {
        resetPos = uncertaintyCounter-5;
      }
      executeIntroMove(keycode, missProbHigh[uncertaintyTotal])
      // console.log(uncertaintyTotal, uncertaintyCounter, missProbHigh[uncertaintyTotal]);
      uncertaintyTotal ++;
      uncertaintyCounter++;
    }
  } else if (!running){
    displayWrongKey('#wrong-key-jump',['JUMP',jump]);
  }
}
};

function highUncertaintyCallback(){
// NOWDEBUG
if (uncertaintyTotal == 12){
// if (uncertaintyTotal == 1){
  setTimeout(function(){
    $('#game-container').addClass('inactiveStrong');
    $('#planet-points').removeClass('inactive');
    $('#game-container').removeClass('asteroids')
    point = 1000;
    initializePointsBar();
    screen++;
    playing = false
    $('#planet-points-2 div').each(function(i) {
      $(this).addClass('planet p'+(i+1)+'-intro');
      $(this).attr('data-planet-img', i+1);
      // $(this).attr('data-planet-img', rewardPlanetColors[i]);
      pl = (i > 2) ? "+"+planetPoints[i]:planetPoints[i];
      $(this).attr('data-points',pl);
      $(this).addClass('showing-points');
    });

    assignPlanet(introPlanetColors);

  },1000)
} else {
  if (missed){
    setTimeout(function(){
      $('#missed-target').removeClass('inactive');
      setTimeout(function(){
       $('#missed-target').addClass('inactive');
       revertAnimation(resetPos);
       missed = false;
      },1000);
    },1000)
  } else{
   setTimeout(function(){  
      revertAnimation(resetPos);
    },1000)
  }
}
}



////////// MAIN PLAYING MINIBLOCK FUNCTIONS //////////
function playTurn(finishCallback) {
  allowedKey = (keycode == jump) || (keycode == move);
  rocketMoving = rocket.hasClass('animating');
  // DEBUG POST


  if (allowedKey && !rocketMoving && !screenTransition){
    keyPress.push(keyPressTime.getTime());
    // console.log("t="+trial+', left: ' +turnsLeft+" keyPress time: "+ keyPress);
    $('#square'+ turnsLeft).addClass('hideSquare');
    // displayScore(choosePoints());
    executeMove(keycode);
    keys.push(keycode == move ? 1:2);
    ps.push(points);
    // console.log('pushed points')

    if (turnsLeft==0) {
      screenTransition = true;  
      setTimeout( function(){
        if(!gameover) {
          $('#game-container').addClass('inactiveStrong');
          finishCallback();
        }
      },1500);
    }
  } 

};

function finishTurn(){

  recordData();

  if(!$('#optimal-route').hasClass('inactive')){
    $('#optimal-route').addClass('inactive')
  }
  $('#main-transition-text').removeClass('inactive');
  $('.hideSquare').removeClass('hideSquare');
  $('.showing-points').removeClass('showing-points');
  console.log(trial)
  trial++;
  initializeGameScreen(); 

  setTimeout(function(){
    screenTransition = false;
    $('#main-transition-text').addClass('inactive');
    $('#game-container').removeClass('inactiveStrong');
    stimulusDisplayTime = new Date();
    // console.log('stimulus disp time: ' + stimulusDisplayTime.getTime())
    stimulusDisplay.push(stimulusDisplayTime.getTime());
    // console.log("t="+trial+', left: ' +turnsLeft+" stimulusDisplay time: "+ stimulusDisplay);
  }, 1500);
};

////////// CALLBACKS FOR FINISHING TURN IN EACH STAGE AND OTHER PLAY-TURN RELATED FUNCTIONS
currentlyShowingRoute = false;
willShowRoute = false;
optimalCounter = 0
transitionMessages = ['#not-optimal', '#not-optimal-2', '#not-optimal-3'];

function introCallback(){
  timeout = 4000
  optimalFound = checkActionOptimality();
  trial = optimalFound ? trial : trial-1;
  screenTitle = optimalFound ? $('#optimal'):$(transitionMessages[optimalCounter]);
  screenTitle.removeClass('inactive'); 
  optimalCounter = optimalFound ? 0 : optimalCounter+1;
  optimalFound = false;
  if (optimalCounter < 3){
    setTimeout(function(){
      screenTitle.addClass('inactive');
    },timeout);
  } else {
    if (!currentlyShowingRoute) {
      optimalFound = false;
      willShowRoute = true;
      playing = false;
    }
  }
    
  
  
  timeout = 2000;
  setTimeout(function(){
    // NOWDEBUG
    if (trial == 3 && !currentlyShowingRoute){
      // if (trial == 0){
        $('#game-container').addClass('inactive');
        $('#intro-complete').removeClass('inactive');
        isIntroduction = false;
        isMain = true;
        screen++;
        points = 350;
        // points = 19
        initializePointsBar();
        timeout = 1000;
      } else if (!willShowRoute) {
        finishTurn();
      }
    },4000);
    
}
  

function displayRoute(){
  if (keycode == 39){
  trial++;
  if( !currentlyShowingRoute) {
    currentlyShowingRoute = true;
    $('#not-optimal-3').addClass('inactive')
    initializeGameScreen();
    rocket.removeClass('animating');
    // trial--;
    $('.showing-points, .good, .bad, .neutral').removeClass('showing-points good bad neutral');
    $('#squares-wrapper').addClass('inactive');
    $('#game-container').removeClass('inactiveStrong')
    
    setTimeout(function(){
      $('#optimal-route').removeClass('inactive')
      currentMoves = moves[trial];
      setTimeout(function(){
        animateRouteDisplay(currentMoves)
      },1500)
    },500)}
}


function animateRouteDisplay(currentMoves){
  if(currentMoves.length != 0 && !rocket.hasClass('animating')) {
    if(!rocket.hasClass('animating')){
      rocket.addClass('animating')
      keycode = (currentMoves[0])
      if (keycode == jump){
        newPos = getTargetPosition(1);
      } else if (keycode == move){
        newPos = getTargetPosition(0);
      }
      $('.showing-points').removeClass('showing-points');
      $('.good, .bad, .neutral').removeClass('good bad neutral')
      
      rocket.animate({
        top:newPos[0],
        left:newPos[1],
    // }, 500, function(){
    }, 500, function(){
      rocket.attr('data-pos',newPos[2]);
      pointsColor()
      $('#planet'+(newPos[2]+1)).addClass('showing-points');
    });

      setTimeout(function(){
        
        // if (currentMoves.length == 0){

        // } else {
          currentMoves.shift()
          rocket.removeClass('animating');
          animateRouteDisplay(currentMoves)
        // }

        
      },1500)
    } 
  } else if (currentMoves.length == 0){
    rocket.removeClass('animating');
    $('#squares-wrapper').removeClass('inactive')
    currentlyShowingRoute = false;
    willShowRoute = false;
    optimalFound = false;
    transitionFromOptimalDisplay = true;
    var press = jQuery.Event("keydown");
    press.ctrlKey = false;
    press.which = 39;
    $('#game-container').addClass('inactiveStrong');
    $('#optimal-route').addClass('inactive')
    if(trial == 3){
      $('#game-container').addClass('inactive');
      $('#intro-complete').removeClass('inactive');
      isIntroduction = false;
      isMain = true;
      screen++;
      points = 1000;
      // points = 19
      initializePointsBar();
    } else {
      $( document ).trigger(press);
    }

  }
}

  // currentlyShowingRoute = false;
  // willShowRoute = false;

  optimalCounter = 0;
}

transitionFromOptimalDisplay = false;


function mainCallback (){
// if(trial == 5) {
//   pushDataMain();
// }
if(points <= 0){
  isMain = false;
  $(gameStage + ', #squares-wrapper').addClass('inactiveStrong');
  $('#game-over-main').removeClass('inactive');
  
  turnsLeft = 0
  experimentFinished = true;
  uploadResults();

} else if (((trial % 25 == 24) && trial <101)|| trial == lastTrial) {
// } else if (trial % 4 == 1 || trial == lastTrial) {
  displayBlockTransition();
  if(trial == lastTrial) {
    isMain = false;
    experimentFinished = true;
    recordData();
    uploadResults();
  }
} else{
  finishTurn();
}
};

// function trainCallback(){
//   // NOWDEBUG
//   if (trial == 19 || points <= 0) {
//     isTraining = false;
//     isMain = true;
//     points = 1000;
//     // points = 40;
//     initializePointsBar();
//     trial = -1;
//     $('#game-container').addClass('inactiveStrong');
//     element = (points <= 0) ? $('#main-intro-text'): $('#main-intro-text-gameover')
//     element.removeClass('inactive');
//     pushDataTrain();
//   } else {
//     finishTurn();
//   }
// };

function checkActionOptimality(){
matching = true;
for(i=0;i<=2;i++) {
  // console.log(keys, correctResponses[trial]);
  if(keys[i] != correctResponses[trial][i]){
    matching = false;
 }; 
}
keys = [];
return matching;
};


// SCREEN TRANSITION FUNCTIONS

function displayBlockTransition() {

if (trial == lastTrial) {
  $('#end-game').removeClass('inactive');
  // END GAME
} else {
  $('#game-container').addClass('inactiveStrong');
  $('#block-transition').removeClass('inactive');
}
blockTransition = true;
};

function hideBlockTransition() {

if ((trial % 25) == 24 && trial < 101) {
// if ((trial % 4) == 1 && trial < 100) {
  $('#block-transition').addClass('inactive');
  // $('#game-container').removeClass('inactiveStrong');
} else if (trial == lastTrial) {
  $('#main-transition-text').addClass('inactive');
  // END GAME
}
// } else {
//   $('#main-transition-text').addClass('inactive');
// }
blockTransition = false;
};

//////////////// HELPER FUNCTIONS ///////////////////////
function clearRocketStyle(pos){
rocket.attr('data-pos',pos);
rocket.removeAttr('style');
};


function displayWrongKey(element,action){
$('#game-container').addClass('inactiveStrong');
// $( element + " p").text(function (_, ctx) {
//   return ctx.replace("INSERT-" + action[0], alphabet[action[1]-65]);
// });
$(element).removeClass('inactive');
setTimeout(function(){
  $(element).addClass('inactive')
  $('#game-container').removeClass('inactiveStrong');
  wrongKey = false;
}, 1000);
};

function displayScore(element){
element.removeClass('inactive')
setTimeout(function(){
  element.addClass('inactive')
}, 500);
};

function choosePoints(){
if (keycode == 39) {
  return $('#score-clockwise');
} else {
  return $('#score-jump');
}
}


function transitionToMain(){
$('#planetNumbers').addClass('inactive');
points = 1000;
isIntroduction = false;
isMain = true;
$('#main-intro-text').removeClass('inactive');
$('#game-container').addClass('inactiveStrong');
$(gameStage + ', #squares-wrapper').removeClass('inactive');
};

function screenSwitch(add, remove){
  if(add != ''){
    $(add).addClass('inactive');
  }
  if (remove != ''){
    $(remove).removeClass('inactive');
  }
  screen++;
  // displayButton()
};

function updateClasses(element, add, classes){
  // console.log('in here bro')
  if (add) {
    $(element).addClass(classes);
  } else {
    $(element).removeClass(classes);
  }
}

function revertScreen(){
    console.log(screenSequence[screen][1])
    add = screenSequence[screen][1];
    remove = screenSequence[screen][0]; 
    if (screenSequence[screen].length > 2){
      updateClasses(screenSequence[screen][2], screenSequence[screen][4], screenSequence[screen][3])
    }
    screen = screen - 2;
    console.log("thinks it is screen: " + screen)
    console.log('add inactive to: ' + add + ' and active to ' + remove)
    screenSwitch(add, remove);
    // displayButton() 
};

function progressScreen(add, remove){
  if (keycode == 37 && screen != 0){
    console.log('current screen: ' + screen + ' and revrting to ' + (screen-1))
    revertScreen()
  } else {
    if (keycode == 39) {
      screenSwitch(add, remove);
    }
  }

};

// function goBack(){
//   if ($.inArray(screen,buttonScreens)+1){
//     $('.back').removeClass('inactive');
//   } else {
//     $('.back').addClass('inactive');

//   }
// }


function uploadResults(){
if(experimentFinished){
  pushDataMain()

  $.ajax({

      type: 'POST',
      url: '/save',
      data: {'data': JSON.stringify(mainData)},

      success: function() {
          console.log('success');
          document.location = '/next'
      },

      // Endpoint not running, local save
      error: function(err) {
        if (err.status == 400) { // this should happen first after 3h now!
          window.alert('server session timed out, you took way too long!')
        } else {
			// something unexpected happened
          window.alert('another unknown error:' + err.status)
        }
          // stopping experiment and forward page to /next
          document.location = '/next'     
          console.log("Error with POST" + err.status)
        }
  });
}
}

function selectKeybindings() {
not_unique = true
while(not_unique){
  jump = Math.round(Math.random() * (90 - 65) + 65);
  move = Math.round(Math.random() * (90 - 65) + 65);
  not_unique = move == jump
}

return [jump,move]
}


function debugUncertainty(yes){
$('#intro-1').addClass('inactive');
screen = 16
$('#jump-uncertainty-5').removeClass('inactive')
// $('#intro-1').removeClass('inactive')
$('#rocket, #pointBox, #planets, #points-wrapper').removeClass('inactive')
$('#game-container').addClass('inactiveStrong')
}

function gameOverResultsUpdate(){
  
  tl = 0
  $('#squares-wrapper div').each(function(i){
    tl = tl + !($('#square'+(i+1 )).hasClass('hideSquare'))
  })
  
  for (i=0;i<tl;i++){
    keys.push(NaN)  
    states.push(NaN)
    ps.push(NaN)
     
  }
  mainKeysArray.push(keys);
  states.unshift(mainRocketStart[trial]);
  mainStateArray.push(states);
  mainPointsArray.push(ps);
  rt.push(keyPress[0] - stimulusDisplay);
  rt.push(keyPress[1] - animationEnd[0]);
  console.log(keyPress, stimulusDisplay, animationEnd)
  // rt.push(NaN)
  rt.push(keyPress[2] - animationEnd[1])
  mainRTarray.push(rt);
  rt = []; 
  stimulusDisplay = [];
  keyPress = [];
  animationEnd = [];
  keys = [];
  states = [];
  ps =[];
 
}

function debugMain(yes){
if(yes){
  $('#intro-1').addClass('inactive')
  $('#rocket, #pointBox, #planets, #squares-wrapper, #points-wrapper, #main-intro-text ').removeClass('inactive')
  $('#game-container').addClass('inactiveStrong')
  console.log($('#intro-1').hasClass('inactive'))
  isIntroduction = false
  isTraining = false
  isMain = true
  points = 1000
} else{
  $('#intro-1').removeClass('inactive')
  $('#rocket, #pointBox, #planets, #squares-wrapper, #points-wrapper, #main-intro-text ').addClass('inactive')
  $('#game-container').removeClass('inactiveStrong')
  isIntroduction = true
  isTraining = false
  isMain = false
}
}

function debugTransition(yes){
$('#intro-1').addClass('inactive');
screen = 25
// progressScre en('#tip-3','#intro-practice-start');
$('#tip-3').removeClass('inactive')
// $('#intro-1').removeClass('inactive')
$('#rocket, #pointBox, #planets, #points-wrapper, #squares-wrapper').removeClass('inactive')
$('#game-container').addClass('inactiveStrong')
}

function debuggingAfterUncertainty(isDebugging) {
  if(isDebugging){
    screen = 23
    $('#tip-2').removeClass('inactive')
    $('#intro-1').addClass('inactive')
    
};

}
//////////////////////////////////////////////////////////
////////             PARAMETERS               ////////////
gameover = false;

data = {
main: 0,
train: 0
}

///////////////// COMMON VARIABLES //////////////////////
points = 1000;
isIntroduction = true;
// isTraining = false; 
isMain = false;

////////////// VARIABLES FOR INTRODUCTION //////////////// 
gameStage = '#rocket, #planets, #points-wrapper'
screen = 0;
practiceCounter = 0;
isReverting = false;

// NOWDEBUG
lastTrial = mainTurns.length - 1
// lastTrial = 5
////////////////////////////////////////////////////////

mainData = {
age: 0,
gender: 0,
group: 0,
keybinding: 1,
responses: {
  RT: 0,
  keys: 0
  },
states: 0,
points: 0,
planetConfigurations: 0,
conditions: {
  notrials:0,
  noise:0
},
noPatternTrainings: 0,
indexExp: indexExp,
labelsExp: labelsExp,
};

// trainData = {
//   age: 0,
//   gender: 0,
//   group: 0,
//   responses: {
//     RT: 0, 
//     keys: 0,
//   },
//   states: 0,
//   points: 0,
//   planetConfigurations: 0,
//   conditions: {
//     notrials: 0,
//     noise: 0
//   },
//   noPatternTrainings: 0
// }

screenSequence = {
1: ['#intro-1', '#intro-2'],
2: ['#intro-2', '#planets, #intro-planets'],
3: ['','#rocket, #p-top'],
4: ['#rocket, #planets, #intro-planets', '#intro-3'],
5: ['#intro-3', gameStage+', #intro-points'],
// 5: ['#intro-3', '#intro-4'],
// 6: ['#intro-4', gameStage+', #intro-points'],
6: [gameStage+', #intro-points', '#intro-4'],
7: ['#intro-4','#intro-5'], 
12: ['#flightPattern-1', '#flightPattern-2'],
14: ['#jump-uncertainty-2', '#jump-uncertainty-3'],
15: ['#jump-uncertainty-3', '#jump-uncertainty-4'],
16: ['#jump-uncertainty-4', '#jump-uncertainty-5'],
19: ['#planet-points', '#planet-points-2'],
20: ['#planet-points-2', '#turns', '#game-container','inactiveStrong', true],
21: ['#turns', '#turns-example, #squares-wrapper', '#game-container','inactiveStrong', true],
22: ['#turns-example', '#summary', '#game-container','inactiveStrong' ,false],
23: ['#summary', '#tip-1'],
24: ['#tip-1', '#tip-2'],
25: ['#tip-2','#tip-3'],
26: ['#tip-3','#intro-practice-start']

// 5: ['#intro-3', '#intro-4'], 
// 5: ['#intro-3', '#intro-4'], 
}

////////// VARIABLES FOR INTRODUCTION ///////////
// NUMBER GAME
minRightAnswers =17;
answersGuessed= 0;
testStarts = [1,2,3,4,5,6,2,5,1,6,3,4,3,6,4,1,5,2];
rightAnswers = [5,4,5,6,2,2,4,2,5,2,5,6,5,2,6,5,2,4];
numberGameCounter = 0;

// JUMP UNCERTAINTY

missProbLow = [0.2320, 0.7325, 0.9631, 0.6932, 0.8595, 0.8387, 0.0786, 0.0716, 0.0324, 0.9084, 0.6857, 0.0666];
missProbHigh = [0.9116, 0.6238, 0.7918, 0.4298, 0.5430, 0.4135, 0.0856, 0.7776, 0.4889, 0.0505, 0.5384, 0.0415];

points = 1000;
uncertaintyCounter = 0;

keysIntro = [];
/////////////////  GAMEPLAY PARAMETERS ///////////////////
last = 0;
trial = -1;
screenTransition = false;
blockTransition = false;

///////////////// DATA COLLECTION VARIABLES //////////////
experimentFinished = false;

ps = [];
mainRTarray = [];
mainKeysArray = [];
mainPointsArray = [];
mainStateArray = [];

// trainRTarray = [];
// trainKeysArray = [];
// trainPointsArray = [];
// trainStateArray = [];
inds = [];

states = [];
stimulusDisplay = [];
keyPress = [];
animationEnd = [];
keys = selectKeybindings()
rt = [];
// move = keys[0]
// jump = keys[1]
move = 77
jump = 89
moves = [[jump, move],[jump, move], [move, jump, move], [jump, jump, move]];
alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
keys = [];
doneAlready = false;
playing = false;  
//   clicked = true;
//   data.main = mainData;
//   data.train = trainData;



$( document ).ready(function() {
game = $('#game');
rocket = $('#rocket');
planets = $('#planets div');
squareClass= $('.square');
squaresWrapper = $('#squares-wrapper');

// debugMain(true)
// debugUncertainty(true)
// debugTransition(true)
// debuggingAfterUncertainty(true)
$( document ).keydown(function(event){
  
  keyPressTime = new Date();
  
  keycode = (event.keyCode ? event.keyCode : event.which);
  
  if (isIntroduction){
    if (screen == 0) {
      progressScreen('#intro-1', '#intro-2');
    } else if (screen == 1) { 
      progressScreen('#intro-2', '#planets, #intro-planets');
    } else if (screen == 2) {
      progressScreen('' , '#rocket, #p-top')
    } else if (screen == 3) {

      progressScreen('#rocket, #planets, #intro-planets', '#intro-3');

    } else if (screen == 4) {
      // $("#intro-4 p").text(function (_, ctx) {
        // ctx = ctx.replace("INSERT-MOVE", alphabet[move-65]);
        // ctx = ctx.replace('INSERT-JUMP', alphabet[jump-65])
        // return ctx
      // });
    progressScreen('#intro-3', gameStage+', #intro-points');
  } else if (screen == 5) {
    progressScreen(gameStage+', #intro-points', '#intro-4');
    } else if (screen == 6) {
    //   $("#intro-5 p").text(function (_, ctx) {
    //     return ctx.replace("INSERT-MOVE", alphabet[move-65]);
    // });
      progressScreen('#intro-4', '#intro-5');
    } else if (screen == 7) {
      if(keycode==39){
        initializePointsBar();
        assignPlanet([3,3,3,3,3,3])
      }
      isEnding = false;
      wrongKey = false;
      progressScreen('#intro-5', gameStage);
    } else if (screen == 8) {
      practiceMove(keycode);
      // $("#screen-jump-2 p").text(function (_, ctx) {
      //   return ctx.replace("INSERT-JUMP", alphabet[jump-65]);
      // });
    } else if (screen == 9) {
      progressScreen('#screen-jump-2', gameStage);
      clearRocketStyle(0); 
    } else if (screen == 10) {
      practiceJump(keycode);
      // $("#flightPattern-2 p").text(function (_, ctx) {
      //   return ctx.replace("INSERT-JUMP", alphabet[jump-65]);
      // });
    } else if (screen == 11) {
      if (!dispPattern) {
        progressScreen('#flightPattern-1', '#flightPattern-2');
      };
    // } else if (screen == 12) {
    //   // if (keycode == 37 && !doneAlready) {
    //     progressScreen('#flightPattern-1', '#flightPattern-2');
    //     // doneAlready = true;
    } else if (screen == 12){
      if( keycode == 37 && !playing && !isEnding){
        progressScreen('','');
      } else if (keycode == 39 && !playing && !isEnding) {
        playing = true;
        playNumberGame();
      } else if (playing && !isEnding) {
        playNumberGame();
      }
    } else if (screen == 13){
      progressScreen('#jump-uncertainty-2', '#jump-uncertainty-3');
    } else if (screen == 14){
      progressScreen('#jump-uncertainty-3', '#jump-uncertainty-4');
    } else if (screen == 15){
      // $("#jump-uncertainty-5 p").text(function (_, ctx) {
      //   return ctx.replace("INSERT-JUMP", alphabet[jump-65]);
      // });

      progressScreen('#jump-uncertainty-4', '#jump-uncertainty-5');
    } else if (screen == 16){
      if (keycode == 37 && !playing) {
        progressScreen('#jump-uncertainty-5', '#jump-uncertainty-6');
      } else if (keycode == 39 && !playing) {
        playing = true;
        learnLowUncertainty();
      } else if(playing){
        learnLowUncertainty();
      }
      // $("#jump-uncertainty-6 p").text(function (_, ctx) {
      //   return ctx.replace("INSERT-JUMP", alphabet[jump-65]);
      // });
    } else if ((screen == 17 && keycode == 39) || (screen == 17  && playing)) {
      playing = true;
      learnHighUncertainty();
    } else if (screen == 18) {
      progressScreen('#planet-points', '#planet-points-2');
    } else if (screen == 19){
      progressScreen('#planet-points-2', '#turns');
    } else if (screen == 20){
      clearRocketStyle(0);
      // assignPlanet(introPlanetColors);
      // $('#game-container').removeClass('inactiveStrong')
      // $("#summary p").text(function (_, ctx) {
      //   ctx = ctx.replace("INSERT-MOVE", alphabet[move-65]);
      //   ctx = ctx.replace('INSERT-JUMP', alphabet[jump-65])
      //   return ctx
      // });
      $('#game-container').removeClass('inactiveStrong')
      progressScreen('#turns', '#turns-example, #squares-wrapper');
    } else if (screen == 21){
      $('#game-container').addClass('inactiveStrong');
      progressScreen('#turns-example', '#summary');
    } else if (screen == 22){
      progressScreen('#summary', '#tip-1');
    } else if (screen == 23){
      progressScreen('#tip-1', '#tip-2');
    } else if (screen == 24){
      progressScreen('#tip-2','#tip-3');
    } else if (screen == 25){
      // $("#intro-practice-start p").text(function (_, ctx) {
      //   ctx = ctx.replace("INSERT-MOVE", alphabet[move-65]);
      //   ctx = ctx.replace('INSERT-JUMP', alphabet[jump-65])
      //   return ctx
      // });
      progressScreen('#tip-3','#intro-practice-start');
    } else if (screen == 26) {
      if (!currentlyShowingRoute){
        if (keycode == 37 && !playing && !willShowRoute){ // If reverting a screen
          progressScreen('', '') 
        } else if (keycode == 39 && !playing && !willShowRoute) {
          if(!transitionFromOptimalDisplay){
            $('#intro-practice-start').addClass('inactive');
          }
          transitionFromOptimalDisplay = false;
          optimalFound = false;
          finishTurn()
          playing = true
          screenTransition = true
        } else if (playing && !screenTransition){
          playTurn(introCallback);
        } else if (willShowRoute){
          displayRoute()
        };
      }
    }
  } else if (isMain) {
      if(screen == 27){
        screenSwitch('#intro-complete', '#main-intro-text');
        trial = -1;
        keyPress = []; stimulusDisplay = []; animationEnd = []
        mainRTarray = []; mainPointsArray = []; mainStateArray = []; mainKeysArray = [];

      } else {
        if (!$('#main-intro-text').hasClass('inactive') || !$('#main-intro-text-gameover').hasClass('inactive')) {
        // $('#game-container').removeClass('asteroids')
        $('#main-intro-text').addClass('inactive');
        keyPress = []; stimulusDisplay = []; animationEnd = []
        mainRTarray = []; mainPointsArray = []; mainStateArray = []; mainKeysArray = [];
        finishTurn();
        } else if(!blockTransition) {
        playTurn(mainCallback);
        } else {
        hideBlockTransition();
        finishTurn();
        }
      }
  }


  //////////////////////////
});
});
