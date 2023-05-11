import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateGame } from '../../store/gameActions'
import Board from './Board'

import { COLOR, MODE } from '../../constants'

const Game = () => {
  console.log('--------rendering game---------')
  const dispatch = useDispatch()
  const gameState = useSelector((state) => state.game)
  const commonState = useSelector((state) => state.common)
  const fen = gameState?.fen
  const { chess, mode: gameMode, flip } = commonState

  const boardMapping = chess.board()
  const [pieceLock, setPieceLock] = useState({
    isSet: false,
    square: null,
    allowedMoves: [],
  })
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (fen) {
      chess.load(fen)
      setRefresh((prev) => prev + 1)
    }
  }, [fen])

  const updateGameHandler = (updatedFen) => {
    dispatch(updateGame(updatedFen))
  }

  const getPieceColor = (squareString) => {
    const piece = chess.get(squareString)
    switch (piece?.color) {
      case 'w':
        return COLOR.WHITE
      case 'b':
        return COLOR.BLACK
      default:
        return null
    }
  }

  const highlightHints = (currentSquare) => {
    const moves = chess
      .moves({ square: currentSquare, verbose: true })
      .map((move) => move.to)
    setPieceLock({ isSet: true, square: currentSquare, allowedMoves: moves })
  }

  const disableEffects = () => {
    setPieceLock({ isSet: false, square: null, allowedMoves: [] })
  }

  const movePiece = (from, to) => {
    chess.move({ from, to, promotion: 'q' })
    if (gameMode === MODE.SESSION_ACTIVE) updateGameHandler(chess.fen())
  }

  const clickHandler = (square) => {
    console.log('click on', square)

    // disable click for passive-session
    if (gameMode === MODE.SESSION_PASSIVE) return

    const turn = chess.turn() === 'w' ? COLOR.WHITE : COLOR.BLACK
    const playAs = gameState?.playAs
    const piece = chess.get(square)
    let pieceColor = getPieceColor(square)
    console.log('turn', turn, 'play-as', playAs)

    // disable click on active-session if turn is not of current player
    if (gameMode === MODE.SESSION_ACTIVE && turn !== playAs) return

    // highlight when clicked on color with current turn
    if (pieceLock.isSet && pieceLock.square === square) {
      disableEffects()
      return
    } else if (pieceColor && turn === pieceColor) {
      console.log('highlight')
      highlightHints(square)
    } else if (pieceLock.isSet && pieceLock.allowedMoves.includes(square)) {
      console.log('moving-piece')
      movePiece(pieceLock.square, square)
      disableEffects()
    } else {
      console.log('disable-effects')
      disableEffects()
    }
  }

  return (
    <Board
      boardMapping={boardMapping}
      pieceLock={pieceLock}
      flip={flip}
      clickSquare={clickHandler}
    ></Board>
  )
}

export default Game
