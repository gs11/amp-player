import {
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Link, useLocation } from "wouter";

import { ApiState, search } from "../api/api";
import { Artist } from "../types";

export function Search() {
  const [query, setQuery] = useState<string>(
    new URLSearchParams(window.location.search).get("query") || ""
  );
  const [, setLocation] = useLocation();
  const [debouncedQuery] = useDebounce<string>(query, 500);
  const [results, setResults] = useState<Artist[] | undefined>();
  const [apiState, setApiState] = useState<ApiState>(ApiState.IDLE);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      setLocation(`/?query=${debouncedQuery}`);
      setApiState(ApiState.LOADING);
      search(debouncedQuery)
        .then((queryResult) => {
          setResults(queryResult);
          setApiState(ApiState.IDLE);
        })
        .catch(() => {
          setApiState(ApiState.ERROR);
        });
    }
  }, [debouncedQuery, setLocation]);

  return (
    <>
      <Input
        size="sm"
        placeholder="Type here"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className="input input-bordered w-full max-w-xs"
      />
      {apiState === ApiState.LOADING && "Loading..."}
      {results && (
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Handle</Th>
                <Th>Real name</Th>
                <Th>Country</Th>
                <Th>Link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((artist: Artist) => (
                <Tr key={artist.id}>
                  <Td>
                    <Link key={artist.id} href={`/artists/${artist.id}`}>
                      {artist.handle}
                    </Link>
                  </Td>
                  <Td>{artist.real_name}</Td>
                  <Td>{artist.country}</Td>
                  <Td>
                    <a href={artist.amp_url} target="_blank" rel="noreferrer">
                      AMP
                    </a>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}