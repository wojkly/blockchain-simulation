import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import { Block } from '../model/block';

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.scss']
})
export class BlockchainComponent implements OnInit {

  cy = cytoscape({});

  constructor() { }

  ngOnInit(): void {
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'nodes',
          style: {
            'width': '100px',
            'height': '100px',
            'background-color': 'green',
            'shape': 'rectangle',
            'label': (node: any) => {
              return node.data("block").id;
            }
          },
        },
        {
          selector: 'edges',
          style: {
            'width': 3,
            'line-color': 'red',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          }
        }
      ]
    });
    
    this.cy.add({
      data: {block: new Block(1, 1)}
    });
    this.cy.add({
      data: {block: new Block(2, 2)}
    });

    this.cy.nodes().on('click', (event) => {
      console.log(event);
    });
    this.cy.layout({name: 'circle'}).run();
    

  }

}
