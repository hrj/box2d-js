/*
* Copyright (c) 2010 HRJ http://lavadip.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked, and must not be
* misrepresented the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/





var b2SpringJointDef = function(a_body1, a_body2, a_strength) {
  // The constructor for b2JointDef
  this.type = b2Joint.e_springJoint;
  this.userData = null;
  this.body1 = a_body1;
  this.body2 = a_body2;
  this.collideConnected = true;
  //

  // initialize instance variables for references
  this.anchorPoint1 = new b2Vec2();
  this.anchorPoint2 = new b2Vec2();
  this.strength = a_strength;
};

Object.extend(b2SpringJointDef.prototype, b2JointDef.prototype);
Object.extend(b2SpringJointDef.prototype, 
{
	initialize: function(a_body1, a_body2, a_strength)
	{
		// The constructor for b2JointDef
		this.type = b2Joint.e_springJoint;
		this.userData = null;
		this.body1 = a_body1;
		this.body2 = a_body2;
		this.collideConnected = true;
		//

		// initialize instance variables for references
		this.anchorPoint1 = new b2Vec2();
		this.anchorPoint2 = new b2Vec2();
    this.strength = a_strength;
	},

	anchorPoint1: null,
	anchorPoint2: null,
  strength : 0
});

