<template>
  <div>
    <q-btn label="名前のみ" @click="toggleData(false)"></q-btn>
    <q-btn label="詳細" @click="toggleData(true)"></q-btn>
    <q-btn label="表の表示" @click="button(true)"> </q-btn>
    <q-btn label="表の非表示" @click="button(false)"> </q-btn>
    <div v-if="tableshow" class="detail">
      <table border="1">
        <tr>
          <th>氏名</th>
          <th>畑番号</th>
          <th>薬剤名</th>
          <th>登録日</th>
        </tr>
        <tr v-for="p in posts" :key="p.timestamp">
          <td>{{ p.name }}</td>
          <td>{{ p.field_number }}</td>
          <td>{{ p.pesticide }}</td>
          <td>{{ strDate(p.timestamp) }}</td>
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

let name = ref();
let field_number = ref();
let btnmode = ref(false);
let selecting = ref({} as Pesticide);
let tableshow = ref();
let posts = ref([] as Post[]);
const route = useRoute();

onMounted(() => {
  getPosts((data: any) => {
    Object.keys(data).forEach((e) => {
      posts.value.push(data[e]);
    });
    posts.value.sort((a, b) => b.timestamp - a.timestamp);
  });
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
</script>

<style scoped>
.pesticide {
  margin-bottom: 5px;
}
</style>
