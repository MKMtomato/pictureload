import { getStorage, ref, uploadBytes } from 'firebase/storage';

// Create a root reference
function strDate() {
  const date = new Date();
  return (
    date.getFullYear() +
    '.' +
    (date.getMonth() + 1) +
    '.' +
    date.getDate() +
    '.' +
    date.getHours() +
    '.' +
    date.getMinutes() +
    '.' +
    date.getSeconds() +
    '.' +
    date.getMilliseconds()
  );
}

export function upload(file) {
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  const imageRef = ref(storage, strDate() + '.png');
  // 'file' comes from the Blob or File API
  uploadBytes(imageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}
