import './style.css';
import './reboot.css';
import './block.css';
import 'swiper/swiper-bundle.css';

import { isDesktop } from './breakpoints';

import Swiper from 'swiper';
import gsap from 'gsap';

const gallery = document.querySelector('[data-gallery]');
const mainSliderNode = gallery.querySelector('[data-main-slider]');
const sideSliderNode = gallery.querySelector('[data-side-slider]');

const prev = gallery.querySelector('[data-prev]');
const next = gallery.querySelector('[data-next]');

let sliderMain = null;
let sliderSide = null;

let activeIndex = 0;
let itemsCount = 0;

let animate = false;

const interleaveOffset = 0.5;

const textSlides = gallery.querySelectorAll('[data-text-slide]');
const titleList = gallery.querySelectorAll('[data-title');
const textList = gallery.querySelectorAll('[data-text');

function textToggle() {
  if (!titleList.length && !textList.length) return;

  const tl = gsap.timeline({paused: true, onComplete: () => {
    animate = false;
  }});

  const currentTitle = textSlides[activeIndex].querySelector('[data-title');
  const currentText = textSlides[activeIndex].querySelector('[data-text');

  animate = true;

  tl.to([...titleList, ...textList], {opacity: 0, stagger: 0, duration: 0.2})
    .fromTo([currentTitle, currentText], {opacity: 0, y: 16}, {opacity: 1, y: 0, stagger: 0.1, duration: 0.5});

  tl.play();
}

function progress(slider) {
  for (let i = 0; i < itemsCount; i++) {
    const offset = slider.slides[i].progress * (slider.width * interleaveOffset);
    slider.slides[i].querySelector('.gallery__image').style.transform = `translate3d(${offset}px, 0, 0)`;
  }
}

function touchStart(slider) {
  for (let i = 0; i < itemsCount; i++) {
    slider.slides[i].style.transition = "";
  }
}

function setTransition(slider, transition) {
  for (let i = 0; i < itemsCount; i++) {
    slider.slides[i].style.transition = `${transition}ms`;
    slider.slides[i].querySelector('.gallery__image').style.transition = `${transition}ms`;
  }
}

function slideChange(direction) {
  if(animate) return;

  if (direction === 'prev') {
    sliderMain.slidePrev();
    sliderSide.slidePrev();
  } else if (direction === 'next') {
    sliderMain.slideNext();
    sliderSide.slideNext();
  }
}

sliderMain = new Swiper(mainSliderNode, {
  slidesPerView: "auto",
  simulateTouch: false,
  loop: true,
  followFinger: false,
  speed: 1000,
  watchSlidesProgress: true,
  preventInteractionOnTransition: true,
  on: {
    init: (slider) => {
      itemsCount = slider.slides.length || 0;  
      
      progress(slider);
    },
    progress: (slider) => {
      progress(slider);
    },
    touchStart: (slider) => {
      touchStart(slider);
    },
    setTransition: (slider, transition) => {        
      setTransition(slider, transition);
    },
    slideChange: (slider) => {
      activeIndex = slider.realIndex;
    },
    slideChangeTransitionStart: () => {
      textToggle();
    },
    transitionStart: (slider) => {
      if (slider.swipeDirection === 'prev') {
        sliderSide.slidePrev();
      } else if (slider.swipeDirection === 'next') {
        sliderSide.slideNext();
      }
    }
  }
});

sliderSide = new Swiper(sideSliderNode, {
  slidesPerView: "auto",
  simulateTouch: false,
  speed: 1000,
  watchSlidesProgress: true,
  allowTouchMove: false,
  preventInteractionOnTransition: true,
  loop: true,
  on: {
    init: (slider) => {
      if (isDesktop()) {
        progress(slider);
      }
    },
    progress: (slider) => {
      if (isDesktop()) {
        progress(slider);
      }
    },
    touchStart: (slider) => {
      if (isDesktop()) {
        touchStart(slider);
      }
    },
    setTransition: (slider, transition) => {
      if (isDesktop()) {
        setTransition(slider, transition);
      }
    }
  }
});

prev.addEventListener('click', () => {
  slideChange('prev');
});

next.addEventListener('click', () => {
  slideChange('next');
});