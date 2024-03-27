import { getStorage, ref, uploadBytes } from 'firebase/storage';

// Create a root reference
function strDate() {
  const date = new Date();
  var y = ('0000' + date.getFullYear()).slice(-4);
  var mo = ('00' + (date.getMonth() + 1)).slice(-2);
  var d = ('00' + date.getDate()).slice(-2);
  var h = ('00' + date.getHours()).slice(-2);
  var mi = ('00' + date.getMinutes()).slice(-2);
  var s = ('00' + date.getSeconds()).slice(-2);
  var milli = ('000' + date.getMilliseconds()).slice(-3);

  return y + '.' + mo + '.' + d + '.' + h + '.' + mi + '.' + s + '.' + milli;
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
