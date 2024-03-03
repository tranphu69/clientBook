import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
    },
    tempAvatar:""
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isLoading = false;
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.isLoading = false;
        }, 
        doLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                email:'',
                phone:'',
                fullName:'',
                role:'',
                avatar:'',
                id:''
            }
        },
        doUploadAvatarAction:(state, action) => {
            state.tempAvatar = action.payload.avatar
        },
        doUpdateUserInfoAction:(state, action) => {
            state.user.avatar = action.payload.avatar;
            state.user.phone = action.payload.phone;
            state.user.fullName = action.payload.fullName;
        }
    },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction, doUploadAvatarAction, doUpdateUserInfoAction} = accountSlice.actions;

export default accountSlice.reducer;
