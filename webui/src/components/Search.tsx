import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

import { ApiState, getArtistModules } from "../api/api";
import { Types } from "../types";

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

export function Search(props: { query?: string }) {
  const artistId = parseInt(props.artistId || "");
  const [modules, setModules] = useState<Types.Module[]>([]);
  const [apiState, setApiState] = useState<ApiState>(ApiState.IDLE);

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
      {apiState === ApiState.LOADING && <Spinner />}
      {apiState === ApiState.ERROR && "Error when calling API"}
      {apiState === ApiState.IDLE && modules && (
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Composers</th>
              <th>Format</th>
              <th>Size</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module: Types.Module) => (
              <tr key={module.id}>
                <td>{module.name}</td>
                <td>{module.composers.join(", ")}</td>
                <td>{module.format}</td>
                <td>{module.size}</td>
                <td>
                  {LIBOPENMPT_SUPPORTED_FORMATS.includes(module.format) && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        props.setSelectedModule(module);
                      }}>
                      Play
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
