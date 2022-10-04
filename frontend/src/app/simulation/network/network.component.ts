import {Component, OnInit} from '@angular/core';
import {tap} from "rxjs";
import {VisualisationService} from "../../services/visualisation.service";
import {Graph} from "../model/graph";
import * as cytoscape from 'cytoscape';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  count1 = 0;
  count2 = 0;

  cy = cytoscape({});

  constructor(private visualisationService: VisualisationService) {
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
            'background-color': function(node: any) {
              let nodeType = node.data("value.type");
              switch (nodeType) {
                case 0:
                  return `red`;
                case 1:
                  return `green`;
                case 2:
                  return `orange`;
                case 3:
                  return `brown`;
                default:
                  return `blue`;
              }
            },
            'label': function(node: any) {
              return `ID: ${node.data("id")}, Mined: ${node.data("value.mined")}, Len: ${node.data("value.blockChainLength")}`
            },
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
        }
      ]
    })
    this.visualisationService.getGraph()
      .pipe(
        tap((g: Graph) => {
          this.cy.remove('nodes');
          this.createNodes(g);
          this.createEdges(g);
          this.cy.layout({
            name: 'breadthfirst',
          }).run()
          this.cy.nodes().on('click', function(e){
            var node = e.target;
            console.log(node.data());
          });
        })
      )
      .subscribe();
  }

  createNodes(graph: Graph) {
    graph.nodes.forEach((item) => {
      this.cy.add({
        data: {id: 'node_' + item.id, value: {'blockChainLength': item.blockChainLength, 'mined': item.mined, 'type': item.nodeType}}
      })
    })
  }

  createEdges(graph: Graph) {
    graph.nodes.forEach((item) => {
      item.neighbours.forEach((neighbour) => {
        if(!(this.cy.getElementById(`edge_${neighbour}_${item.id}`).length > 0)){
          this.cy.add({data: {id: 'edge_' + item.id + '_' + neighbour, source: 'node_' + item.id, target: 'node_' + neighbour}})
        }
      })
    })
  }

}
