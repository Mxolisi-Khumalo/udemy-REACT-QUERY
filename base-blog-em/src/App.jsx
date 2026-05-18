import { Posts } from "./Posts";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();    // Create a query client

function App() {
  return (
    // provide the Query client to App as a prop
    <QueryClientProvider client={queryClient}>
      {/* Any thing inside this query client div is a descendant and can use the queryClient prop just passed */}
      <div className="App">
        <h1>Blog &apos;em Ipsum</h1>
        <Posts />
      </div>
    </QueryClientProvider>
  );
}

export default App;
