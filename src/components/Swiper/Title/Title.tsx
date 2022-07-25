import React from "react";
import { LayoutType, TitleType } from "../lib/types";
import "./Title.css";

type titleProps = TitleType & LayoutType;

const Title = ({ tag, main, description, layout }: titleProps) => {
  return (
    <div className={`title-wrapper title-wrapper-${layout} `}>
      <h5 className="title__tag">{tag}</h5>
      <h2 className="title__main">{main}</h2>
      <h4 className="title__description">{description}</h4>
    </div>
  );
};

export default Title;
