import {createSlice} from '@reduxjs/toolkit'


interface LayoutSlice {
    isInstructorSideBarOpened: boolean
}

const initialState: LayoutSlice={
    isInstructorSideBarOpened: false

}

export const layoutSlice  = createSlice({
    name : 'layoutSlice',
    initialState,
    reducers : {
      
        setIsSideBarOpened : (state)=>{
            state.isInstructorSideBarOpened = !state.isInstructorSideBarOpened
        },
      
    }
})

export const {setIsSideBarOpened} = layoutSlice.actions
export default layoutSlice.reducer