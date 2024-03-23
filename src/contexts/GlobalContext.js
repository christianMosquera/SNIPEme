export const GlobalContext = createContext(null);

export const GlobalProvider = ({children}) => {
  const [globalState, setGlobalState] = useState({});

  useEffect(() => {
    // Fetch global data here
    // For example, you could fetch the current user from Firebase Auth
    // and store it in global state
  }, []);

  return (
    <GlobalContext.Provider value={globalState}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);