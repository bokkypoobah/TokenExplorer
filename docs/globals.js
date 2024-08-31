const ADDRESS0 = "0x0000000000000000000000000000000000000000";
const generateRange = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const delay = ms => new Promise(res => setTimeout(res, ms));
const now = () => moment().format("HH:mm:ss");
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const imageUrlToBase64 = async url => {
  const response = await fetch(url);
  if (response.ok) {
    const blob = await response.blob();
    return new Promise((onSuccess, onError) => {
      try {
        const reader = new FileReader() ;
        reader.onload = function(){ onSuccess(this.result) } ;
        reader.readAsDataURL(blob) ;
      } catch(e) {
        onError(e);
      }
    });
  } else {
    return null;
  }
};
