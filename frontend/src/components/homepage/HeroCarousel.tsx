// components/homepage/HeroCarousel.tsx
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import FeatureSlide from "./FeatureSlide";
import { slideData } from "./SlideData";

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 10000 }}
      loop
      className="w-full"
    >
      {slideData.map((slide, i) => (
        <SwiperSlide key={i}>
          <FeatureSlide {...slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
