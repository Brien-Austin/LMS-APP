
import {configureStore} from '@reduxjs/toolkit'
import {persistReducer , persistStore} from 'redux-persist'

import { useDispatch, useSelector } from 'react-redux'
import storage from 'redux-persist/lib/storage'
import { enrolledCourseSlice } from './slice/course'
import { layoutSlice } from './slice/layouts/layout'
import { authenticationSlice } from './slice/auth'
const generatePersistConfig = (key: string) => ({
    key,
    storage,
  });

  const persistedAuthlice = persistReducer(generatePersistConfig("authentication"),authenticationSlice.reducer)
  const persistedCourse = persistReducer(generatePersistConfig("enrolledCourse"),enrolledCourseSlice.reducer)
  const persistedLayout = persistReducer(generatePersistConfig("layoutSlice"),layoutSlice.reducer)
export const store = configureStore({
    reducer : {
        enrolledCourse : persistedCourse,
        layoutSlice : persistedLayout,
        authentication : persistedAuthlice

    }
})


  
  



export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export type AppDispatch = typeof store.dispatch