import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlices";

export default configureStore({
    reducer: {
        auth: authReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
})