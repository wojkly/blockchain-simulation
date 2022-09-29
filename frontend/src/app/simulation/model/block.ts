export class Block {

  private _id: number;
  private _minedBy: number;
  private _previous: Block | null = null;
  private _next: Block | null = null;

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
  constructor(id: number, minedBy: number) {
    this._id = id;
    this._minedBy = minedBy;
    this._next = null;
  }
}
