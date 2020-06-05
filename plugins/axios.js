export default function({ $axios, redirect, store, ...data }) {
  $axios.onRequest(config => {
    // console.log('Making request to ' + config.url)
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect('/400');
      return;
    }

    if (code === 401) {
      redirect('/401');
      return;
    }

    if (code === 500) {
      throw new Error(error.response.data.Message);
    }
  });

  $axios.onResponse(response => {
    return response.data;
  });
}
