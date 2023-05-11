import React from 'react'

const Piece = ({ rank, file, isActive, showCoordinate, onClick, data }) => {
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
    if (!data) return ''
    const color = colorMapping[data.color]
    const type = typeMapping[data.type]
    return `${color}-${type}`
  }

  const squareClasses = `piece ${getSquareColor(
    rank,
    file
  )} ${getPieceClass()} ${isActive ? 'active' : ''}`

  return (
    <td id={file + rank} className={squareClasses} onClick={onClick}>
      {showCoordinate.rank && <span className="coordinate-rank">{rank}</span>}
      {showCoordinate.file && <span className="coordinate-file">{file}</span>}
    </td>
  )
}

export default Piece
