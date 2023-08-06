import CartContainer from "./components/CartContainer";
import Navbar from "./components/Navbar";
import { useSelector, useDispatch } from "react-redux";
// getting total reducer
import { calculateTotals, getCartItems } from "./features/cart/cartSlice";
// update the page
import { useEffect } from "react";
import Modal from "./components/Modal";

function App() {
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const { isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  // we can pass value 

  useEffect(()=>{
    dispatch(getCartItems('Gabobe'))
  }, [])

  if(isLoading){
    return (
    <div className="loading">
      <h1>loading...</h1>
    </div>
    );
  }

  return (
    <main>
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
    </main>
  );
}

export default App;
