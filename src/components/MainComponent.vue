<template>
  <div>
    <q-btn label="画像の保存" @click="gazou()"> </q-btn>
    <div>
      <input type="file" @change="uploadFile" />
    </div>
    <!-- 画像を表示する -->
    <div>
      <img id="upload" :src="image" />
    </div>
    <!-- <img id="download" :src="getimage()" alt="" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Post } from './models';
import { getPosts } from '../utils/firebase/read';
import { useRoute } from 'vue-router';
import { jsdata, convertCSVtoArray } from './personal_infomation';
import { upload } from '../utils/firebase/fileupload';
//import { getimage } from '../utils/firebase/filedownload';

let posts = ref([] as Post[]);
let hairetu = ref();
const route = useRoute();
let image;

onMounted(() => {
  getPosts((data: any) => {
    Object.keys(data).forEach((e) => {
      posts.value.push(data[e]);
    });
    posts.value.sort((a, b) => b.timestamp - a.timestamp);
  });

  hairetu.value = convertCSVtoArray(jsdata);
});

watch(route, (n, p) => {
  location.reload();
});

function gazou() {
  upload(image);
}
// v-onで使う関数
const uploadFile = (e: any) => {
  // file情報取得
  const file = e.target.files[0];
  const reader = new FileReader();
  // 取得したファイル情報を
  // (createObjectURL)の引数に入れることでファイルにアクセス可能な
  // (URL)を作成することができます
  // (url)をimageに代入する
  reader.readAsArrayBuffer(file);
  reader.onload = function () {
    image = reader.result;
  };
};
</script>

<style scoped>
.pesticide {
  margin-bottom: 5px;
}
</style>
