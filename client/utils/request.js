export function post(url, data){
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
