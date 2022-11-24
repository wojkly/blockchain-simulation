export class Block {

  private _id: number;
  private _minedBy: number;

  private _parent: Block | null;
  private _children: Block[] = [];

  private _weight: number = 1;
  private _fullNodeLastBlock: boolean = false;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get weight(): number {
    return this._weight;
  }

  set weight(value: number) {
    this._weight = value;
  }

  get parent(): Block | null {
    return this._parent;
  }

  set parent(value: Block | null) {
    this._parent = value;
  }

  get children(): Block[] {
    return this._children;
  }

  set children(value: Block[]) {
    this._children = value;
  }

  get fullNodeLastBlock(): boolean {
    return this._fullNodeLastBlock;
  }

  set fullNodeLastBlock(value: boolean) {
    this._fullNodeLastBlock = value;
  }

  constructor(id: number, minedBy: number, parent: Block | null = null, children: Block[] = [], weight: number = 0, fullNodeLastBlock: boolean = false) {
    this._id = id;
    this._minedBy = minedBy;
    this._parent = parent;
    this._children = children;
    this._weight = this._parent ? this._parent.weight + 1 : weight;
    this._fullNodeLastBlock = fullNodeLastBlock;
  }
}
