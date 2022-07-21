import React, { useState, useRef } from "react";
import { getRefValue, useStateRef } from "components/Swiper/lib/hooks";
import { getTouchEventData } from "components/Swiper/lib/dom";
import { SwiperItemType, SwiperPropsType } from "components/Swiper/lib/types";
import SwiperItem from "components/Swiper/SwiperItem/SwiperItem";

import "./Swiper.css";
import Title from "./Title/Title";

export type Props = {
  items: SwiperItemType[];
  sliderWidth: number;
};

const MIN_SWIPE_REQUIRED = 40;

function Swiper({ swiperItems, swiperWidth, layout }: SwiperPropsType) {
  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const textBox = useRef<any>();
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    setOffsetX(newOffsetX);
  };
  const onTouchEnd = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef);
    const containerWidth = getRefValue(containerWidthRef);
    let newOffsetX = getRefValue(offsetXRef);

    const diff = currentOffsetX - newOffsetX;

    // we need to check difference in absolute/positive value (if diff is more than 40px)
    if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
      if (diff > 0) {
        // swipe to the right if diff is positive
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
      } else {
        // swipe to the left if diff is negative
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }
    } else {
      // remain in the current image
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentIdx(Math.abs(newOffsetX / containerWidth));
    animateTextBox();

    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mouseup", onTouchEnd);
    window.removeEventListener("mousemove", onTouchMove);
  };
  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    setIsSwiping(true);

    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;

    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    containerWidthRef.current = containerWidth;
    minOffsetXRef.current = containerWidth - containerEl.scrollWidth;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchEnd);
  };
  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    setCurrentIdx(idx);
    setOffsetX(-(containerWidth * idx));
  };

  const animateTextBox = () => {
    textBox.current.classList.remove("text-box-animate");
    setTimeout(() => {
      console.log("timeout");

      textBox.current.classList.add("text-box-animate");
    }, 10);
  };

  return (
    <div className="swiper-wrapper">
      <Title
        tag={"features"}
        main={"Take a closer look at our brand new head office"}
        description={"Designed to make you sleep better"}
      />
      <div className="swiper">
        <div
          className="swiper-container"
          onTouchStart={onTouchStart}
          onMouseDown={onTouchStart}
          style={{ width: swiperWidth }}
        >
          <ul
            ref={containerRef}
            className={`swiper-list ${isSwiping ? "is-swiping" : ""}`}
            style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
          >
            {swiperItems.map((item, idx) => (
              <SwiperItem key={idx} {...item} />
            ))}
          </ul>
          <ul className="swiper-indicator">
            {swiperItems.map((_item, idx) => (
              <li
                key={idx}
                className={`swiper-indicator-item ${
                  currentIdx === idx ? "active" : ""
                }`}
                onClick={() => indicatorOnClick(idx)}
                data-testid="indicator"
              />
            ))}
          </ul>
        </div>
        <div className="text-box-div">
          <p className="text-box" ref={textBox} key={`desc-${currentIdx}`}>
            {swiperItems[currentIdx].description}
          </p>
        </div>

        <span className="swiper-number-indicator">
          0{currentIdx + 1}/0{swiperItems.length}
        </span>
      </div>
    </div>
  );
}

export default Swiper;
