export default function request(method, url, data) {
  return fetch(url, buildRequest(data, method));
}

export function post(url, data) {
  return request('post', url, data);
}

export function put(url, data) {
  return request('put', url, data);
}

export function get(url, data) {
  return request('get', url, data);
}

export function del(url, data) {
  return request('delete', url, data);
}

export function buildRequest(data, method='get') {
  const body = data ? JSON.stringify(data) : {};
  return {
    method,
    body,
    headers: {
      'Content-type': 'application/json'
    }
  };
}
