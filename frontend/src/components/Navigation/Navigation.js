import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setChess, setGameMode } from '../../store/common'
import { createGame, joinGame } from '../../store/gameActions'

import JoinSessionOverlay from './JoinSessionOverlay'
import NewSessionoverlay from './NewSessionOverlay'

import classes from './Navigation.module.css'
import { START_FEN, MODE } from '../../constants'

const Navigation = () => {
  const dispatch = useDispatch()
  const gameState = useSelector((state) => state.game)
  const commonState = useSelector((state) => state.common)

  // define current state variables
  const [showLocalGameOverlay, setShowLocalGameOverlay] = useState(false)
  const [showNewSessionOverlay, setShowNewSessionOverlay] = useState(false)
  const [showJoinSessionOverlay, setShowJoinSessionOverlay] = useState(false)
  const [joinSessionError, setJoinSessionError] = useState('')

  // define handlers
  const openLocalGameOverlay = () => {
    setShowLocalGameOverlay(true)
  }

  const closeLocalGameOverlay = () => {
    setShowLocalGameOverlay(false)
  }

  const openNewSessionOverlay = () => {
    setShowNewSessionOverlay(true)
  }

  const closeNewSessionOverlay = () => {
    setShowNewSessionOverlay(false)
  }

  const openJoinSessionOverlay = () => {
    setShowJoinSessionOverlay(true)
  }

  const closeJoinSessionOverlay = () => {
    setShowJoinSessionOverlay(false)
    setJoinSessionError('')
  }

  const startLocalGameHandler = () => {
    dispatch(setChess(START_FEN))
    dispatch(setGameMode(MODE.LOCAL))
    closeLocalGameOverlay()
  }

  const startNewSessionHandler = () => {
    dispatch(createGame())
    closeNewSessionOverlay()
  }
  const joinSessionHandler = (sessionID) => {
    dispatch(joinGame(sessionID))
    closeJoinSessionOverlay()
  }

  return (
    <div className={classes['nav-component']}>
      <div className={classes['nav-top']}>
        <div className={classes['nav-head-component']}>Chess19</div>
        <div
          className={
            commonState?.mode === MODE.LOCAL
              ? classes['nav-link-component-active']
              : classes['nav-link-component']
          }
          onClick={
            commonState?.mode === MODE.LOCAL ? undefined : openLocalGameOverlay
          }
        >
          <span>Local</span>
        </div>
        <div
          className={classes['nav-link-component']}
          onClick={openNewSessionOverlay}
        >
          <span>Start New</span>
        </div>
        <div
          className={classes['nav-link-component']}
          onClick={openJoinSessionOverlay}
        >
          <span>Join</span>
        </div>
      </div>
      <div className={classes['nav-bottom']}>
        <div className={classes['nav-session-component']}>
          <span className={classes['session-heading']}>Mode</span>
          <span className={classes['session-value']}>{commonState.mode}</span>
        </div>
        {commonState?.mode !== MODE.LOCAL && (
          <div className={classes['nav-session-component']}>
            <span className={classes['session-heading']}>RoomID</span>
            <span className={classes['session-value']}>{gameState.roomId}</span>
          </div>
        )}
      </div>
      {showLocalGameOverlay && (
        <NewSessionoverlay
          onCloseOverlay={closeLocalGameOverlay}
          onConfirm={startLocalGameHandler}
        />
      )}
      {showNewSessionOverlay && (
        <NewSessionoverlay
          onCloseOverlay={closeNewSessionOverlay}
          onConfirm={startNewSessionHandler}
        />
      )}
      {showJoinSessionOverlay && (
        <JoinSessionOverlay
          onCloseOverlay={closeJoinSessionOverlay}
          onJoinSession={joinSessionHandler}
          error={joinSessionError}
        />
      )}
    </div>
  )
}

export default Navigation
