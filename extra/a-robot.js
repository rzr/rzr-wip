AFRAME.registerComponent('robot', {
  schema: {
    torso: { type: 'number', default: 0},
    shoulder: { type: 'number', default: 0},
  },
  init: function() {
//    var top = document.createElement('a-entity');
//    top.setAttribute('rotation', '0 90 0');
    var torso = document.createElement('a-entity');
    torso.setAttribute('id', 'Torso');
    //var torsoBox = document.createElement('a-box');
    torso.setAttribute('geometry',
                       { primitive: 'box',
                         radius: .1
                       });
     
    torso.setAttribute('material', { color: '#F00' });
    //torsoBox.setAttribute('scale', '2 1 2');
    //torso.appendChild(torsoBox);
//    top.appendChild(torso);
//    this.el.appendChild(top);
    this.el.appendChild(torso);
//    this.top = top;
    console.log(this.el);
  },
  update: function() {
  }
});

console.log('# index.js');
