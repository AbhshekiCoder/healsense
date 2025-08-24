import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";


const mode = createSlice({
    name: "mode",
    initialState:{
        value: "light"
    },
    reducers:{
        changeMode: (state, action) =>{
            state.value = action.payload
        }
    }
})

export const {changeMode} = mode.actions;
export default mode.reducer;