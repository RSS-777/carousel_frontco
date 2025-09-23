<script setup>
import Carousel from "./components/Carousel.vue";
import FavoritesList from "./components/FavoritesList.vue";
import { ref } from "vue";
const images = ref([]);

const fetchImages = async (widht) => {
  try {
    const res = await fetch("https://picsum.photos/v2/list?page=1&limit=30");
    if (res.ok) {
      const data = await res.json();
      images.value = data.map((item) => {
        const w = Math.floor(widht);
        const h = Math.floor((widht * 2) / 3);
        return {
          id: item.id,
          url: `https://picsum.photos/id/${item.id}/${w}/${h}.webp`,
          author: item.author,
        };
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

const handleSlideWidthUpdate = (width) => {
  fetchImages(width);
};
</script>

<template>
  <header class="header">
    <h1 class="header__title">Responsive Image Carousel</h1>
  </header>

  <main>
    <Carousel :images="images" @update-slide-width="handleSlideWidthUpdate" />
    <FavoritesList v-if="images.length" />
  </main>
</template>

<style scoped>
.header__title {
  text-align: center;
  margin: 25px auto 50px;
  padding: 0 10px;
  font-size: clamp(42px, 5vw, 56px);
  font-weight: 800;
}
</style>
