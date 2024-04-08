import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false

}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteStart: (state) => {
            state.loading = true;
        },
        deleteSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false
        },
        deleteFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        }
    }
})

export const { loginStart, loginSuccess, loginFailure, updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, logout } = userSlice.actions;

export default userSlice.reducer;