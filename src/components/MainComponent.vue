<template>
  <div>
    <q-btn label="名前のみ" @click="toggleData(false)"></q-btn>
    <q-btn label="詳細" @click="toggleData(true)"></q-btn>
    <q-btn label="表の表示" @click="button(true)"> </q-btn>
    <q-btn label="表の非表示" @click="button(false)"> </q-btn>
    <q-btn label="画像の保存" @click="gazou()"> </q-btn>
    <div>
      <input type="file" @change="uploadFile" />
    </div>
    <!-- 画像を表示する -->
    <div>
      <img :src="image" />
    </div>

    <div v-if="tableshow" class="detail">
      <table border="1">
        <tr>
          <th>氏名</th>
          <th>シメイ</th>
          <th>電話番号</th>
          <th>郵便番号</th>
          <th>住所</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th>生年月日</th>
        </tr>
        <tr v-for="p in hairetu" :key="p[0]">
          <td>{{ p[1] }}</td>
          <td>{{ p[2] }}</td>
          <td>{{ p[3] }}</td>
          <td>{{ p[4] }}</td>
          <td>{{ p[5] }}</td>
          <td>{{ p[6] }}</td>
          <td>{{ p[7] }}</td>
          <td>{{ p[8] }}</td>
          <td>{{ p[9] }}</td>
          <td>{{ p[10] }}</td>
        </tr>
      </table>
    </div>

    <q-input v-model="name" label="氏名" />
    <q-input v-model="field_number" label="畑番号" />

    <div v-for="p in pesticides" :key="p.name" class="pesticide">
      <q-btn
        @click="clickPesticide(p)"
        :color="checkColor(p)"
        text-color="black"
      >
        {{ p.name }}
      </q-btn>

      <div v-if="btnmode" class="detail">
        希釈倍率:{{ p.dilution_ratio }}
        {{ p.target }}
      </div>
    </div>
    <q-btn label="送信" color="primary" @click="submit()"></q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { Pesticide, Post } from './models';
import { addPost } from '../utils/firebase/write';
import { Notify } from 'quasar';
import { getPosts } from '../utils/firebase/read';
import { useRoute } from 'vue-router';
import { jsdata, convertCSVtoArray } from './personal_infomation';
import { upload } from '../utils/firebase/fileupload';
import { Console } from 'console';

let name = ref();
let field_number = ref();
let btnmode = ref(false);
let selecting = ref({} as Pesticide);
let tableshow = ref();
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
  console.log(convertCSVtoArray(jsdata));
});

watch(route, (n, p) => {
  location.reload();
});

interface Props {
  pesticides?: Pesticide[];
  active: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  pesticides: () => [],
});

function clickPesticide(p: Pesticide) {
  selecting.value = p;
  return false;
}

function submit() {
  addPost(makePostData());
  Notify.create('送信しました');
  return false;
}

function toggleData(b: boolean) {
  btnmode.value = b;
  return true;
}

function checkColor(p: Pesticide) {
  if (p.name == selecting.value.name) {
    return 'light-green-4';
  } else {
    return 'white';
  }
}

function makePostData() {
  let post = {
    name: name.value,
    field_number: field_number.value,
    pesticide: selecting.value.name,
  };
  return post;
}

function button(c: boolean) {
  tableshow.value = c;
  return true;
}

function strDate(ts: number) {
  const date = new Date(ts);
  return (
    date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  );
}

function gazou() {
  upload(image);
  console.log(image);
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
    console.log(reader.result);
    image = reader.result;
  };
};
</script>

<style scoped>
.pesticide {
  margin-bottom: 5px;
}
</style>
