import {
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { ApiState, getArtistModules } from "../api/api";
import { Module } from "../types";
import { Player } from "./Player";

const LIBOPENMPT_SUPPORTED_FORMATS = [
  "DBM",
  "FST",
  "IT",
  "MED",
  "MOD",
  "OKT",
  "OSS",
  "S3M",
  "STK",
  "STM",
  "XM",
];

export function Artist(props: { params: { artistId: any } }) {
  const artistId = props.params.artistId;
  const [modules, setModules] = useState<Module[]>([]);
  const [apiState, setApiState] = useState<ApiState>(ApiState.IDLE);
  const [selectedModule, setSelectedModule] = useState<Module | undefined>();

  useEffect(() => {
    setApiState(ApiState.LOADING);
    getArtistModules(artistId)
      .then((artistModules) => {
        setModules(artistModules);
        setApiState(ApiState.IDLE);
      })
      .catch(() => {
        setApiState(ApiState.ERROR);
      });
  }, [artistId]);

  return (
    <>
      {apiState === ApiState.LOADING && <Spinner size="xl" thickness="4px" />}
      {apiState === ApiState.ERROR && "Error when calling API"}
      {apiState === ApiState.IDLE && modules && (
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Composers</Th>
                <Th>Format</Th>
                <Th>Size</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {modules.map((module: Module) => (
                <Tr key={module.id}>
                  <Td>{module.name}</Td>
                  <Td>{module.composers.join(", ")}</Td>
                  <Td>{module.format}</Td>
                  <Td>{module.size}</Td>
                  <Td>
                    {LIBOPENMPT_SUPPORTED_FORMATS.includes(module.format) && (
                      <Button
                        colorScheme={
                          selectedModule && module.id === selectedModule.id
                            ? "green"
                            : "gray"
                        }
                        size="sm"
                        onClick={() => setSelectedModule(module)}>
                        Play
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Player module={selectedModule} />
    </>
  );
}
