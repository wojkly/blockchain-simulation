import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {tap} from "rxjs";
import {VisualisationService} from "../../services/visualisation.service";
import {Graph} from "../model/graph";
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import {NodeType} from "../nodeType";
import {MinersDeletingService} from "../../services/miners-deleting.service";
import {EdgeService} from "../../services/edge.service";
import {getCountryNameByEnumName} from "../model/country";


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  @ViewChild("cy") el: ElementRef | undefined;
  id2tip:any = {};
  graph!: Graph;
  minersToDelete: string[] = [];
  public activeEdges: {edge:string, ttl: number}[] = [];


  constructor(private visualisationService: VisualisationService,
              private minersToDeleteService: MinersDeletingService,
              private edgeService: EdgeService
    ) {
    this.visualisationService.getGraph().subscribe((res) => {
      this.graph = res.graph;
      this.activeEdges = res.activeEdges;
    });
    cytoscape.use(popper);
  }

  ngOnInit(): void {
    let cy = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'node',
          style: {
            'width': '20px',
            'height': '20px',
            'font-size': '5px',
            'background-color': function (node: any) {
              let nodeType = node.data("value.type");
              switch (nodeType) {
                case 0:
                  return `red`;
                case 1:
                  return `green`;
                case 2:
                  return `blue`;
                default:
                  return `orange`;
              }
            },
            'label': function (node: any) {
              if (node.data("value.type") == NodeType.Miner) {
                return node.id();
              }
              return '';
            }
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            // 'line-color': '#dsd1aa3',
            // 'target-arrow-color': '#ccc',
            // 'target-arrow-shape': 'triangle',
            // 'curve-style': 'bezier',
          }
        },
        {
          selector: ':parent',
          style: {
            'background-opacity': 0.333
          }
        },
      ]
    });
    this.createNodes(this.graph, cy);
    this.createEdges(cy);
    this.visualisationService.getGraph()
      .pipe(tap(res => {
          this.updateNodes(res.graph, cy);
          cy.remove('edge');
          cy.forceRender();
          this.createEdges(cy);
          this.makeTooltips(cy);
          cy.layout({
            name: 'cose',
            animate: false,
            randomize: false,
            refresh: 0,
            padding: 50
            // breadthfirst
          }).run();
          cy.nodes().lock()
          cy.nodes().on('click ', (e) => {
            this.id2tip[e.target.id()].show()
          })
        })
      ).subscribe();
  }


  createNodes(graph: Graph, cy: cytoscape.Core) {
    graph.nodes.forEach((item) => {
      if (item.nodeType === NodeType.Miner) {
        cy.add({
          data: {
            id: '' + item.id,
            value: {
              'mined': item.mined,
              'money': item.money,
              'type': item.nodeType,
              'country': item.country,
              'computingPower': item.computingPower,
              'neighbours': item.neighbours}
          }
        })

      } else {
        cy.add({
          data: {
            id: '' + item.id,
            value: {
              'type': item.nodeType,
              'neighbours': item.neighbours}}
        })
      }
    })
  }


  createEdges(cy: cytoscape.Core) {
    cy.nodes().forEach((item) => {
      item.data("value.neighbours").forEach((neighbour ) => {
        const reverseEdge = `${neighbour}_${item.id()}`;
        const newEdge = `${item.id()}_${neighbour}`;
        if(!(cy.getElementById(reverseEdge).length > 0)){
          cy.add({data: {id: '' + item.id() + '_' + neighbour, source: '' + item.id(), target: '' + neighbour}});
          this.activeEdges.forEach(el => {
            if(el.edge === newEdge && el.ttl > 0) {
              cy.getElementById(newEdge).style({'line-color': 'red'});
            }
          })
        }
      })
    })
  }

  updateNodes(graph: Graph, cy: cytoscape.Core) {
    this.minersToDeleteService.getMinersToDelete().subscribe((res) => {
      this.minersToDelete = res;
    })
    this.minersToDelete.forEach((miner) => {
      cy.getElementById(miner).remove();
    })
    graph.nodes.forEach((item) => {
      if (item.nodeType === NodeType.Miner) {
        if (cy.getElementById('' + item.id).id() == '' + item.id){
          cy.getElementById('' + item.id).data('value', {
            'computingPower': item.computingPower,
            'country': item.country,
            'mined': item.mined,
            'money': item.money,
            'type': item.nodeType,
            'neighbours': item.neighbours,
          })
        }
        else{
          cy.getElementById('' + item.id).removeData();
          cy.add({
            data: {
              id: '' + item.id,
              value: {
                'mined': item.mined,
                'money': item.money,
                'type': item.nodeType,
                'country': item.country,
                'computingPower': item.computingPower,
                'neighbours': item.neighbours}}
          })
        }

      } else {
        cy.getElementById('' + item.id).data(
            'value', {
              'type': item.nodeType,
              'neighbours': item.neighbours
        })
      }
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
          if(node.data("value.type") === NodeType.Miner) {
            content.innerHTML = `Mined: ${node._private.data.value.mined}, Money: ${node._private.data.value.money}, Power: ${node._private.data.value.computingPower}, Country: ${getCountryNameByEnumName(node._private.data.value.country)}`;
          }
          return content;
        }
      });
    });
  }
}
