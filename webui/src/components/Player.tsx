import { CircularProgress } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { API_HOST } from "../api/api";
import { Module } from "../types";
declare global {
  interface Window {
    Cowbell: any;
  }
}

export function Player(props: { module?: Module }) {
  const [audioElement, setAudioElement] = useState<any>();
  const [track, setTrack] = useState<any>();
  const [progress, setProgress] = useState<number>(0);

  const modPlayer = new window.Cowbell.Player.OpenMPT({
    pathToLibOpenMPT: "/js/libopenmpt.js",
  });

  const play = async () => {
    if (props.module) {
      if (audioElement) {
        audioElement.pause();
      }
      if (track) {
        track.close();
      }
      setProgress(0);
      let t = new modPlayer.Track(`${API_HOST}/modules/${props.module.id}`);
      let ae = t.open();
      ae.ontimeupdate = function () {
        setProgress((ae.currentTime / ae.duration) * 100);
      };
      ae.play();
      setAudioElement(ae);
      setTrack(t);
    }
  };

  useEffect(() => {
    play();
  }, [props.module]);

  return (
    <>
      {props.module && (
        <>
          <div>{props.module.composers.join(",")}</div>
          <div>{props.module.name}</div>
          <CircularProgress value={progress} />
        </>
      )}
    </>
  );
}
