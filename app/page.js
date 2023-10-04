"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { KeyboardArrowUp } from "@mui/icons-material";
// import AudioUpload from "@/components/audio-upload";
import Playlist from "@/components/playlist";
import kongo from "@/public/music/kongo.mp3";
import svrati from "@/public/music/Svrati.mp3";
import polaSedam from "@/public/music/PolaSedam.mp3";
import lazuTe from "@/public/music/LazuTe.mp3";
import future from "@/public/music/712PM.mp3";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const Player = dynamic(() => import("@/components/player"), { ssr: false });

export default function Home() {
  const songList = [
    {
      id: 0,
      name: "Kongo",
      artist: "Jala Brat x Buba Corelli x Rile",
      path: kongo,
      coverArt: "",
      explicit: true,
      lyrics: [],
    },
    {
      id: 1,
      name: "Svrati",
      artist: "Voyage",
      path: svrati,
      coverArt: "dea07bee2338e73a7995467a725d3444/264x264.jpg",
      explicit: false,
      lyrics: [],
    },
    {
      id: 2,
      name: "Lazu Te",
      artist: "Amadeus Band",
      path: lazuTe,
      coverArt: "4bc97a43102813399ea1d81570f92e83/500x500.jpg",
      explicit: false,
      lyrics: [],
    },
    {
      id: 3,
      name: "Pola 7",
      artist: "Seksi x Lacku x LeFlow x Bandra",
      path: polaSedam,
      coverArt: "",
      explicit: true,
      lyrics: [],
    },
    {
      id: 4,
      name: "712PM",
      artist: "Future",
      path: future,
      coverArt: "d1bd3da6698dd5eafc5b4514317039c4/500x500.jpg",
      explicit: true,
      lyrics: ["hello"],
    },
  ];
  const [selectedTrack, setSelectedTrack] = useState(songList[0]);

  const handleFilesUpload = (files) => {
    setUploadedFiles(files);
  };

  const coverLoader = ({ src }) => {
    return `https://cdns-images.dzcdn.net/images/cover/${src}`;
  };

  const isBrowser = () => typeof window !== "undefined";
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    setTimeout(() => {
      if (isScrolling) {
        setIsScrolling(true);
      } else setIsScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const ScrollToPlaylist = () => {
    if (!isBrowser()) return;

    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  

  return (
    <main onScroll={handleScroll} className={`${inter.className}`}>
      <div
        className="
      flex w-full h-screen justify-between absolute -z-10 blur-2xl opacity-30 lg:hidden"
      >
        <Image
          loader={coverLoader}
          src={selectedTrack.coverArt}
          width={1000}
          height={1000}
          alt="Background"
          objectFit="cover"
        ></Image>
      </div>
      <section className="inline-block w-full min-h-screen justify-between px-10 md:px-24">
        {/* {uploadedFiles.length == 0 ? (
        <div className="flex items-center h-screen scroll-hidden p-10 z-10">
          <AudioUpload onFilesUpload={handleFilesUpload}></AudioUpload>
          </div>
          ) : (
            <div className="flex items-center h-screen scroll-hidden p-10">
          <Player uploadedFiles={songList}></Player>
          </div>
        )} */}
        <div className="flex items-center min-h-screen scroll-hidden ">
          <Player
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
            uploadedFiles={songList}
          ></Player>
        </div>
      </section>
      <div
        className="flex absolute justify-center z-30 bottom-5 text-center w-full overflow-hidden"
        onClick={ScrollToPlaylist}
        >
        <KeyboardArrowUp className="text-5xl" />
      </div>
      <section className="min-h-screen px-10 md:px-24">
        <Playlist
          uploadedFiles={songList}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
          ></Playlist>
      </section>
    </main>
  );
}
