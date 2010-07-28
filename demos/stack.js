demos.stack = {};
demos.stack.initWorld = function(world) {
	var sd = new b2BoxDef();
	var bd = new b2BodyDef();
	bd.AddShape(sd);
	sd.density = 1.0;
	sd.friction = .5;
  var size = 15;
	sd.extents.Set(size, size);

	var i;
	for (i = 0; i < 8; i++) {
		bd.position.Set(600/2-150, (250-i*(size + 1)*2));
		world.CreateBody(bd);
		bd.position.Set(600/2, (250-i*(size + 1)*2));
		world.CreateBody(bd);
		bd.position.Set(600/2+150+Math.random()*2-i, (250-i*(size + 1)*2));
		world.CreateBody(bd);
	}
}
demos.InitWorlds.push(demos.stack.initWorld);


