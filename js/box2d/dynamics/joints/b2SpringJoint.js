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



// C = norm(p2 - p1) - L
// u = (p2 - p1) / norm(p2 - p1)
// Cdot = dot(u, v2 + cross(w2, r2) - v1 - cross(w1, r1))
// J = [-u -cross(r1, u) u cross(r2, u)]
// K = J * invM * JT
//   = invMass1 + invI1 * cross(r1, u)^2 + invMass2 + invI2 * cross(r2, u)^2

var b2SpringJoint = function(def) {
  // The constructor for b2Joint
  // initialize instance variables for references
  this.m_node1 = new b2JointNode();
  this.m_node2 = new b2JointNode();
  this.m_type = def.type;
  this.m_prev = null;
  this.m_next = null;
  this.m_body1 = def.body1;
  this.m_body2 = def.body2;
  this.m_collideConnected = def.collideConnected;
  this.m_islandFlag = false;
  this.m_userData = def.userData;
  this.m_strength = def.strength;
  this.m_decay = 1.0;

  this.m_localAnchor1 = new b2Vec2();
  this.m_localAnchor2 = new b2Vec2();
  this.m_worldAnchor1 = new b2Vec2();
  this.m_worldAnchor2 = new b2Vec2();
  this.m_diff = new b2Vec2();

  var tMat;
  var tX;
  var tY;
  tMat = this.m_body1.m_R;
  tX = def.anchorPoint1.x - this.m_body1.m_position.x;
  tY = def.anchorPoint1.y - this.m_body1.m_position.y;
  this.m_localAnchor1.x = tX*tMat.col1.x + tY*tMat.col1.y;
  this.m_localAnchor1.y = tX*tMat.col2.x + tY*tMat.col2.y;
  tMat = this.m_body2.m_R;
  tX = def.anchorPoint2.x - this.m_body2.m_position.x;
  tY = def.anchorPoint2.y - this.m_body2.m_position.y;
  this.m_localAnchor2.x = tX*tMat.col1.x + tY*tMat.col1.y;
  this.m_localAnchor2.y = tX*tMat.col2.x + tY*tMat.col2.y;
  

  tX = def.anchorPoint2.x - def.anchorPoint1.x;
  tY = def.anchorPoint2.y - def.anchorPoint1.y;
  this.m_length = Math.sqrt(tX*tX + tY*tY);
  this.previousLength = this.m_length;
};

Object.extend(b2SpringJoint.prototype, b2Joint.prototype);
Object.extend(b2SpringJoint.prototype, 
{
	//--------------- Internals Below -------------------

  // Trying to emulate Hooke's law for springs
	PrepareVelocitySolver: function(){
    var a1 = this.m_worldAnchor1,
        a2 = this.m_worldAnchor2;
		a1.SetV(this.m_localAnchor1);
    a1.MulM(this.m_body1.m_R);
    a1.Add(this.m_body1.m_position);
		a2.SetV(this.m_localAnchor2);
    a2.MulM(this.m_body2.m_R);
    a2.Add(this.m_body2.m_position);

    var diff = this.m_diff;
    diff.SetV(a2);
    diff.Subtract(a1);

    var diffLength = diff.Length();
    if (diffLength > this.m_length) {
      if (diffLength > this.previousLength) {
        diff.Multiply(this.m_strength);
        decay = 1;
      } else {
        decay = Math.sqrt(decay);
        diff.Multiply(this.m_strength * decay);
      }
      this.previousLength = diffLength;
      if (diff.Length() > 2) {
        this.m_body1.ApplyImpulse(diff, a1);
        this.m_body2.ApplyImpulse(diff.Negative(), a2);
      }
    }
	},



	SolveVelocityConstraints: function(step){

	},

	SolvePositionConstraints: function(){

	},

	GetReactionForce: function(invTimeStep)
	{
		var F = new b2Vec2(0, 0);
		return F;
	},

	GetReactionTorque: function(invTimeStep)
	{
		//NOT_USED(invTimeStep);
		return 0.0;
	},

  GetAnchor1 : function() {
    return this.m_localAnchor1;
  },
  GetAnchor2 : function() {
    return this.m_localAnchor2;
  },

	m_localAnchor1: null,
	m_localAnchor2: null,
  m_worldAnchor1 : null,
  m_worldAnchor2 : null,
  m_diff : null,
	m_length: null,
  m_strength: 0
});

