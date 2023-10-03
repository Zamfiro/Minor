import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LibraryMusic } from "@mui/icons-material";



function AudioUpload({onFilesUpload}) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFilesUpload(acceptedFiles);
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="flex flex-col items-center align-middle w-full text-center border border-dashed rounded p-10 cursor-pointer"
      >
        <LibraryMusic className="text-8xl" />
        <input {...getInputProps()} />
        <p className="md:text-3xl text-lg justify-center pt-5">
          Drag and drop files here <br></br> or{" "}
          <b className="hover:underline">click inside the box</b> to upload.
        </p>
      </div>
    </>
  );
}

export default AudioUpload;
