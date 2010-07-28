/* Copyright 2010 HRJ http://lavadip.com
 * */

demos.drop = {};

// Idea from http://cowboyprogramming.com/2007/01/05/blob-physics/

demos.drop.createParticle = function (world, x, y, radius) {
  var ballSd = new b2CircleDef();
  ballSd.density = 1.0;
  ballSd.radius = radius;
  ballSd.restitution = 0.6;
  ballSd.friction = 0.1;
  var ballBd = new b2BodyDef();
  ballBd.AddShape(ballSd);
  ballBd.position.Set(x,y);
  return world.CreateBody(ballBd);
};

demos.drop.initWorld = function(world) {

  /*
  var body1 = createBox(world, 40, 30, 5, 5, false);
  var body2 = createBox(world, 80, 10, 5, 5, false);
  */
  var body1 = demos.drop.createParticle(world, 90,30, 10);
  var body2 = demos.drop.createParticle(world, 130,40, 10);


  var spring = new b2DistanceJointDef(body1, body2, 10);

  spring.body1 = body1;
  spring.body2 = body2;
  spring.anchorPoint1 = new b2Vec2(90,30);
  spring.anchorPoint2 = new b2Vec2(130,40);
  world.CreateJoint(spring);

  createDrop(320, 50, 12, 3);
  // createDrop(400, 100, 16, 4);

  function createDrop(centerx, centery, segments, radius) {
    var centralBody = demos.drop.createParticle(world, centerx, centery, radius);

    var innerBodies = [];
    var outerBodies = [];
    var R1 = 2*radius*segments / Math.PI;
    var R2 = R1 + radius*4;

    for (var i = segments; i--;) {
      var angle = 2*Math.PI/segments * i;
      var x = Math.sin(angle);
      var y = Math.cos(angle);

      innerBodies[i] = demos.drop.createParticle(world, centerx + x*R1, centery + y*R1, radius);
      var spring = new b2SpringJointDef(centralBody, innerBodies[i], 60);

      spring.anchorPoint1 = centralBody.m_position;
      spring.anchorPoint2 = innerBodies[i].m_position;
      world.CreateJoint(spring);

      outerBodies[i] = demos.drop.createParticle(world, centerx + x*R2, centery + y*R2, radius);
      var spring = new b2SpringJointDef(centralBody, innerBodies[i], 60);

      spring.anchorPoint1 = centralBody.m_position;
      spring.anchorPoint2 = outerBodies[i].m_position;
      world.CreateJoint(spring);
    }

    for (var i = segments; i--;) {
      var next = (i + 1) % segments;

      var spring = new b2SpringJointDef(outerBodies[i], outerBodies[next], 60);
      spring.anchorPoint1 = outerBodies[i].m_position;
      spring.anchorPoint2 = outerBodies[next].m_position;
      world.CreateJoint(spring);

      var spring = new b2SpringJointDef(innerBodies[i], innerBodies[next], 30);
      spring.anchorPoint1 = innerBodies[i].m_position;
      spring.anchorPoint2 = innerBodies[next].m_position;
      world.CreateJoint(spring);

      var spring = new b2SpringJointDef(innerBodies[i], outerBodies[i], 30);
      spring.anchorPoint1 = innerBodies[i].m_position;
      spring.anchorPoint2 = outerBodies[i].m_position;
      world.CreateJoint(spring);

      var spring = new b2SpringJointDef(innerBodies[i], outerBodies[next], 30);
      spring.anchorPoint1 = innerBodies[i].m_position;
      spring.anchorPoint2 = outerBodies[next].m_position;
      world.CreateJoint(spring);
    }
  }

  // create some obstructions
	demos.top.createPoly(world, 50, 250, [[0, 0], [150, 40], [0, 40]], true);
	demos.top.createPoly(world, 370, 150, [[0, 0], [0, 30],[-200, 30]], true);
	demos.top.createPoly(world, 300, 330, [[0, 0], [0, 20], [-100, 20]], true);

};

demos.InitWorlds.push(demos.drop.initWorld);
