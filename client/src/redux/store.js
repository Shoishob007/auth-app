import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice" // default export, so name has been changed

export const store = configureStore({
    reducer: { user: userReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,

    })
})