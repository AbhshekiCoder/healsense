import {createSlice} from '@reduxjs/toolkit';


const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        userInfo: (state, action) =>{
            state.value = action.payload
        }
    }

})

export const {userInfo} = userSlice.actions;
export default userSlice.reducer;