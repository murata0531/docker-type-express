import { createAsyncThunk,createSlice,SerializedError } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../store";
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

//get line profile
export const getLineProfile = createAsyncThunk<LineProfile>(
    "lineProfile/fetch",
    async (): Promise<LineProfile> => {
        const lineProfile = liff.getProfile();
        if(lineProfile){
            return lineProfile as LineProfile;
        }
        throw new Error("profile fetch error");
    },
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLiffIdToken.fulfilled, (state, action) => {
            state.liffIdToken = action.payload.liffIdToken;
        });
        builder.addCase(getLiffIdToken.rejected, (state,action) => {
            state.error = action.error;
        });
        builder.addCase(getLineProfile.fulfilled, (state,action) => {
            state.userId = action.payload.userId;
            state.displayName = action.payload.displayName;
            state.pictureUrl = action.payload.pictureUrl;
            state.statusMessage = action.payload.statusMessage;
        });
        builder.addCase(getLineProfile.rejected, (state, action) => {
            state.error = action.error;
        });
    },
});

// auth情報を取得するSelector
export const authSelector = (state: RootState) => state.auth;

/**
* liffIdTokenを取得する
* @returns liffIdToken
*/
export const liffIdTokenSelector = createSelector(authSelector, (auth) => {
    return auth.liffIdToken;
});

/**
* LINEの名前を取得する
* @returns displayName
*/
export const displayNameSelector = createSelector(authSelector, (auth) => {
    return auth.displayName;
});

/**
* LINEの画像を取得する
* @returns pictureUrl
*/
export const pictureUrlSelector = createSelector(authSelector, (auth) => {
    return auth.pictureUrl;
});
  
/**
* errorを取得する
* @returns error
*/
export const errorSelector = createSelector(authSelector, (auth) => {
    return auth.error;
});