import React, { useState, useRef, useEffect, useCallback } from "react";
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

function Swiper({
  swiperItems,
  swiperWidth,
  layout,
  title,
  autoplay,
}: SwiperPropsType) {
  const MIN_SWIPE_REQUIRED = swiperWidth * (layout === "center" ? 0.4 : 0.2);
  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const textBox = useRef<HTMLParagraphElement>(null);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const currentIdx = useRef<number>(0);
  const [prevHeight, setPrevHeight] = useState<number | undefined>(0);
  const [sliderContent, setSliderContent] = useState("");

  const indicatorOnClick = useCallback(
    (idx: number) => {
      const containerEl = getRefValue(containerRef);
      const containerWidth = containerEl.offsetWidth;

      currentIdx.current = idx;
      setOffsetX(-(containerWidth * idx));
    },
    [setOffsetX]
  );

  useEffect(() => {
    if (sliderContent) {
      textBox?.current?.classList.add("text-p-animate");
      setPrevHeight(textBox?.current?.clientHeight);
    }
  }, [sliderContent]);

  useEffect(() => {
    setSliderContent(swiperItems[currentIdx.current].description);
  }, [currentIdx.current, swiperItems]);

  useEffect(() => {
    if (autoplay?.isOn && !isSwiping) {
      const interval = setInterval(() => {
        currentIdx.current = currentIdx.current + 1;
        if (currentIdx.current > swiperItems.length - 1) {
          currentIdx.current = 0;
        }
        indicatorOnClick(currentIdx.current);
      }, autoplay.delay);
      return () => clearInterval(interval);
    }
  }, [isSwiping, autoplay?.isOn, swiperItems.length, indicatorOnClick]);

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = MIN_SWIPE_REQUIRED;
    const minOffsetX = getRefValue(minOffsetXRef) - MIN_SWIPE_REQUIRED;

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
    currentIdx.current = Math.abs(newOffsetX / containerWidth);

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
                  currentIdx.current === idx ? "active" : ""
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
              key={`desc-${currentIdx.current}`}
            >
              {sliderContent}
            </p>
          </div>
        </div>

        <span
          className={`swiper-indicator-numbers swiper-indicator-numbers-${layout}`}
        >
          {`${
            currentIdx.current + 1 < 10
              ? `0${currentIdx.current + 1}`
              : currentIdx.current + 1
          } `}
          /
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
