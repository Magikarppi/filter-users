import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Users from "./components/Users";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <Users />
            </div>
        </QueryClientProvider>
    );
}

export default App;
