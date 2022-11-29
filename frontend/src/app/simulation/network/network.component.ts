import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {tap} from "rxjs";
import {VisualisationService} from "../../services/visualisation.service";
import {Graph} from "../model/graph";
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import {NodeType} from "../nodeType";
import {MinersDeletingService} from "../../services/miners-deleting.service";
import {getCountryNameByEnumName} from "../model/country";

cytoscape.use(popper);


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, OnDestroy {
  @ViewChild("cy") el: ElementRef | undefined;
  id2tip:any = {};
  graph!: Graph;
  minersToDelete: string[] = [];
  public activeEdges: {edge:string, ttl: number}[] = [];

  private cy = cytoscape({});

  private visualisationSub1: any;
  private visualisationSub2: any;
  private minersToDeleteSub: any;

  constructor(private visualisationService: VisualisationService,
              private minersToDeleteService: MinersDeletingService,
    ) {
    this.visualisationSub1 = this.visualisationService.getGraph().pipe(
      tap((res) => {
        this.graph = res.graph;
        this.activeEdges = res.activeEdges;
      })
    ).subscribe();

    if(!this.cy.destroyed())
      this.cy.destroy();
  }

  ngOnInit(): void {
    this.cy = cytoscape({
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
              return node.id();
            }
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
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
    this.createNodes(this.graph);
    this.createEdges();

    if(this.visualisationSub2)
      this.visualisationSub2.unsubscribe();

    this.visualisationSub2 = this.visualisationService.getGraph()
      .pipe(tap(res => {
          this.updateNodes(res.graph);
          this.cy.remove('edge');
          this.cy.forceRender();
          this.createEdges();
          this.makeTooltips();
          this.cy.layout({
            name: 'cose',
            animate: false,
            randomize: false,
            refresh: 0,
            padding: 50
          }).run();
          this.cy.nodes().lock()
          this.cy.nodes().on('click ', (e) => {
            this.id2tip[e.target.id()].show()
          })
        })
      ).subscribe();
  }


  createNodes(graph: Graph) {
    graph.nodes.forEach((item) => {
      if (item.nodeType === NodeType.Miner) {
        this.cy.add({
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
        this.cy.add({
          data: {
            id: '' + item.id,
            value: {
              'type': item.nodeType,
              'neighbours': item.neighbours}}
        })
      }
    })
  }


  createEdges() {
    this.cy.nodes().forEach((item) => {
      item.data("value.neighbours").forEach((neighbour ) => {
        const reverseEdge = `${neighbour}_${item.id()}`;
        const newEdge = `${item.id()}_${neighbour}`;
        if(!(this.cy.getElementById(reverseEdge).length > 0)){
          this.cy.add({data: {id: '' + item.id() + '_' + neighbour, source: '' + item.id(), target: '' + neighbour}});
          this.activeEdges.forEach(el => {
            if(el.edge === newEdge && el.ttl > 0) {
              this.cy.getElementById(newEdge).style({'line-color': 'red'});
            }
          })
        }
      })
    })
  }

  updateNodes(graph: Graph) {
    if(this.minersToDeleteSub)
      this.minersToDeleteSub.unsubscribe();

    this.minersToDeleteSub = this.minersToDeleteService.getMinersToDelete().subscribe((res) => {
      this.minersToDelete = res;
    })
    this.minersToDelete.forEach((miner) => {
      this.cy.getElementById(miner).remove();
    })
    graph.nodes.forEach((item) => {
      if (item.nodeType === NodeType.Miner) {
        if (this.cy.getElementById('' + item.id).id() == '' + item.id){
          this.cy.getElementById('' + item.id).data('value', {
            'computingPower': item.computingPower,
            'country': item.country,
            'mined': item.mined,
            'money': item.money,
            'type': item.nodeType,
            'neighbours': item.neighbours,
          })
        }
        else{
          this.cy.getElementById('' + item.id).removeData();
          this.cy.add({
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
        this.cy.getElementById('' + item.id).data(
            'value', {
              'type': item.nodeType,
              'neighbours': item.neighbours
        })
      }
    })
  }

  makeTooltips(){
    this.cy.nodes().forEach((node: any) => {
      let ref = node.popperRef();
      this.id2tip[node.id()] = tippy(document.createElement("div"), {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: "manual",
        placement: 'bottom',
        content: () => {
          let content = document.createElement("div");
          content.setAttribute("style", "font-size:1em; padding-top: 2vh")
          if(node.data("value.type") === NodeType.Miner) {
            content.innerHTML = `Mined: ${node._private.data.value.mined}, Money: ${node._private.data.value.money}$, Power: ${node._private.data.value.computingPower}, Country: ${getCountryNameByEnumName(node._private.data.value.country)}`;
          }
          return content;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.visualisationSub1.unsubscribe();
    this.visualisationSub2.unsubscribe();
    this.minersToDeleteSub.unsubscribe();

    if (document.getElementById('cy') !== null) {
      // @ts-ignore
      document.getElementById('cy').remove();
    }
    this.cy.destroy();
  }
}
