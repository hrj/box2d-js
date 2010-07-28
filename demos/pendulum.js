demos.pendulum = {};
demos.pendulum.initWorld = function(world) {
	var i;
	var ground = world.GetGroundBody();
	var jointDef = new b2RevoluteJointDef();
	var L = 170;
  var spacing = 40;
	for (i = 0; i < 4; i++) {
		jointDef.anchorPoint.Set(250 + spacing * i, 0);
		jointDef.body1 = ground;
		jointDef.body2 = createBall(world, 250 + spacing * i, L);
		world.CreateJoint(jointDef);
	}
	jointDef.anchorPoint.Set(250 - spacing, 0);
	jointDef.body1 = ground;
	jointDef.body2 = createBall(world, 250 - spacing - L, 0);
	world.CreateJoint(jointDef);
}
demos.InitWorlds.push(demos.pendulum.initWorld);


