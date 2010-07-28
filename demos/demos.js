var initId = 0;
var world = createWorld();
var ctx = null;
var currBuffer = 0;

var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

function setupWorld(did) {
	if (!did) did = 0;
	world = createWorld();
	initId += did;
	initId %= demos.InitWorlds.length;
	if (initId < 0) initId = demos.InitWorlds.length + initId;
	demos.InitWorlds[initId](world);
}
function setupNextWorld() { setupWorld(1); }
function setupPrevWorld() { setupWorld(-1); }

var frames = 0;
var lastTime = (new Date()).getTime();
var lastFrameTime = (new Date()).getTime();
var stepSize = 1;
var delayAvg = 0;
var maxStepSize = 40;
var missedFrames = 11;
var targetFPS = 30;
var timeStep = 1.0/targetFPS;
var lastDelay = timeStep * 1000;
function step() {

	world.Step(timeStep, Math.round(stepSize));

  if ((delayAvg > 0) || (missedFrames > 5)) {
    drawWorld(world, ctx);
    missedFrames = 0;
    frames += 1;
    if ((targetFPS < 30) && (delayAvg > 10)) {
      targetFPS++;
      timeStep = 1/targetFPS;
    }
  } else {
    missedFrames += 1;
    if (missedFrames > 3) {
      targetFPS--;
      targetFPS = (targetFPS < 25) ? 25 : targetFPS;
      timeStep = 1/targetFPS;
    }
  }

  // double buffered svg : switch the buffers here
  // ctx.svg.change(ctx.buffers[currBuffer], {'visiblity': 'visible'});
  // currBuffer++;
  // currBuffer %= 2;
  // ctx.svg.change(ctx.buffers[currBuffer], {'visiblity': 'hidden'});


  var currTime = (new Date()).getTime();
  if ((currTime - lastTime) >= 1000) {
    jQuery('#fpsText').text(world.m_bodyCount + " bodies. " + frames);
    jQuery('#stepSize').text(stepSize.toFixed(1));

    lastTime = currTime;

    if (frames > (targetFPS + 2)) {
      stepSize+=0.1;
      stepSize = (stepSize > maxStepSize) ? maxStepSize : stepSize;
    } else if (frames < (targetFPS - 2)) {
      if ((targetFPS - frames) > 5) {
        stepSize-=2;
      } else {
        stepSize-=0.1;
      }
      stepSize = (stepSize < 1) ? 1 : stepSize;
    }

    jQuery('#delayVal').text((delayAvg / frames).toFixed(1));
    frames = 0;
    delayAvg = 0.001;
  } 
  var delay = (stepSize * timeStep * 1000) - (currTime - lastFrameTime);
  delay = (delay + lastDelay) / 2;
  lastDelay = delay;

  delayAvg += delay;
  lastFrameTime = currTime;
  
  setTimeout('step()', (delay > 0) ? delay : 0);
}

/*
function initBuffers(svgContext) {
  ctx.buffers[0] = svgContext.group('buffer1');
  // ctx.buffers[1] = svgContext.group('buffer2', {'visibility':'hidden'});
}
*/

function disableSelection(target) {
  if (typeof target.onselectstart!="undefined") //IE route
    target.onselectstart=function(){return false};

  else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
    target.style.MozUserSelect="none";

  else //All other route (ie: Opera)
    target.onmousedown=function(){return false};
}

function handleResize() {
	var canvasElm = jQuery('#canvas');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.offset().top);
	canvasLeft = parseInt(canvasElm.offset().left);
}

jQuery(window).load(function() {
	setupWorld();

	var canvasElm = jQuery('#canvas');
  handleResize();
  jQuery(window).resize(handleResize);
  disableSelection(canvasElm.get(0));

  // the first call initialises the svg
  // the second call fetches the handle
	canvasElm.svg({'onLoad':function() {
    ctx = canvasElm.svg('get');

    // ctx = {'svg':svgContext, 'buffers' : []};
    // initBuffers(svgContext);

    function clickPoint(event) {
      return {
        x: event.pageX || (event.clientX +
          (document.documentElement.scrollLeft || document.body.scrollLeft)),
        y: event.pageY || (event.clientY +
          (document.documentElement.scrollTop || document.body.scrollTop))
      };
    };

    jQuery('#canvas').click(function(e) {
      var position = clickPoint(e);
      if (Math.random() < 0.5) 
        demos.top.createBall(world, position.x - canvasLeft, position.y - canvasTop);
      else 
        createBox(world, position.x - canvasLeft, position.y - canvasTop, 10, 10, false);

      e.stopPropagation();
      return false;
    }).dblclick(function(e) {e.stopPropagation();});

    jQuery(window).keypress(function(e) {
      if (e.altKey || e.ctrlKey) {
        return
      }
      missedFrames = 11;
      ctx.clear();
      // initBuffers(svgContext);
      setupPrevWorld();
      return false;
    });

    step();
  }});
});
