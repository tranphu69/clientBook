import {createSlice} from "@reduxjs/toolkit";
import {message} from 'antd';

const initialState = {
    carts:[],
    isAuthentication: true
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAuthentication:(state, action) => {
            state.isAuthentication = action.payload;
        },
        doAddBookAction: (state, action) =>{
            if(state.isAuthentication === true){
                let carts = state.carts;
                const item = action.payload;

                let isExistIndex = carts.findIndex( c => c._id === item._id);
                if(isExistIndex > -1){
                    carts[isExistIndex].quantity = item.quantity;
                }else{
                    carts.push({quantity: item.quantity, _id: item._id, detail: item.detail});
                    message.success("Thêm vào giỏ hàng thành công");
                }
                state.carts = carts;
            }
        },
        doUpdateBookAction:(state, action) => {
            if(state.isAuthentication === true){
                let carts = state.carts;
                const item = action.payload;

                let isExistIndex = carts.findIndex( c => c._id === item._id);
                carts[isExistIndex].quantity = item.quantity;
                if(carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity){
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
                }
                if(carts[isExistIndex].quantity < 0){
                    carts[isExistIndex].quantity = 1;
                }
                state.carts = carts;
            }
        },
        doDeleteBookAction: (state, action) => {
            state.carts = state.carts.filter(c => c._id !== action.payload._id);
        },
        doPlaceOrderAction: (state, action) => {
            state.carts = [];
        }
    }
})

export const {doAddBookAction, doAuthentication, doUpdateBookAction, doDeleteBookAction, doPlaceOrderAction} =  orderSlice.actions;

export default orderSlice.reducer;