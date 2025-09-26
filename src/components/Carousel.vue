<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useSelectedImagesStore } from "../stores/selectedImages";

const { images } = defineProps({
  images: Array,
});

const emit = defineEmits(["update-slide-width"]);

const currentIndex = ref(0);
const visibleCount = ref(1);
const slideWidth = ref(0);
const carouselBlock = ref(null);
const isTransitioning = ref(false);
const selectedStore = useSelectedImagesStore();

const getVisibleCount = () => {
  const width = window.innerWidth;
  if (width < 560) return 1;
  if (width < 768) return 2;
  if (width < 900) return 3;
  if (width < 1024) return 4;
  return 5;
};

const setSlideWidth = () => {
  if (carouselBlock.value) {
    visibleCount.value = getVisibleCount();
    slideWidth.value = carouselBlock.value.offsetWidth / visibleCount.value;
    emit("update-slide-width", slideWidth.value);
    currentIndex.value = visibleCount.value;
  }
};

const extendedImages = computed(() => {
  if (!images.length) return [];
  const firstClones = images.slice(-visibleCount.value);
  const lastClones = images.slice(0, visibleCount.value);
  return [...firstClones, ...images, ...lastClones];
});

const trackStyle = computed(() => {
  return {
    transform: `translateX(-${currentIndex.value * slideWidth.value}px)`,
    transition: isTransitioning.value ? "transform 0.3s ease" : "none",
  };
});

const scrollNext = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentIndex.value++;
};

const scrollPrev = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentIndex.value--;
};

const handleTransitionEnd = async () => {
  const total = images.length;
  if (currentIndex.value >= total + visibleCount.value) {
    currentIndex.value = visibleCount.value;
  } else if (currentIndex.value < visibleCount.value) {
    currentIndex.value = total + visibleCount.value - 1;
  }

  isTransitioning.value = false;
};

const handleAddFavorite = (obj) => {
  const exists = selectedStore.selected.some((i) => i.id === obj.id);
  if (exists) {
    selectedStore.removeSelected(obj.id);
  } else {
    selectedStore.addSelected(obj);
  }
};

onMounted(() => {
  setSlideWidth();
  window.addEventListener("resize", setSlideWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", setSlideWidth);
});
</script>

<template>
  <div class="carousel">
    <div class="carousel__viewport" ref="carouselBlock">
      <div
        class="carousel__track"
        :style="trackStyle"
        @transitionend="handleTransitionEnd"
      >
        <div
          class="carousel__item"
          v-for="(img, index) in extendedImages"
          :key="`${img.id}-${index}`"
          :style="{ width: `${slideWidth}px` }"
          @click="handleAddFavorite(img)"
        >
          <img
            :src="img.url"
            :alt="`Photo by ${img.author}`"
            class="carousel__img"
          />
          <span
            v-if="selectedStore.selected.some((i) => i.id === img.id)"
            class="carousel__heart"
          >
            ❤️
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="carousel__btn carousel__btn--prev"
      @click="scrollPrev"
    >
      ‹
    </button>
    <button
      type="button"
      class="carousel__btn carousel__btn--next"
      @click="scrollNext"
    >
      ›
    </button>
  </div>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0.5px 0.5px 8px 0px black;
}

.carousel__viewport {
  overflow: hidden;
  width: 100%;
}

.carousel__track {
  display: flex;
  will-change: transform;
}

.carousel__item {
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
}

.carousel__heart {
  position: absolute;
  z-index: 3;
  top: 10px;
  right: 10px;
}

.carousel__img {
  width: 100%;
  height: auto;
  display: block;
  transition: outline 0.3s ease;
}

.carousel__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  color: white;
  transition: color 0.2s ease;
}

.carousel__btn--prev {
  left: 0;
}

.carousel__btn--next {
  right: 0;
}

@media (hover: hover) and (pointer: fine) {
  .carousel__img:hover {
    outline: 2px solid rgb(239, 125, 43);
    outline-offset: -2px;
  }

  .carousel__btn:hover {
    color: rgb(32, 66, 255);
  }
}

@media (hover: none), (pointer: coarse) {
  .carousel__img:hover {
    outline: none;
    outline-offset: 0;
  }

  .carousel__btn:active {
    color: rgb(32, 66, 255);
  }
}
</style>
