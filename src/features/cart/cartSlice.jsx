import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { openModal } from "../modal/modalSlice";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const url = `https://course-api.com/react-useReducer-cart-project`;

// - action type ('cart/getCartItems')
// - callback function (()=>{})
// - lifecycle actions ([getCartItems.pending/fulfilled/loading])

// export const getCartItems = createAsyncThunk('cart/getCartItems', ()=> {
//   return fetch(url).then(res => res.json()).catch(err => console.log(err))
// })

export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, thunkAPI)=> {
  // console.log(name);
  // console.log(thunkAPI);
  // we can get the state of our Application thanks to thunkAPI parameter 
  // console.log(thunkAPI.getState());
  // we can also dispatch an action from createAsyncThunk thunkAPI
  // thunkAPI.dispatch(openModal())
  try {
     const resp = await axios(url)
     return resp.data
  } catch (error) {
    return thunkAPI.rejectWithValue('something went wrong')
  }
})


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, actions) => {
      const id = actions.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.map((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },

  // react toolkit with builder notation callback
  // extraReducers: (builder) => {
  //   builder.addCase(getCartItems.pending, (state) => {
  //     state.isLoading = true;
  //   }),
  //     builder.addCase(getCartItems.fulfilled, (state, action) => {
  //       console.log(action);
  //       state.isLoading = false;
  //       state.cartItems = action.payload;
  //     }),
  //     builder.addCase(getCartItems.rejected, (state) => {
  //       state.isLoading = false;
  //     });
  // },

  // chaining builder callback
  extraReducers: (builder) => {
    builder
    .addCase(getCartItems.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getCartItems.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
      });
  },

  // extraReducers: {
  //   [getCartItems.pending]: (state) => {
  //     state.isLoading = true
  //   },
  //   [getCartItems.fulfilled]: (state,action) => {
  //     // console.log(action);
  //     state.isLoading = false
  //     state.cartItems = action.payload
  //   },
  //   [getCartItems.rejected]: (state, action) => {
  //     console.log(action);
  //     state.isLoading = false
  //   },
  // }
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
