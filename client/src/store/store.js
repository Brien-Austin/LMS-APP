import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import { useDispatch, useSelector } from 'react-redux'
import storage from 'redux-persist/lib/storage'
import { enrolledCourseSlice } from './slice/course'
import { layoutSlice } from './slice/layouts/layout'
import { authenticationSlice } from './slice/auth'

const generatePersistConfig = (key) => ({
    key,
    storage,
})

const persistedAuthlice = persistReducer(
    generatePersistConfig("authentication"),
    authenticationSlice.reducer
)

const persistedCourse = persistReducer(
    generatePersistConfig("enrolledCourse"),
    enrolledCourseSlice.reducer
)

const persistedLayout = persistReducer(
    generatePersistConfig("layoutSlice"),
    layoutSlice.reducer
)

export const store = configureStore({
    reducer: {
        enrolledCourse: persistedCourse,
        layoutSlice: persistedLayout,
        authentication: persistedAuthlice
    }
})

export const persistor = persistStore(store)

// These type definitions aren't necessary in JavaScript
// but you can use JSDoc comments if you want type hints
/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */

// In JavaScript, we don't need to specify types for useSelector and useDispatch
export const useAppSelector = useSelector
export const useAppDispatch = useDispatch