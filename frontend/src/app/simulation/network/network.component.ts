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
            'background-color': '#43fsdf',
            'label':  'data(id)',
            // 'content': 'data(value.mined)'
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
          this.createNodes(g);
          this.createEdges(g);
          this.cy.layout({
            name: 'circle'
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
        data: {id: 'node_' + item.id, value: {'blockChainLength': item.blockChainLength, 'mined': item.mined}}
      })
    })
  }

  createEdges(graph: Graph) {
    graph.nodes.forEach((item) => {
      item.neighbours.forEach((neighbour) => {
        this.cy.add({data: {id: 'edge_' + item.id + '_' + neighbour, source: 'node_' + item.id, target: 'node_' + neighbour}})
      })
    })
  }

}
