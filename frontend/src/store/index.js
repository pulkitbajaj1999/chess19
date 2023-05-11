import { configureStore } from '@reduxjs/toolkit'

import gameReducer from './game'
import commonReducer from './common'

const store = configureStore({
  reducer: { game: gameReducer, common: commonReducer },
})

export default store
