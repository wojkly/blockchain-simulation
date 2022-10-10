export class Block {

  private _id: number;
  private _minedBy: number;
  private _previous: Block | null = null;
  private _next: Block | null = null;

  // potrzebne do GHOST (chyba, że wymyśle coś lepszego)
  private _weight: number;

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

  constructor(id: number, minedBy: number, weight: number = 0) {
    this._id = id;
    this._minedBy = minedBy;
    this._next = null;

    // potrzebne do GHOST (chyba, że wymyśle coś lepszego)
    // przydałoby się też śledzić poziom drzewa, na tej podstawie wyznaczać wagę
    // czyli który poziom - ile bloków na tym samym poziomie
    // czyli wzór byłby jakoś tak 
    // 
    // block.weight = block.previous.weight + number_of_blocks_on_the_same_level(block.level)
    this._weight = this.previous ? this.previous.weight + 1 : weight;
  }
}
