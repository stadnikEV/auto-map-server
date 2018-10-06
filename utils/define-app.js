module.exports = (url) => {
  console.log(url);
  if (url.search(/^\/driver\/.*/) !== -1) {
    return 'driver';
  } else {
    return 'passenger';
  }
}
