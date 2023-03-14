import {
  Button,
  CircularProgress,
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
import { useDebounce } from "use-debounce";

import { ApiState, getArtistModules, getModuleBytes } from "../api/api";
import { Module } from "../types";

declare global {
  interface Window {
    Cowbell: any;
  }
}
const LIBOPENMPT_SUPPORTED_FORMATS = [
  "DBM",
  "FST",
  "IT",
  "MED",
  "MOD",
  "OKT",
  "S3M",
  "STK",
  "STM",
  "XM",
];

export function Artist(props: any) {
  const artistId = props.params.artistId;
  const [modules, setModules] = useState<Module[]>([]);
  const [apiState, setApiState] = useState<ApiState>(ApiState.IDLE);
  const [modPlayer, setModPlayer] = useState<any>();
  const [audioElement, setAudioElement] = useState<any>();
  const [selectedModuleId, setSelectedModuleId] = useState<number>();
  const [selectedModuleProgress, setSelectedModuleProgress] =
    useState<number>(0);
  const [debouncedSelectedModuleProgress] = useDebounce(
    selectedModuleProgress,
    1000
  );

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
    setModPlayer(
      new window.Cowbell.Player.OpenMPT({
        pathToLibOpenMPT: "/js/libopenmpt.js",
      })
    );
  }, [artistId]);

  const getNextModuleId = (moduleId: number): number => {
    let playableModules =
      modules?.filter((module) =>
        LIBOPENMPT_SUPPORTED_FORMATS.includes(module.format)
      ) ?? [];
    let moduleIndex = playableModules
      .map(function (e) {
        return e.id;
      })
      .indexOf(moduleId);
    if (moduleIndex === playableModules.length - 1) {
      return playableModules[0].id;
    } else {
      return playableModules[moduleIndex + 1].id;
    }
  };

  const loadPlayPause = async (moduleId: number) => {
    if (moduleId !== selectedModuleId) {
      if (audioElement) {
        audioElement.pause();
      }
      const a = await getModuleBytes(moduleId);
      let t = new modPlayer.Track(a);
      let ae = t.open();
      ae.onended = function () {
        loadPlayPause(getNextModuleId(moduleId));
      };
      ae.ontimeupdate = function () {
        setSelectedModuleProgress((ae.currentTime / ae.duration) * 100);
      };
      ae.play();

      setAudioElement(ae);
      setSelectedModuleId(moduleId);
      setSelectedModuleProgress(0);
    } else {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  };

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
                          module.id === selectedModuleId ? "green" : "gray"
                        }
                        size="sm"
                        onClick={() => loadPlayPause(module.id)}>
                        {module.id === selectedModuleId ? "Play/Pause" : "Play"}
                      </Button>
                    )}
                  </Td>
                  <Td>
                    {" "}
                    {module.id === selectedModuleId && (
                      <CircularProgress
                        size="32px"
                        value={debouncedSelectedModuleProgress}
                      />
                    )}
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
