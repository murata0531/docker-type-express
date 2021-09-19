import { createAsyncThunk,createSlice,SerializedError } from "@reduxjs/toolkit";
import liff from "@line/liff";

const liffId = process.env.React_APP_LIFF_ID;

export interface AuthState {
    liffIdToken?: string;
    userId?: string;
    displayName?: string;
    pictureUrl?: string;
    statusMessage?: string;
    error?: SerializedError;
}

const initialState: AuthState = {
    liffIdToken: undefined,
    userId: undefined,
    displayName: undefined,
    pictureUrl: undefined,
    statusMessage: undefined,
    error: undefined,
};

interface LiffIdToken {
    liffIdToken?: string;
}

interface LineProfile {
    userId?: string;
    displayName?: string;
    pictureUrl?: string;
    statusMessage?: string;
}

//line login
export const getLiffIdToken = createAsyncThunk<LiffIdToken>(
    "liffIdToken/fetch",
    async (): Promise<LiffIdToken> => {
        if(!liffId){
            throw new Error("liffId is not difined");
        }
        await liff.init({liffId});
        if(!liff.isLoggedIn()){
            liff.login();
        }
        const liffIdToken = liff.getIDToken();
        if(liffIdToken){
            return {liffIdToken} as LiffIdToken;
        }
        throw new Error("login error");
    },
);