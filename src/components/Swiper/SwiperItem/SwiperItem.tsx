import React from "react";
import { SwiperItemType } from "components/Swiper/lib/types";

import "./SwiperItem.css";

export type Props = SwiperItemType;

function SwiperItem({ img, description }: Props) {
  return (
    <li className="swiper-item">
      <img
        src={img}
        alt={description}
        className="swiper-img"
        draggable={false}
      />
    </li>
  );
}

export default SwiperItem;
