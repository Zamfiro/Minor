import React from "react";
import { PlayArrow, Explicit } from "@mui/icons-material";

function Playlist({ uploadedFiles, selectedTrack, setSelectedTrack }) {
  return (
    <div>
      <h1 className=" text-5xl font-bold pb-5 pt-20">Playlist</h1>
      {uploadedFiles.length != 0 ? (
        <div>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className={
                file.id === selectedTrack.id
                  ? "text-xl py-5  bg-gray-500 bg-opacity-30 md:hover:bg-opacity-70 border-0 rounded-md hover:cursor-pointer"
                  : "text-xl py-5  md:hover:bg-gray-500 md:hover:bg-opacity-70 border-0 rounded-md hover:cursor-pointer"
              }
              onClick={() => setSelectedTrack(file)}
            >
              <div className="flex items-center">
                {file.id === selectedTrack.id ? (
                  <PlayArrow className="text-xl mx-5" />
                ) : (
                  <div className="text-xl px-5 opacity-30">{file.id + 1}</div>
                )}
                <div>
                  {file.name.split(".mp3")}{" "}
                  {file.explicit && <Explicit className="text-gray-500"/> }
                  <br />{" "}
                  <span className="text-sm opacity-30">{file.artist}</span>
                  {/* hello */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>Your queue is empty</h1>
      )}
    </div>
  );
}

export default Playlist;
