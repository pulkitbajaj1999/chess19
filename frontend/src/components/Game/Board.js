import React from 'react'
import './Board.css'
import Piece from './Piece'

const Board = ({ boardMapping, pieceLock, flip = false, clickSquare }) => {
  function getSquareCoordinates(squareString) {
    const file = squareString[0]
    const rank = squareString[1]
    const j = files.findIndex((el) => el === file)
    const i = ranks.findIndex((el) => el === rank)
    return [i, j]
  }

  function getSquareString(i, j) {
    return files[j] + ranks[i]
  }

  if (!boardMapping) return <></>
  console.log('-------rendering-board, board-mapping', boardMapping)

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

  const extendedBoardMapping = boardMapping.map((row, i) =>
    row.map((col, j) => ({
      square: getSquareString(i, j),
      piece: col ? { ...col } : null,
      file: files[j],
      rank: ranks[i],
      isActive: false,
      isHint: false,
    }))
  )
  // setting active and hint squares
  if (pieceLock.isSet) {
    const [i, j] = getSquareCoordinates(pieceLock.square)
    extendedBoardMapping[i][j].isActive = true
    pieceLock.allowedMoves.forEach((move) => {
      const [i, j] = getSquareCoordinates(move)
      extendedBoardMapping[i][j].isHint = true
    })
  }

  if (flip) {
    extendedBoardMapping.forEach((row) => row.reverse())
    extendedBoardMapping.reverse()
  }

  return (
    <table className={`board white-view`}>
      <tbody>
        {extendedBoardMapping.map((row, i) => (
          <tr key={i}>
            {row.map((col, j) => {
              return (
                <Piece
                  key={col.square}
                  square={col.square}
                  piece={col.piece}
                  rank={col.rank}
                  file={col.file}
                  isActive={col.isActive}
                  isHint={col.isHint}
                  showCoordinate={{ rank: j === 0, file: i === 7 }}
                  onClick={clickSquare.bind(null, col.square)}
                />
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Board
