const useStore = create((set) => ({
    query: '',
    results: [],
    setQuery: (query) => set({ query }),
    setResults: (results) => set({ results }),
}));
let pagegeSize=25;
let numPage=1;
export const SearchCustumer = () => {
    const { query, results, setQuery, setResults } = useStore();
    useEffect(async() => {
        try {
        const  response = await fetch('https://api.example.com/customers?page=${numPage}&limit=${pageSize');
    }
    catch (error) {
        console.error('Error in SearchCustumer:', error);
    }
    }), [];
    
    const handleSearch = () => {
        const filteredResults = data.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
    };
}