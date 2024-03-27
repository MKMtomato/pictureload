<template>
  <div>
    <q-btn label="画像の保存" @click="gazou()"> </q-btn>
    <div>
      <input type="file" @change="uploadFile" />
    </div>
    <!-- 画像を表示する -->
    <img id="upload" :src="previewimg" />
    <img id="download" :src="getimage()" alt="" />
    <img
      id="downloadtest"
      src="https://firebasestorage.googleapis.com/v0/b/seisanrireki.appspot.com/o/image.png?alt=media&token=f519d267-bd1b-4796-af27-6da006d3427ed"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Post } from './models';
import { getPosts } from '../utils/firebase/read';
import { useRoute } from 'vue-router';
import { jsdata, convertCSVtoArray } from './personal_infomation';
import { upload } from '../utils/firebase/fileupload';
import { getimage } from '../utils/firebase/filedownload';

let posts = ref([] as Post[]);
let hairetu = ref();
const route = useRoute();
const uploadimg = ref();
const previewimg = ref();

onMounted(() => {
  getPosts((data: any) => {
    Object.keys(data).forEach((e) => {
      posts.value.push(data[e]);
    });
    posts.value.sort((a, b) => b.timestamp - a.timestamp);
  });

  hairetu.value = convertCSVtoArray(jsdata);
  console.log(convertCSVtoArray(jsdata));
});

watch(route, (n, p) => {
  location.reload();
});

function gazou() {
  upload(uploadimg);
  console.log(uploadimg);
}
// v-onで使う関数
const uploadFile = (e: any) => {
  // file情報取得
  const file = e.target.files[0];
  const preader = new FileReader();
  const ureader = new FileReader();
  // 取得したファイル情報を
  // (createObjectURL)の引数に入れることでファイルにアクセス可能な
  // (URL)を作成することができます
  // (url)をimageに代入する
  preader.readAsDataURL(file);
  preader.onload = function () {
    console.log(preader.result);
    previewimg.value = preader.result;
  };
  ureader.readAsArrayBuffer(file);
  ureader.onload = function () {
    console.log(ureader.result);
    uploadimg.value = ureader.result;
  };
};
</script>

<style scoped>
.pesticide {
  margin-bottom: 5px;
}
#downloadtest {
  width: 300px;
}
</style>
