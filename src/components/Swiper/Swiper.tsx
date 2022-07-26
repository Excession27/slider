import React, { useState, useRef, useEffect } from "react";
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

function Swiper({
  swiperItems,
  swiperWidth,
  layout,
  title,
  autoplay,
}: SwiperPropsType) {
  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const textBox = useRef<any>();
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevHeight, setPrevHeight] = useState();
  const [sliderContent, setSliderContent] = useState("");

  useEffect(() => {
    if (sliderContent) {
      setTimeout(() => {
        textBox.current.classList.add("text-p-animate");
        setPrevHeight(textBox?.current.clientHeight);
      }, 200);
    }
  }, [sliderContent]);

  useEffect(() => {
    setSliderContent(swiperItems[currentIdx].description);
  }, [currentIdx, swiperItems]);

  useEffect(() => {
    let counter = 0;
    if (autoplay && !isSwiping) {
      const interval = setInterval(() => {
        if (counter > swiperItems.length - 1) {
          counter = 0;
        }
        indicatorOnClick(counter);

        setCurrentIdx(counter);
        counter++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

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
    console.log("indicator", idx);

    setCurrentIdx(idx);
    setOffsetX(-(containerWidth * idx));
  };

  // useEffect(() => {
  //   if (autoplay) {
  //     const iv = setTimeout(() => {
  //       console.log(currentIdx, "before pass");
  //       indicatorOnClick(currentIdx);
  //       const newIdx =
  //         currentIdx === swiperItems.length - 1 ? 0 : currentIdx + 1;
  //       setCurrentIdx(newIdx);
  //       console.log(currentIdx, "after pass", newIdx, "nIdx");
  //     }, 2000);
  //     return () => clearTimeout(iv);
  //   }
  // });

  return (
    <div
      style={{ width: swiperWidth }}
      className={`swiper-wrapper swiper-wrapper-${layout}`}
    >
      <Title
        tag={title.tag}
        main={title.main}
        description={title.description}
        layout={layout}
      />
      <div className="swiper">
        <div
          className="swiper-container"
          onTouchStart={onTouchStart}
          onMouseDown={onTouchStart}
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
        <div className={`text-wrapper-${layout}`}>
          <div className="text-div" style={{ height: `${prevHeight}px` }}>
            <p
              id="textBox"
              className="text-box"
              ref={textBox}
              key={`desc-${currentIdx}`}
            >
              {sliderContent}
            </p>
          </div>
        </div>

        <span
          className={`swiper-indicator-numbers swiper-indicator-numbers-${layout}`}
        >
          {`${currentIdx + 1 < 10 ? `0${currentIdx + 1}` : currentIdx + 1} `}/
          {` ${
            swiperItems.length < 10
              ? `0${swiperItems.length}`
              : swiperItems.length
          }`}
        </span>
      </div>
    </div>
  );
}

export default Swiper;
