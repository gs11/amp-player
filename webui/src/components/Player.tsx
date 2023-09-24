import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import ProgressBar from "react-bootstrap/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faPlay,
  faPause,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";

import { API_HOST } from "../api/api";
import { Types } from "../types";
declare global {
  interface Window {
    Cowbell: any;
  }
}

export function Player(props: { module?: Types.Module }) {
  const [audioElement, setAudioElement] = useState<any>();
  const [track, setTrack] = useState<any>();
  const [progress, setProgress] = useState<number>(0);

  const modPlayer = new window.Cowbell.Player.OpenMPT({
    pathToLibOpenMPT: "/js/libopenmpt.js",
  });

  const loadAndPlay = async () => {
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

  const togglePlay = async () => {
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  };

  const blah = (event: any) => {
    console.log(event.target);
  };

  useEffect(() => {
    loadAndPlay();
  }, [props.module]);

  return (
    <>
      {props.module && (
        <>
          <Nav.Item>
            <Button variant="link">
              <FontAwesomeIcon icon={faBackwardStep} color="black" size="lg" />
            </Button>
            <Button variant="link" onClick={togglePlay}>
              <FontAwesomeIcon
                icon={audioElement && audioElement.paused ? faPlay : faPause}
                color="black"
                size="lg"
              />
            </Button>
            <Button variant="link">
              <FontAwesomeIcon icon={faForwardStep} color="black" size="lg" />
            </Button>
            <ProgressBar now={progress} onClick={blah} />
          </Nav.Item>
        </>
      )}
    </>
  );
}
