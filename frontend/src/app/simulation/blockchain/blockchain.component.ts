import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import { tap } from 'rxjs';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { VisualisationService } from 'src/app/services/visualisation.service';
import { Block } from '../model/block';
import { Graph } from '../model/graph';


export const LONGEST_CHAIN = "longestChain"
export const GHOST = "GHOST";
export const DEFAULT = "default";


@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.scss']
})
export class BlockchainComponent implements OnInit {

  cy = cytoscape({});

  public toggleButtonValue: string = "default";

  constructor(private blockchainService: BlockchainService) { }

  public onValChange(val: string) {
    this.toggleButtonValue = val;
    this.cleanHighlighting();
    console.log(this.cy.nodes().classes())
    this.changeProtocol();
  }

  ngOnInit(): void {
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'nodes',
          style: {
            'width': '100px',
            'height': '100px',
            'shape': 'rectangle',
            'background-color': 'blue',
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
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': 'black'
          }
        }
      ]
    });

    
    this.createBlockchain();

    this.cy.nodes().on('click', (event) => {
      console.log(event);
    });
    this.cy.layout({name: 'breadthfirst', directed: true}).run();

    
    this.blockchainService.get()
      .pipe(
        tap((g) => {
          console.log(g);
          // tutaj docelowo blockchainService powinien zwracać zaktualizowany graf (albo nowe bloki)
        })
      ).subscribe()
    
  }

  private changeProtocol() {

    this.cleanHighlighting();
    console.log(this.cy.nodes().classes())

    if (this.toggleButtonValue != DEFAULT) {
      var dijkstra = this.cy.elements().dijkstra({
        root: '#root'
      });

      if (this.toggleButtonValue == LONGEST_CHAIN) {
        // teoretycznie to można zrobić tak jak GHOST czyli max po distance (ale nie zapisujemy distance)

        var leaves = this.cy.nodes().leaves();
        let maxChainLength = 0;
        var lastBlockId = '';

        for(let i = 0; i < leaves.length; i++) {
          let chainLenght = dijkstra.distanceTo(this.cy.$('#' + leaves[i].id()))
          if (chainLenght > maxChainLength) {
            maxChainLength = chainLenght;
            lastBlockId = '#' + leaves[i].id();
          }
        }
  
        var pathToLastBlock = dijkstra.pathTo( this.cy.$(lastBlockId) );
        this.highlightPath(pathToLastBlock);

      } else { 
        var max = this.cy.nodes().max( function(node: any) {
          return node.data('block').weight;
        });
        var pathToLastBlock = dijkstra.pathTo(max.ele);
        this.highlightPath(pathToLastBlock);
      }

    }
  }

  private highlightPath(path: cytoscape.Collection): void {
    for(let i = 0; i < path.length; i++) {
      path[i].addClass('highlighted');
    }
  }

  private cleanHighlighting(): void {
    this.cy.nodes().forEach(n => {
      n.removeClass('highlighted')
    });
  }

  // do testowania i początkowej wizualizacji
  // potem zamienić na blockchainService
  private createBlockchain() {
    // nodes
    this.cy.add({
      group: 'nodes',
      data: {id: 'root', block: new Block(0, 0)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n1', block: new Block(1, 1, 1)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n2', block: new Block(2, 2, 2)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n3', block: new Block(3, 3, 2)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n4', block: new Block(4, 4, 3)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n5', block: new Block(5, 5, 4)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n6', block: new Block(6, 6, 4)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n7', block: new Block(7, 7, 4)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n8', block: new Block(8, 8, 6)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n9', block: new Block(9, 9, 5)}
    });
    this.cy.add({
      group: 'nodes',
      data: {id: 'n10', block: new Block(10, 10, 6)}
    });

    // edges 
    this.cy.add({
      group: 'edges',
      data: {id: 'e0', source: 'root', target: 'n1'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e1', source: 'n1', target: 'n2'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e2', source: 'n1', target: 'n3'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e3', source: 'n2', target: 'n4'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e4', source: 'n4', target: 'n5'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e5', source: 'n3', target: 'n6'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e6', source: 'n3', target: 'n7'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e7', source: 'n6', target: 'n8'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e8', source: 'n5', target: 'n9'}
    });
    this.cy.add({
      group: 'edges',
      data: {id: 'e9', source: 'n6', target: 'n10'}
    });

  }

}
