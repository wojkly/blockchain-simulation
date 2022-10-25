import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {tap} from "rxjs";
import {VisualisationService} from "../../services/visualisation.service";
import {Graph} from "../model/graph";
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import {NodeType} from "../nodeType";

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  @ViewChild("cy") el: ElementRef | undefined;
  id2tip:any = {};

  constructor(private visualisationService: VisualisationService) {
  }

  ngOnInit(): void {
    cytoscape.use( popper );
    var cy = cytoscape({
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
            'label': function (node: any) {
              switch (node.data("value.type")) {
                case NodeType.Miner:
                  return `ID: ${node.data("id")}, Money: ${node.data("value.money")}`;
                default:
                  return `ID: ${node.data("id")}`;
              }
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
    });
    this.visualisationService.getGraph()
      .pipe(
        tap((g: Graph) => {

          cy.remove('nodes');
          this.createNodes(g, cy);
          this.createEdges(g, cy);
          this.makeTooltips(cy);
          cy.layout({
            name: 'breadthfirst',
          }).run();
          cy.nodes().bind("tap", event => {
            this.id2tip[event.target.id()].show();
          });
          // cy.nodes().unbind("mouseover");
          // cy.nodes().bind("mouseover", event => {
          //   this.id2tip[event.target.id()].show();
          // });
          // cy.nodes().unbind("mouseout");
          // cy.nodes().bind("mouseout", event => {
          //   this.id2tip[event.target.id()].hide();
          // });
        })
      ).subscribe();
  }

  createNodes(graph: Graph, cy: cytoscape.Core) {
    graph.nodes.forEach((item) => {
      if (item.nodeType === NodeType.Miner) {
        cy.add({
          data: {
            id: 'node_' + item.id,
            value: {
              'blockChainLength': item.blockChainLength,
              'mined': item.mined,
              'money': item.money,
              'type': item.nodeType}}
        })
      } else {
        cy.add({
          data: {
            id: 'node_' + item.id,
            value: {
              'blockChainLength': item.blockChainLength,
              'type': item.nodeType}}
        })
      }
    })
  }

  createEdges(graph: Graph, cy: cytoscape.Core) {
    graph.nodes.forEach((item) => {
      item.neighbours.forEach((neighbour ) => {
        if(!(cy.getElementById(`edge_${neighbour}_${item.id}`).length > 0)){
          cy.add({data: {id: 'edge_' + item.id + '_' + neighbour, source: 'node_' + item.id, target: 'node_' + neighbour}})
        }
      })
    })
  }

  makeTooltips(cy: cytoscape.Core){
    cy.nodes().forEach((node: any) => {
      let ref = node.popperRef();
      this.id2tip[node.id()] = tippy(document.createElement("div"), {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: "manual",
        placement: 'bottom',
        content: () => {
          let content = document.createElement("div");
          content.setAttribute("style", "font-size:1em; padding-top: 2vh")
          content.innerHTML = `Mined: ${node._private.data.value.mined}, Len: ${node._private.data.value.blockChainLength}`;
          return content;
        }
      });
    });
  }
}
