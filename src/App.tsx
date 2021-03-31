import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import { Users } from "./components/Users";
import { Landing } from "./components/Landing";
import { setContext } from "apollo-link-context";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { IsAuthenticated } from "./components/IsAuthenticated";

const httpLink = new HttpLink({ uri: "http://localhost:4000" });

const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/landing">
            <Landing />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <IsAuthenticated>
            <Route path="/users">
              <Users />
            </Route>
          </IsAuthenticated>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
