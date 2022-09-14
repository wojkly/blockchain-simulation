import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
var cy = cytoscape({

  container: document.getElementById('cy'), // container to render in

  elements: [ // list of graph elements to start with
    { // node a
      data: { id: 'a' },  style: {'background-color': 'red'}
    },
    { // node b
      data: { id: 'b' }, style: {'background-color': 'blue'}
    },
    { // edge ab
      data: { id: 'ab', source: 'a', target: 'b' }, style: {'line-color': 'green', 'target-arrow-color': 'green',}
    }
  ],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }

});

cy.add([
  { group: 'nodes', data: { id: 'n0' }, position: { x: 100, y: 100 } },
  { group: 'nodes', data: { id: 'a' }, position: { x: 200, y: 200 } },
  { group: 'edges', data: { id: 'e0', source: 'n0', target: 'a' } }
]);
  }
}

//JSON BASIC

// var cy = cytoscape({
//   container: document.getElementById('cy'),

//   elements: {
//     nodes: [
//       {
//         data: { id: 'a' }
//       },

//       {
//         data: { id: 'b' }
//       }
//     ],
//     edges: [
//       {
//         data: { id: 'ab', source: 'a', target: 'b' }
//       }
//     ]
//   },

//   layout: {
//     name: 'grid',
//     rows: 1
//   },

//   // so we can see the ids
//   style: [
//     {
//       selector: 'node',
//       style: {
//         'label': 'data(id)'
//       }
//     }
//   ]
// });

// cy.add([
//   { group: 'nodes', data: { id: 'n0' }, position: { x: 100, y: 100 } },
//   { group: 'nodes', data: { id: 'a' }, position: { x: 200, y: 200 } },
//   { group: 'edges', data: { id: 'e0', source: 'n0', target: 'a' } }
// ]);

//JAKIES Z FOREM
// var cy = cytoscape({
//   container: document.getElementById('cy'),
//   elements: {
//     nodes: [
//       {
//         data: { id: 'a' }
//       },

//       {
//         data: { id: 'b' }
//       }
//     ],
//     edges: [
//       {
//         data: { id: 'ab', source: 'a', target: 'b' }
//       }
//     ]
//   },
// });
// for (var i = 0; i < 10; i++) {
//   cy.add({
//       data: { id: 'node' + i },
//       }
//   );
//   var source = 'node' + i;
//   cy.add({
//       data: {
//           id: 'edge' + i,
//           source: source,
//           target: (i % 2 == 0 ? 'a' : 'b')
//       }
//   });
// }

// cy.layout({
//   name: 'circle'
// }).run();