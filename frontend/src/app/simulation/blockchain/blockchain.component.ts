import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import { tap } from 'rxjs';
import { VisualisationService } from 'src/app/services/visualisation.service';
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
  id2tip: any = {};

  public toggleButtonValue: string = "default";
  public fullNodes: Node[] = [];
  public selectedNodeId: string = "default";

  private node?: Node;

  constructor(
    private visualisationService: VisualisationService
  ) { }

  public onValChange(val: string) {
    this.toggleButtonValue = val;
    this.cleanHighlighting();
    this.changeProtocol();
  }

  public onNodeChange(val: string) {
    this.selectedNodeId = val;
    this.cleanHighlighting();
    this.refresh();
  }

  ngOnInit(): void {
    this.refresh()
  }

  refresh(): void {
    this.cy.destroy();
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'node',
          style: {
            'width': '100px',
            'height': '100px',
            'shape': 'round-rectangle',
            'background-color': '#7fcdcd',

            'label': (node: any) => {
                if (node.data("block").id == -1) return "root";
                else return "block " + node.data("block").id;
            }
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'curve-style': 'bezier',
          }
        },
        {
          selector: '.highlighted',
          style: {
            'line-color': '#ff80df',
            'border-width': '3px',
            'border-color': '#ff80df'
          }
        }
      ]
    });

    this.visualisationService.getGraph()
      .pipe(
        tap((res) => {
          let g = res.graph;
          this.cy.remove('node');
          this.cy.remove('edge');

          this.fullNodes = Array.from(g.nodes.values()).filter((value, index) => value.nodeType == NodeType.Full);
          if (this.selectedNodeId === "default") this.node = this.fullNodes[0];
          else this.node = this.fullNodes.find(x => x.id.toString() == this.selectedNodeId);

          this.createBlockchainGraph();
          this.makeTooltips();
          this.cy.nodes().on('click', (event) => {
            this.id2tip[event.target.id()].show()
          });
          this.cy.layout({name: 'breadthfirst', directed: true}).run();
        })
      ).subscribe();
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
    this.cy.edges().forEach(n => {
      n.removeClass('highlighted')
    });
  }

  private createBlockchainGraph() {
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
      if (!v) break;

      let b = this.node?.blockChainMap.get(v);
      if (!b) break;

      for (let child of b.children) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          queue.push(child.id);

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

  private makeTooltips() {
    this.cy.nodes().forEach((block: any) => {
      let ref = block.popperRef();
      this.id2tip[block.id()] = tippy(document.createElement('div'), {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: 'manual',
        placement: 'bottom',
        content: () => {
          let content = document.createElement('div');
          content.setAttribute('style', 'font-size:1em; padding-top: 2vh');
          if (block._private.data.id === '-1') content.innerHTML = `Root`;
          else content.innerHTML = `Mined by: ${block._private.data.block._minedBy}`;
          return content;
        }
      });
    });
  }

}
