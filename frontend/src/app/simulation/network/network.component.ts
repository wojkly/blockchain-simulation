import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {tap} from "rxjs";
import {VisualisationService} from "../../services/visualisation.service";
import {Graph} from "../model/graph";
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import {NodeType} from "../nodeType";
<<<<<<< HEAD
import {EdgeService} from "../../services/edge.service";
=======
import {MinersDeletingService} from "../../services/miners-deleting.service";

>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3

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

<<<<<<< HEAD
  public activeEdges: string[] = [];

  constructor(
    private visualisationService: VisualisationService,
    private edgeService: EdgeService
  ) {
    this.edgeService.getEdges().subscribe(res => {
      this.activeEdges = res;
=======
  constructor(private visualisationService: VisualisationService,
              private minersToDeleteService: MinersDeletingService) {
    this.visualisationService.getGraph().subscribe((res) => {
      this.graph = res;
>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3
    })
  }

  ngOnInit(): void {
<<<<<<< HEAD
    cytoscape.use( popper );
    let cy = cytoscape({
=======
    cytoscape.use(popper);
    var cy = cytoscape({
>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3
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
            }
          }
        },
        {
          selector: 'edge',
          style: {
<<<<<<< HEAD
            'width': 3,
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-color': 'gray',
=======
            'width': 1,
            // 'line-color': '#dsd1aa3',
            // 'target-arrow-color': '#ccc',
            // 'target-arrow-shape': 'triangle',
            // 'curve-style': 'bezier',
>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3
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
<<<<<<< HEAD
      .pipe(
        tap(({graph: g, activeEdges: activeEdges}) => {

          cy.remove('node');
          this.createNodes(g, cy);
          this.createEdges(g, cy);
=======
      .pipe(tap((graph) => {
          this.updateNodes(graph, cy);
          cy.remove('edges');
          cy.forceRender();
          this.createEdges(cy);
>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3
          this.makeTooltips(cy);
          cy.layout({
            name: 'cose',
            animate: false,
            randomize: false,
            refresh: 0,
            padding: 30
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
              'blockChainLength': item.blockChainLength,
              'mined': item.mined,
              'money': item.money,
<<<<<<< HEAD
              'type': item.nodeType
            }}
=======
              'type': item.nodeType,
              'country': item.country,
              'computingPower': item.computingPower,
              'neighbours': item.neighbours}
          }
>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3
        })

      } else {
        cy.add({
          data: {
            id: '' + item.id,
            value: {
              'blockChainLength': item.blockChainLength,
<<<<<<< HEAD
              'type': item.nodeType
            }}
=======
              'type': item.nodeType,
              'neighbours': item.neighbours}}
>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3
        })
      }
    })
  }

<<<<<<< HEAD
  createEdges(graph: Graph, cy: cytoscape.Core) {
    graph.nodes.forEach((item) => {
      item.neighbours.forEach((neighbour ) => {
        const newId = `${item.id}_${neighbour}`;
        const newIdInverted = `${neighbour}_${item.id}`;
        if(cy.getElementById(newIdInverted).length === 0){
          //console.log(this.activeEdges);
          cy.add({
            data: {
              id: newId,
              source: '' + item.id,
              target: '' + neighbour
            }});
          this.activeEdges.forEach(edge => {
            if(edge === newId) {
              cy.getElementById(newId).style({
                'line-color': 'red'
              })
              cy.getElementById(newIdInverted).style({
                'line-color': 'red'
              })
            }
          });
=======
  createEdges(cy: cytoscape.Core) {
    cy.nodes().forEach((item) => {
      item.data("value.neighbours").forEach((neighbour ) => {
        if(!(cy.getElementById(`${neighbour}_${item.id}`).length > 0)){
          cy.add({data: {id: '' + item.id() + '_' + neighbour, source: '' + item.id(), target: '' + neighbour}})
>>>>>>> 9082ef04629bfd0da482f5f4aa3956560138add3
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
            'blockChainLength': item.blockChainLength,
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
                'blockChainLength': item.blockChainLength,
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
              'blockChainLength': item.blockChainLength,
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
            content.innerHTML = `Mined: ${node._private.data.value.mined}, Len: ${node._private.data.value.blockChainLength}, Money: ${node._private.data.value.money}, Power: ${node._private.data.value.computingPower}`;
          } else {
            content.innerHTML = `Len: ${node._private.data.value.blockChainLength}`;
          }
          return content;
        }
      });
    });
  }
}
