import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firestorage = getStorage();

const gsReference = ref(firestorage, 'gs://seisanrireki.appspot.com/image.png');

export function getimage() {
  getDownloadURL(gsReference)
    .then((url) => {
      console.log(url);
      return url;
    })
    .catch((err) => {
      console.log(err);
      return '';
    });
}
