export default function({
  $axios,
  redirect,
  store,
  app: { context },
  ...data
}) {
  $axios.onRequest(config => {
    // console.log({ context });
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect('/400');
      return;
    }

    if (code === 401) {
      if (process.env.NODE_ENV === 'production')
        redirect('https://app.lhu.edu.vn/?ur=booking.lhu.edu.vn/');
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
