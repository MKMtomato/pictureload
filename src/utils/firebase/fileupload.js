import { getStorage, ref, uploadBytes } from 'firebase/storage';

// Create a root reference
export function upload(file) {
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  const mountainsRef = ref(storage, 'image.png');

  console.log(file);

  // 'file' comes from the Blob or File API
  uploadBytes(mountainsRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}
