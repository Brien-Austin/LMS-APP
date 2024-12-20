import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   isAuthenticated: false,
   isInstructorAuthenticated: true
}

export const authenticationSlice = createSlice({
   name: 'authentication',
   initialState,
   reducers: {
       setIsIntructorAuthenticated: (state) => {
           state.isInstructorAuthenticated = !state.isInstructorAuthenticated
       },
       setIsAuthenticated: (state) => {
           state.isAuthenticated = true
       },
       setLogout: (state) => {
           state.isAuthenticated = false
       }
   }
})

export const {
   setIsAuthenticated,
   setLogout,
   setIsIntructorAuthenticated
} = authenticationSlice.actions

export default authenticationSlice.reducer