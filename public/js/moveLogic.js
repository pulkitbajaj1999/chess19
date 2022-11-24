const moveHandler = (event, props) => {
  console.log('move-handler-called')
  window.props = props
  const boardState = props.boardState
  const boardMapping = getMapping(boardState.currentState)
  const { row, col } = props.pos
  const moveLock = boardState.moveLock
  if (moveLock.flag === false) {
    checkValidityFrom(boardMapping, boardState, row, col)
      ? lockSquare(row, col)
      : alertInvalidFrom()
  } else if (moveLock.row === row && moveLock.col === col) {
    unLockSquare()
  } else {
    checkValidityTo(boardMapping, boardState, row, col)
      ? makeMove(moveLock, row, col)
      : alertInvalidTo()
  }
}

const makeMove = (moveLock, row, col) => {
  console.log('making move')
  const payload = {
    from: { row: moveLock.row, col: moveLock.col },
    to: { row, col },
  }
  fetch('/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'move', payload }),
  }).then(() => {
    location.reload()
  })
}

const unLockSquare = () => {
  fetch('/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'unlock' }),
  }).then(() => {
    location.reload()
  })
}

const lockSquare = (row, col) => {
  console.log('setting lock')
  fetch('/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'lock', payload: { row, col } }),
  }).then(() => {
    location.reload()
  })
}

const alertInvalidFrom = () => {
  console.log('invalid from')
}

const alertInvalidTo = () => {
  console.log('invalid to')
}

const checkValidityFrom = (boardMapping, boardState, row, col) => {
  const squareData = boardMapping[row][col]
  const colorToMove = boardState.whiteToMove ? 'white' : 'black'
  return squareData && squareData.pieceColor === colorToMove
}

const checkValidityTo = (boardMapping, boardState, row, col) => {
  const moveLock = boardState.moveLock
  const lockedSquareData = boardMapping[moveLock.row][moveLock.col]
  const toSquareData = boardMapping[row][col]
  return (
    toSquareData === null ||
    lockedSquareData.pieceColor !== toSquareData.pieceColor
  )
}

const getMapping = (fen) => {
  const isDigit = (symbol) => {
    return Number.isInteger(+symbol)
  }
  const isUpper = (symbol) => {
    return symbol === symbol.toUpperCase()
  }
  const mappedPieceData = {
    r: 'rook',
    b: 'bishop',
    n: 'knight',
    k: 'king',
    q: 'queen',
    p: 'pawn',
  }

  const boardMapping = []
  const sections = fen.split(' ')
  const positionsSec = sections[0]

  let row = 0
  let col = 0
  let buffRow = Array(8).fill(null)
  for (let symbol of positionsSec) {
    if (symbol === '/') {
      boardMapping.push(buffRow)
      buffRow = Array(8).fill(null)
      row++
      col = 0
    } else if (isDigit(symbol)) {
      col += +symbol
    } else {
      buffRow[col] = {
        pieceColor: isUpper(symbol) ? 'white' : 'black',
        pieceType: mappedPieceData[symbol.toLowerCase()],
      }
      col++
    }
  }
  boardMapping.push(buffRow)
  return boardMapping
}
