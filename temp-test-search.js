const url = 'http://localhost:3000/api/ifixit-search?q=iphone';
fetch(url)
  .then(async res => {
    console.log('status', res.status);
    console.log(await res.text());
  })
  .catch(err => {
    console.error('error', err);
  });
