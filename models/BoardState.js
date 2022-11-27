const {
  convertFenToBoardMapping,
  getExpandedState,
  getFenFromExpandedState,
} = require('../utils/board')

module.exports = class BoardState {
  constructor() {
    this.prevStates = []
    this.currentState = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    this.expandedState = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ]
    this.whiteToMove = true
    this.totalMoves = 0
  }
  makeMove(from, to) {
    const { row: r1, col: c1 } = from
    const { row: r2, col: c2 } = to
    this.expandedState[r2][c2] = this.expandedState[r1][c1]
    this.expandedState[r1][c1] = '.'
    this.prevStates.push(this.currentState)
    this.currentState = getFenFromExpandedState(this.expandedState)
    this.totalMoves++
    this.whiteToMove = !this.whiteToMove
  }
  reverseMove() {
    if (this.prevStates.length > 0) {
      this.currentState = this.prevStates.pop()
      this.expandedState = getExpandedState(this.currentState)
      this.whiteToMove = !this.whiteToMove
      this.totalMoves--
    }
  }
  getCurrentState() {
    return this.currentState
  }
}
