<script setup>
import { useSelectedImagesStore } from "../stores/selectedImages";

const selectedStore = useSelectedImagesStore();

const handleDeleteFavorite = (id) => {
  selectedStore.removeSelected(id);
};
</script>

<template>
  <div class="selected" v-if="selectedStore.selected.length">
    <h2 class="selected__title">Selected Images</h2>
    <ul class="selected__list">
      <li v-for="item in selectedStore.selected" :key="item.id" class="selected__item">
        <div>
          <img :src="item.url" :alt="`Photo by ${item.author}`" class="selected__img" />
          <span class="selected__url" :title="item.url">{{
            item.url.length > 25 ? item.url.slice(0, 25) + "..." : item.url
          }}</span>
        </div>
        <button class="selected__button" type="button" @click="handleDeleteFavorite(item.id)">
          Delete
        </button>
      </li>
    </ul>
  </div>
  <p v-else class="not-selected">You don't have any favorite photos yet...</p>
</template>

<style scoped>
.selected__title {
  margin: 20px;
  text-align: center;
  font-weight: 400;
}

.selected__list {
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 10px;
  max-height: 150px;
  max-width: 450px;
  margin: 0 auto 5px;
  padding: 10px;
  border-radius: 5px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.713);
  box-shadow: 0.5px 0.5px 8px 0 black;
}

.selected__item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 2px solid gray;
}

.selected__img {
  width: 26px;
}

.selected__url {
  font-size: 16px;
  font-weight: 400;
  margin-left: 10px;
  cursor: pointer;
}

.selected__button {
  border: none;
  border-radius: 10px;
  background: linear-gradient(145deg,
      rgba(180, 147, 113, 0.896),
      rgb(191, 106, 27),
      rgba(180, 147, 113, 0.896));
  color: white;
  font-size: 12px;
  padding: 2px 10px;
  cursor: pointer;
  box-shadow: 1px 1px 3px 0 black;
  transition: 0.3s;
}

.selected__button:hover {
  box-shadow: 0.5px 0.5px 1px 0 black;
}

.not-selected {
  margin-top: 20px;
  font-weight: 400;
  font-style: italic;
}

@media (min-width: 768px) {
  .selected__item {
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 0;
    border: 0;
  }
}
</style>
