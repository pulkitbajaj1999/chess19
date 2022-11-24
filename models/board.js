const boardUtils = require('../utils/board')

const INITIAL_STATE = {
  prevStates: [],
  currentState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  expandedState: [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ],
  whiteToMove: true,
  totalMoves: 0,
  whiteFaceView: true,
  moveLock: { flag: false, row: null, col: null },
}

class Board {
  constructor() {
    console.log('board-constructor called')
    this.prevStates = INITIAL_STATE.prevStates
    this.currentState = INITIAL_STATE.currentState
    this.expandedState = INITIAL_STATE.expandedState
    this.whiteToMove = INITIAL_STATE.whiteToMove
    this.totalMoves = INITIAL_STATE.totalMoves
    this.whiteFaceView = INITIAL_STATE.whiteFaceView
    this.moveLock = INITIAL_STATE.moveLock
  }

  resetMoveLock() {
    console.log('reset-move-lock-backend')
    this.moveLock = { ...INITIAL_STATE.moveLock }
  }

  setMoveLock(payload) {
    console.log('set-move-lock-backend')
    console.log('payload', payload)
    this.moveLock = {
      flag: true,
      row: payload.row,
      col: payload.col,
    }
  }

  makeMove(payload) {
    console.log('make-move-backend')
    console.log('payload:', payload)
    const { row: r1, col: c1 } = payload.from
    const { row: r2, col: c2 } = payload.to
    this.expandedState[r2][c2] = this.expandedState[r1][c1]
    this.expandedState[r1][c1] = '.'
    this.prevStates.push(this.currentState)
    this.currentState = boardUtils.getFenFromExpandedState(this.expandedState)
    this.totalMoves++
    this.whiteToMove = !this.whiteToMove
    this.resetMoveLock()
  }

  reverseMove() {
    console.log('reverse-move-backend')
    if (this.prevStates.length > 0) {
      this.currentState = this.prevStates.pop()
      this.expandedState = boardUtils.getExpandedState(this.currentState)
      this.whiteToMove = !this.whiteToMove
      this.totalMoves--
      this.moveLock = INITIAL_STATE.moveLock
    }
  }

  changeView() {
    this.whiteFaceView = !this.whiteFaceView
  }

  reset() {
    // resetting all properties
    this.prevStates = []
    this.currentState = INITIAL_STATE.currentState
    this.expandedState = boardUtils.getExpandedState(this.currentState)
    this.whiteToMove = INITIAL_STATE.whiteToMove
    this.totalMoves = INITIAL_STATE.totalMoves
    this.whiteFaceView = INITIAL_STATE.whiteFaceView
    this.moveLock = { flag: false, row: null, col: null }
  }
}

module.exports = Board
