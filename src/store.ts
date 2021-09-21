import { configureStore } from "@reduxjs/toolkit";
import {useSelector as rawUseSelector,TypedUseSelectorHook} from "react-redux";
import {authSlice} from "./slices/auth";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});