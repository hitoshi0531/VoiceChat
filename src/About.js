import React from "react";
import ReactPlayer from "react-player/youtube";

const MyVideo = () => {
  return (
    <div>
      <MyVideo />
    </div>
  );
};



function About() {
    return (
       <div>
            <h1>About Our Concept</h1>
            <ReactPlayer
                className="reactPlayer"
                url='https://youtu.be/56gx9uEkgY0?si=2gncugksXV2y_7fO'
                playing={false}
                volume={0.5}
                controls={true}
            />
        </div>
        );
};

export default About
