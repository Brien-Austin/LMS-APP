import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   currentCourse: "",
   currentTab: "Home",
   currentChapter: {
       id: "",
       index: 1,
       isCompleted: false,
       title: "",
       description: "",
       videoUrl: ""
   }
}

export const enrolledCourseSlice = createSlice({
   name: 'enrolled-course',
   initialState,
   reducers: {
       setCurrentChapterId: (state, action) => {
           state.currentChapter.id = action.payload
       },

       setCurrentChapter: (state, action) => {
           state.currentChapter = {
               id: action.payload.id,
               title: action.payload.title,
               index: action.payload.index,
               description: action.payload.description,
               videoUrl: action.payload.videoUrl,
               isCompleted: action.payload.isCompleted,
           }
       },

       setCurrentCourse: (state, action) => {
           state.currentCourse = action.payload
       },

       setCurrentTab: (state, action) => {
           state.currentTab = action.payload
       },

       setCurrentChapterCompleted: (state, action) => {
           state.currentChapter.index = action.payload
           state.currentChapter.isCompleted = true
       }
   }
})

export const {
   setCurrentCourse,
   setCurrentChapterId,
   setCurrentChapter,
   setCurrentTab,
   setCurrentChapterCompleted
} = enrolledCourseSlice.actions

export default enrolledCourseSlice.reducer