export default class Router {

  constructor() {
    this.routes = [];
  }

  getRoutes() {
    return this.routes;
  }

  get(path, resolver) {
    this.push('get', path, resolver);
  }

  post(path, resolver) {
    this.push('post', path, resolver);
  }

  delete(path, resolver) {
    this.push('delete', path, resolver);
  }

  put(path, resolver) {
    this.push('put', path, resolver);
  }

  push(method, path, resolver) {
    this.routes.push({ method, path, resolver });
  }
}
