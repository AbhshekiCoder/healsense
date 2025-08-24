import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../features/userInfo.js';
import mode from '../features/mode.js';

 const store = configureStore({
    reducer:{
        user: userSlice,
        mode: mode
    }
})
export default store;