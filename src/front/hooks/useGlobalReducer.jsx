// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.

const StoreContext = createContext()
export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    useEffect(() => {
  const token = localStorage.getItem("jwt-token");

  if (token) {
    dispatch({
      type: "login-coach",
      payload: {
        token: token,
        coach: null
      }
    });
  }
}, []);
    // Provide the store and dispatch method to all child components.
    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
    </StoreContext.Provider>
}


// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext)
    return { dispatch, store };
}