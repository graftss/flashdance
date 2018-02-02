export default class Array2D<T> {
  constructor(
    private cols: number,
    private rows: number,
    private data: T[] = [],
  ) {

  }

  public get = (col: number, row: number): T => {
    return this.data[this.dataIndex(col, row)];
  }

  // returns the previous value; this probably should be changed
  // but who knows
  public set = (value: T, col: number, row: number): T => {
    const index = this.dataIndex(col, row);
    const oldValue = this.get(col, row);
    this.data[index] = value;
    return oldValue;
  }

  public forEach = (f: (value: T, col: number, row: number) => any): void => {
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        f(this.get(col, row), col, row);
      }
    }
  }

  public map = (f: (value: T, col: number, row: number) => T): void => {
    this.forEach((v, c, r) => this.set(f(v, c, r), c, r));
  }

  private dataIndex(col: number, row: number): number {
    this.sanityCheckPosition(col, row);

    return this.cols * row + col;
  }

  private isValidPosition(col: number, row: number): boolean {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }

  private sanityCheckPosition(col: number, row: number): void {
    if (!this.isValidPosition(col, row)) {
      throw new Error(
        `invalid Array2D position (${col}, ${row}) read from ` +
        `an array of dimensions ${this.cols}x${this.rows}.`,
      );
    }
  }

}
