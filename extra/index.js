AFRAME.registerComponent('robot', {
  schema: {
    Torso: { type: 'number', default: 0},
    Shoulder: { type: 'number', default: 0},
    Arm: { type: 'number', default: 0},
    Hand: { type: 'number', default: 0},
  },

  init: function() {
    var torso = document.createElement('a-entity');
    torso.setAttribute('id', 'Torso');
    torso.setAttribute("roration", `0 ${this.data.torsoAngle} 0`);
    var torsoBox = document.createElement('a-box');
    torsoBox.setAttribute('material', { color: '#000' });
    torsoBox.setAttribute('scale', "2 1 2");
    torso.appendChild(torsoBox);
    this.el.appendChild(torso);

    var shoulder = document.createElement('a-entity');
    shoulder.setAttribute('id', 'Shoulder');
    shoulder.setAttribute('position', "0 .5 0");
    var shoulderJunction = document.createElement('a-cylinder');
    shoulderJunction.setAttribute('scale', ".4 .8 .4");
    shoulderJunction.setAttribute('rotation', "0 0 90");
    shoulderJunction.setAttribute('material', { color: '#AFA' });
    shoulder.appendChild(shoulderJunction);
    
    var shoulderBox = document.createElement('a-box');
    shoulderBox.setAttribute('material', { color: '#0F0' });
    shoulderBox.setAttribute('scale', ".7 4 .7");
    shoulderBox.setAttribute('position', "0 2 0");
    shoulder.appendChild(shoulderBox);
    torso.appendChild(shoulder);

    var arm = document.createElement('a-entity');
    arm.setAttribute('id', 'Arm');
    arm.setAttribute('position', "0 4 0");
    var armJunction = document.createElement('a-cylinder');
    armJunction.setAttribute('scale', ".4 .71 .4");
    armJunction.setAttribute('rotation', "0 0 90");
        arm.appendChild(armJunction);
    var armBox = document.createElement('a-box');
    armBox.setAttribute('material', { color: '#00F' });
    armBox.setAttribute('scale', ".5 3 .5");
    armBox.setAttribute('position', "0 1.5 0");
    arm.appendChild(armBox);
    shoulder.appendChild(arm);

    var hand = document.createElement('a-entity');
    hand.setAttribute('position', "0 4 0");
    var handJunction = document.createElement('a-cylinder');
    handJunction.setAttribute('material', { color: '#0FF' });
    handJunction.setAttribute('scale', ".4 .5 .4");
    handJunction.setAttribute('position', "0 -1 0");
    hand.appendChild(handJunction); //TODO
    //palm.setAttribute('scale', '5 3 .5');

    var palm = document.createElement('a-torus');
    palm.setAttribute('arc', "180");
    palm.setAttribute('rotation', '0 0 90');
    palm.setAttribute('radius-tubular', '.1');
    palm.setAttribute('radius', '1');
    palm.setAttribute('material', { color: '#43A367'});

    var nails = document.createElement('a-box');
    nails.setAttribute('position', '0 1 0');
    nails.setAttribute('scale', '.1 .6 .6');
    nails.setAttribute('color', '#43A367');
    hand.appendChild(palm);

    var handEntity = document.createElement('a-entity');
    handEntity.setAttribute('id', 'Hand');
    var thumb = document.createElement('a-torus');
    thumb.setAttribute('arc', '180');
    thumb.setAttribute('radius', '1');
    thumb.setAttribute('radius-tubular', '.09');
    thumb.setAttribute('material', { color: '#F00'});
    thumb.setAttribute('rotation', "0 0 180");
    //var nail = document.createElement('a-box');
    handEntity.appendChild(thumb);
    hand.appendChild(handEntity);
    arm.appendChild(hand);
    this.hand = handEntity;
  },
  update: function(old) {
    var properties = this.data;
    for (var property of Object.keys(properties)) {
      var rotation = [ 0, 0, 0];
      switch(property) {
      case "Torso":
        rotation[1] = properties[property];
        break;
      case "Hand":
        rotation[2] = properties[property];
        break;
      default:
        rotation[0] = properties[property];
        break;
      }
      var el = document.getElementById(property);
      if (!el || !el.object3D)
        throw "Null: " + property;

      el.object3D.rotation.set(
        THREE.Math.degToRad(rotation[0]),
        THREE.Math.degToRad(rotation[1]),
        THREE.Math.degToRad(rotation[2]))
    }
  },
  change: function(properties) {
    console.log(properties);
  }

});

console.log('# index.js');
