import React from "react";

type titleProps = {
  tag: string;
  main: string;
  description: string;
};

const Title = ({ tag, main, description }: titleProps) => {
  return (
    <div className="text">
      <h4 className="text-sky-500 font-bold text-xs">{tag}</h4>
      <h1 className="text-4xl font-bold">{main}</h1>
      <h2 className="text-base italic leading-[22px]">{description}</h2>
    </div>
  );
};

export default Title;
