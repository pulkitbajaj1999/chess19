import React from 'react'

const Piece = ({
  square,
  piece,
  rank,
  file,
  isActive,
  isHint,
  showCoordinate,
  onClick,
}) => {
  const colorMapping = { b: 'black', w: 'white' }
  const typeMapping = {
    r: 'rook',
    n: 'knight',
    b: 'bishop',
    k: 'king',
    q: 'queen',
    p: 'pawn',
  }
  const getSquareColor = (rank, file) => {
    if (file === 'a' || file === 'c' || file === 'e' || file === 'g') {
      return +rank & 1 ? 'black' : 'white'
    } else {
      return +rank & 1 ? 'white' : 'black'
    }
  }

  const getPieceClass = () => {
    if (!piece) return ''
    const color = colorMapping[piece.color]
    const type = typeMapping[piece.type]
    return `${color}-${type}`
  }

  const squareClasses = `piece ${getSquareColor(
    rank,
    file
  )} ${getPieceClass()} ${isActive ? 'active' : ''} ${isHint ? 'hint' : ''}`

  return (
    <td id={square} className={squareClasses} onClick={onClick}>
      {showCoordinate?.rank && <span className="coordinate-rank">{rank}</span>}
      {showCoordinate?.file && <span className="coordinate-file">{file}</span>}
    </td>
  )
}

export default Piece
