import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import { interval } from 'rxjs';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  bfs: any;

  constructor() { }

  cy = cytoscape({});

  counter = 0;

  ngOnInit(): void {
    this.cy = cytoscape({

      container: document.getElementById('cy'), // container to render in

      boxSelectionEnabled: false,
      autounselectify: true,

      elements: { // list of graph elements to start with
        nodes: [
          { // node a
            data: { id: 'a' },  style: {'background-image': 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/7a/Diamond_Pickaxe_JE2_BE2.png',
            'background-fit': 'contain', 'background-opacity': 0, 'background-clip': 'none', 'shape': 'rectangle'}, 
          },
          { // node b
            data: { id: 'b' }, style: {'background-color': 'blue', 'shape': 'rectangle'}
          },
          { data: { id: 'c' } },
          { data: { id: 'd' } },
          { data: { id: 'e' } },
        ],
        edges: [
          { // edge ab  
            data: { id: 'ab', source: 'a', target: 'b' }, style: {'line-color': 'green', 'target-arrow-color': 'green'}
          },
          { data: { id: 'be', source: 'b', target: 'e' } },
          { data: { id: 'bc', source: 'b', target: 'c' } },
          { data: { id: 'ce', source: 'c', target: 'e' } },
          { data: { id: 'cd', source: 'c', target: 'd' } },
          { data: { id: 'de', source: 'd', target: 'e' } }
        ]
      },

      style: [ // the stylesheet for the graph
        {
          selector: 'nodes',
          style: {
            'width': '100px',
            'height': '100px',
            'background-color': '#43fsdf',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edges',
          style: {
            'width': 3,
            'line-color': '#dsd1aa3',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          }
        },
        {
          selector: '.bfs',
          style: {
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': 0.5
          }
        }
      ],

      layout: {
        name: 'grid',
        directed: true,
        padding: 10,
        roots: ['#a']
      }

    });

    this.cy.nodes().on('click', function(e){
      var ele = e.target;
      console.log('clicked ' + ele.id());
    });
    
    this.bfs = this.cy.elements().bfs({root: '#a', visit: function(){}, directed: true});

    
    // this.cy.nodes()
    //   .animate({style: { 'background-color': 'blue' }}, {
    //   duration: 1000
    // }).delay( 1000 )
    // .animate({style: { 'background-color': 'yellow' }
    // });
    // this.cy.nodes().animate({
    //   position: { x: 100, y: 100 },
    //   style: { backgroundColor: 'red' }
    // }, {duration: 1000});
    // this.cy.elements().floydWarshall({
    //   weight: function (edge: cytoscape.EdgeCollection): number {
    //     throw new Error('Function not implemented.');
    //   }
    // })
  }

  runBfs(){
     if( this.counter < this.bfs.path.length ){
       this.bfs.path[this.counter].addClass('bfs');
       this.counter++;
     }
  }

  startBfs(){
    interval(1000).subscribe(() => {
      this.runBfs();
    });
  }
  
  add(){
    this.cy.add([
      { group: 'nodes', data: { id: 'n0' }, position: { x: 100, y: 100 } },
      { group: 'nodes', data: { id: 'a' }, position: { x: 200, y: 200 } },
      { group: 'edges', data: { id: 'e0', source: 'n0', target: 'a' } }
    ]);
   console.log(this.cy.getElementById('n0').data('id'))
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