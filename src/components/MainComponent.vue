<template>
  <div>
    <q-btn label="画像の保存" @click="gazou()"> </q-btn>
    <div>
      <input type="file" @change="uploadFile" />
    </div>
    <!-- 画像を表示する -->
    <img id="upload" :src="previewimg" />
    <img id="download" :src="getimage()" alt="" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { upload } from '../utils/firebase/fileupload';
import { getimage } from '../utils/firebase/filedownload';

const route = useRoute();
let uploadimg;
const previewimg = ref();

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
    previewimg.value = preader.result;
  };
  ureader.readAsArrayBuffer(file);
  ureader.onload = function () {
    console.log(ureader.result);
    uploadimg = ureader.result;
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
