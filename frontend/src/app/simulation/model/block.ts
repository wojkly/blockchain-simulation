export class Block {

  private _id: number;
  private _minedBy: number;
  private _previous: Block | null = null;
  private _next: Block | null = null;

  private _parent: Block | null;
  private _children: Block[] = [];

  // potrzebne do GHOST (chyba, że wymyśle coś lepszego)
  private _weight: number = 1;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get previous(): Block | null {
    return this._previous;
  }

  set previous(value: Block | null) {
    this._previous = value;
  }

  get next(): Block | null {
    return this._next;
  }

  set next(value: Block | null) {
    this._next = value;
  }

  get minedBy(): number {
    return this._minedBy;
  }

  set minedBy(value: number) {
    this._minedBy = value;
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

  constructor(id: number, minedBy: number, parent: Block | null = null, children: Block[] = [], weight: number = 0) {
    this._id = id;
    this._minedBy = minedBy;
    this._next = null;

    // potrzebne do GHOST (chyba, że wymyśle coś lepszego)
    // przydałoby się też śledzić poziom drzewa, na tej podstawie wyznaczać wagę
    // czyli który poziom - ile bloków na tym samym poziomie
    // czyli wzór byłby jakoś tak 
    // 
    // block.weight = block.previous.weight + number_of_blocks_on_the_same_level(block.level)
    this._parent = parent;
    this._children = children;
    this._weight = this._parent ? this._parent.weight + 1 : weight;
  }
}
