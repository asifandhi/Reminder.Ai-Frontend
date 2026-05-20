import { configureStore } from "@reduxjs/toolkit";
import  themeSlice from "./themeSlice.js"

import authSlice from "./authSlice.js";

const store= configureStore({
    reducer :{
        auth : authSlice,
        theme: themeSlice
    }
})

export default store;