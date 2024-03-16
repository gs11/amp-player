import { ChakraProvider } from "@chakra-ui/react";
import { Route } from "wouter";

import "./App.css";
import { Artist } from "./Artist";
import { Search } from "./Search";

/*
TODO:
- Display error
*/

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Route path="/" component={Search} />
        <Route path="/artists/:artistId" component={Artist} />
      </div>
    </ChakraProvider>
  );
}

export default App;
