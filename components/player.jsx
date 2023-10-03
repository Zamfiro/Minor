"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  AudioFile,
  PlayCircle,
  PauseCircle,
  SkipNext,
  SkipPrevious,
  Explicit,
  LyricsOutlined,
  Shuffle,
} from "@mui/icons-material";
import classNames from "tailwindcss-classnames";
import WaveSurfer from "wavesurfer.js";
import Image from "next/image";
import Lyrics from "./lyrics";

function Player({ uploadedFiles, selectedTrack, setSelectedTrack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferRef = useRef(null);
  const wavesurfer = useRef(null);
  const audioRef = useRef(null);
  const [timeEl, setTimeEl] = useState(0);
  const [durationEl, setDurationEl] = useState(0);
  const currentAudioFile = selectedTrack;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const [isShuffling, setIsShuffling] = useState(false);

  const handleNextTrack = useCallback(() => {
    let nextTrack = uploadedFiles.find(
      (file) => file.id === selectedTrack.id + 1
    );

    if (currentAudioFile.id === uploadedFiles.at(-1).id) {
      nextTrack = uploadedFiles.find((file) => file.id === 0);

      setSelectedTrack(nextTrack);
      // wavesurfer.current.pause();
    } else {
      setSelectedTrack(nextTrack);
    }
  }, [currentAudioFile.id, selectedTrack.id, setSelectedTrack, uploadedFiles]);

  useEffect(() => {
    if (!audioRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: wavesurferRef.current,
      backend: "WebAudio",
      waveColor: "white",
      progressColor: "gray",
      cursorColor: "white",
      dragToSeek: true,
      interact: true,
      barWidth: 5,
      barRadius: 10,
      height: 30,
      autoplay: true,
      barAlign: "middle",
      normalize: false,
      partialRender: true,
    });

    wavesurfer.current.on("play", () => {
      setIsPlaying(true);
    });

    wavesurfer.current.on("pause", () => {
      setIsPlaying(false);
    });

    wavesurfer.current.on("finish", () => {
      handleNextTrack();
    });

    wavesurfer.current.on("decode", (duration) => {
      setDurationEl(formatTime(duration));
    });
    wavesurfer.current.on("timeupdate", (currentTime) => {
      setTimeEl(formatTime(currentTime));
    });
    wavesurfer.current.load(currentAudioFile.path);

    return () => {
      wavesurfer.current.destroy();
      wavesurfer.current = null;
      
    };
  }, [currentAudioFile, handleNextTrack]);

  // const handlePlayPause = () => {
  //   wavesurfer.current.playPause();
  //   setIsPlaying(!isPlaying);
  // };

  const handlePreviousTrack = () => {
    let nextTrack = {};

    nextTrack = uploadedFiles.find((file) => file.id === selectedTrack.id - 1);

    if (currentAudioFile.id === uploadedFiles.at(0).id) {
      return;
    } else {
      setSelectedTrack(nextTrack);
    }
  };

  const coverLoader = ({ src }) => {
    return `https://cdns-images.dzcdn.net/images/cover/${src}`;
  };

  const [lyricsShown, setLyricsShown] = useState(false);

  const lyricsClass = classNames(
    "absolute text-5xl [text-shadow:_0_5px_10px_rgb(0_0_0_/_100%)] transition-all ease-in delay-75 ease-out delay-0",
    {
      ["opacity-0"]: !lyricsShown,
      ["opacity-100"]: lyricsShown,
      ["-z-20"]: !lyricsShown,
      ["z-20"]: lyricsShown,
    }
  );

  return (
    <div className="flex flex-col items-center w-full  md:flex-row">
      <div className="flex flex-col justify-center items-center w-full md:h-fit md:w-fit shadow-2xl border-4 md:flex md:items-left">
        <Lyrics
          selectedTrackLyrics={currentAudioFile.lyrics}
          lyricsClass={lyricsClass}
        />

        {currentAudioFile.coverArt === "" ? (
          <div className={lyricsShown ? "blur-sm transition-all" : undefined}>
            <AudioFile className="text-9xl h-[390px] w-[390px]" />
          </div>
        ) : (
          <div
            className={
              lyricsShown
                ? "blur-sm tranistion duration-150 ease-in delay-75"
                : undefined
            }
          >
            <Image
              loader={coverLoader}
              src={currentAudioFile.coverArt}
              alt="coverArt"
              width={1000}
              height={1000}
              loading="eager"
              priority={true}
            ></Image>
          </div>
        )}
      </div>

      {currentAudioFile ? (
        <div className="flex flex-col w-full pt-5 text-left align-middle md:pl-10">
          <h1 className="flex text-4xl">
            {currentAudioFile.name}
            <span className="pl-2">
              {currentAudioFile.explicit ? (
                <Explicit className="text-gray-500 text-2xl" />
              ) : undefined}
            </span>
          </h1>
          <h1 className="text-lg opacity-30">{currentAudioFile.artist}</h1>

          <div className="pt-5">
            <audio
              ref={audioRef}
              src={currentAudioFile.path}
              type="audio/mpeg"
            />
            <div ref={wavesurferRef}></div>
            <div className="flex width-full justify-between  text-gray-500 pt-3">
              <div className="">{timeEl}</div>
              <div className="">{durationEl}</div>
            </div>

            <div className="flex w-full justify-center items-center pt-10 space-x-10">
              <div
                className={`${
                  currentAudioFile.lyrics.length == 0
                    ? "disabled invisible"
                    : "visible"
                } items-center justify-self-left md:hover:bg-gray-500 rounded-md p-3 ${
                  lyricsShown ? "bg-gray-500" : "bg-transparent"
                }`}
                onClick={() =>
                  currentAudioFile.lyrics.length !== 0
                    ? setLyricsShown(!lyricsShown)
                    : setLyricsShown(false)
                }
              >
                <LyricsOutlined className="text-2xl" />
              </div>
              <div className="flex justify-self-center justify-center w-fit">
                <div onClick={handlePreviousTrack}>
                  <SkipPrevious className="text-6xl md:hover:text-gray-400" />
                </div>
                <div
                  onClick={() => {
                    wavesurfer.current.playPause();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? (
                    <PauseCircle className="text-6xl md:hover:text-gray-400" />
                  ) : (
                    <PlayCircle className="text-6xl md:hover:text-gray-400" />
                  )}
                </div>
                <div onClick={handleNextTrack}>
                  <SkipNext className="text-6xl md:hover:text-gray-400" />
                </div>
              </div>
              <div
                className={`items-center justify-self-left md:hover:bg-gray-500 rounded-md p-3 ${
                  isShuffling ? "bg-gray-500" : "bg-transparen"
                }`}
                onClick={() => setIsShuffling(!isShuffling)}
              >
                <Shuffle className="text-2xl" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No audio is currently playing.</p>
      )}
    </div>
  );
}

export default Player;
