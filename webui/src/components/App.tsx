import { Route } from "wouter";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Link, useLocation } from "wouter";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

import "./App.css";
import { ApiState, search } from "../api/api";
import { Artist } from "./Artist";
import { Search } from "./Search";
import { Types } from "../types";
import { Player } from "./Player";

/*
TODO:
- Display error
*/

function App() {
  const [query, setQuery] = useState<string>(
    new URLSearchParams(window.location.search).get("query") || ""
  );
  const [, setLocation] = useLocation();
  const [debouncedQuery] = useDebounce<string>(query, 500);
  const [artists, setArtists] = useState<Types.Artist[] | undefined>();
  const [apiState, setApiState] = useState<ApiState>(ApiState.IDLE);
  const [selectedModule, setSelectedModule] = useState<
    Types.Module | undefined
  >();

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      setLocation(`/?query=${debouncedQuery}`);
      setArtists([]);
      setApiState(ApiState.LOADING);
      search(debouncedQuery)
        .then((queryResult) => {
          setArtists(queryResult);
          setApiState(ApiState.IDLE);
        })
        .catch(() => {
          setApiState(ApiState.ERROR);
        });
    }
  }, [debouncedQuery, setLocation]);

  return (
    <div className="App">
      <Route path="/artists/:artistId">
        {(params) => (
          <Artist
            artistId={params.artistId}
            setSelectedModule={setSelectedModule}
          />
        )}
      </Route>
      <Route path="/">{<Search query={debouncedQuery} />}</Route>
      {apiState === ApiState.LOADING && <Spinner animation="grow" />}
      {apiState === ApiState.ERROR && "Error when calling API"}
      {apiState === ApiState.IDLE && artists && (
        <Table hover>
          <thead>
            <tr>
              <th>Handle</th>
              <th>Real name</th>
              <th>Country</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist: Types.Artist) => (
              <tr key={artist.id}>
                <td>
                  <Link key={artist.id} href={`/artists/${artist.id}`}>
                    {artist.handle}
                  </Link>
                </td>
                <td>{artist.real_name}</td>
                <td>{artist.country}</td>
                <td>
                  <a href={artist.amp_url} target="_blank" rel="noreferrer">
                    AMP
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Navbar bg="light" fixed="bottom">
        <Container fluid>
          <Navbar.Brand>AMP Player</Navbar.Brand>
          <Nav>
            <Player module={selectedModule} />
          </Nav>
          <Nav>
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default App;
