<template>
  <div>
    <q-btn label="名前のみ" @click="toggleData(false)"></q-btn>
    <q-btn label="詳細" @click="toggleData(true)"></q-btn>
    <q-btn label="表の表示" @click="button"></q-btn>

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
import { computed, ref } from 'vue';
import { Pesticide, Post } from './models';
import { addPost } from '../utils/firebase/write';
import { Notify } from 'quasar';

let name = ref();
let field_number = ref();
let btnmode = ref(false);
let selecting = ref({} as Pesticide);

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

//function button{}  ShowPage.vueを表示させたい
</script>

<style scoped>
.pesticide {
  margin-bottom: 5px;
}
</style>
