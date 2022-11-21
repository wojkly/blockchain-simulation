import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import { tap } from 'rxjs';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { VisualisationService } from 'src/app/services/visualisation.service';
import { Block } from '../model/block';
import { Graph } from '../model/graph';
import { Node } from '../model/node';
import { NodeType } from '../nodeType';


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

  private node?: Node;

  constructor(
    private blockchainService: BlockchainService,
    private visualisationService: VisualisationService
  ) { }

  public onValChange(val: string) {
    this.toggleButtonValue = val;
    this.cleanHighlighting();
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
                if (node.data("block").id == -1) return "root";
                else return "block " + node.data("block").id;
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

    this.visualisationService.getGraph()
      .pipe(
        tap((res) => {
          let g = res.graph;
          this.cy.remove('nodes');
          this.cy.remove('edges');
          // console.log(g)
          this.node = Array.from(g.nodes.values()).filter((value, index) => value.nodeType == NodeType.Full)[0];

          // console.log(this.node)
          this.createBlockchainGraph();
          this.cy.nodes().on('click', (event) => {
            // console.log(event);
          });
          this.cy.layout({name: 'breadthfirst', directed: true}).run();
        })
      ).subscribe();
    // this.createBlockchain();


    // this.blockchainService.get()
    //   .pipe(
    //     tap((g) => {
    //       console.log(g);
    //       // tutaj docelowo blockchainService powinien zwracać zaktualizowany graf (albo nowe bloki)
    //     })
    //   ).subscribe()
  }

  private changeProtocol() {

    let pathToLastBlock;
    this.cleanHighlighting();
    // console.log(this.cy.nodes().classes())

    if (this.toggleButtonValue != DEFAULT) {
      var dijkstra = this.cy.elements().dijkstra({
        root: '#-1'
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

        pathToLastBlock = dijkstra.pathTo( this.cy.$(lastBlockId) );
        this.highlightPath(pathToLastBlock);

      } else {
        const max = this.cy.nodes().max( function(node: any) {
          return node.data('block').weight;
        });
        pathToLastBlock = dijkstra.pathTo(max.ele);
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

  createBlockchainGraph() {
    let visited = new Set();
    let queue: number[] = new Array<number>();
    visited.add(-1);
    queue.push(-1);
    let edgeId = 0;

    this.cy.add({
      group: 'nodes',
      data: {id: '-1', block: this.node?.blockChain}
    });

    while (queue.length > 0) {
      const v = queue.shift();
      // console.log(v)
      if (!v) break;

      let b = this.node?.blockChainMap.get(v);
      if (!b) break;

      for (let child of b.children) {
        // console.log('iter: ' + child.id)
        if (!visited.has(child.id)) {
          // console.log('visiting: ' + child.id )
          visited.add(child.id);
          queue.push(child.id);
          // console.log(this.cy.nodes())

          this.cy.add({
            group: 'nodes',
            data: {id: child.id.toString(), block: child}
          });

          this.cy.add({
            group: 'edges',
            data: {id: 'edge_' + edgeId.toString(), source: b.id.toString(), target: child.id.toString()}
          });
          edgeId++;
        }
      }
    }
  }
}
