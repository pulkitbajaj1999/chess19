import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { START_FEN } from '../../constants'

import { setChess, flipBoard } from '../../store/common'

import ButtonLarge from '../../UI/ButtonLarge'
import classes from './Sidebar.module.css'

import { MODE } from '../../constants'

const Sidebar = () => {
  const dispatch = useDispatch()
  const gameState = useSelector((state) => state.game)
  const commonState = useSelector((state) => state.common)
  const { mode } = commonState

  const flipBoardHandler = () => {
    dispatch(flipBoard())
  }

  const undoHandler = () => {}

  const resetHandler = () => {
    dispatch(setChess(START_FEN))
  }

  return (
    <div className={classes['sidebar-component']}>
      <div className={classes['sidebar-control']}>
        <ButtonLarge onClick={flipBoardHandler}>Flip</ButtonLarge>
        {/* <ButtonLarge onClick={undoHandler} disabled={true}>
          Undo
        </ButtonLarge> */}
        {mode === MODE.LOCAL && (
          <ButtonLarge onClick={resetHandler} disabled={mode !== MODE.LOCAL}>
            Reset
          </ButtonLarge>
        )}
      </div>
    </div>
  )
}

export default Sidebar
