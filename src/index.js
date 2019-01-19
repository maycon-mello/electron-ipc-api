import Request from './Request';
import Router from './Router';

class Api {
  constructor(electron, apiId) {
    this.ipcMain = electron.ipcMain;
    this.routes = {};
    this.apiId = apiId || 'ipc-api';
    this.listen();
  }

  listen() {
    this.ipcMain.on(`${this.apiId}-request`, (event, args) => {
      const path = args.resource + "/" + args.method.toLowerCase();
      const route = this.routes[path];
    
      if (!route) {
        console.error('No route found for: ', path);
        return;
      }
    
      Promise
        .resolve(route(args))
        .then((data) => {
          event.sender.send(`${this.apiId}-response`, {
            requestId: args.requestId,
            data,
          });
        })
        .catch((err) => {
          event.sender.send(`${this.apiId}-response`, {
            requestId: args.requestId,
            err,
          });
        });
    });
  }

  addRoute(method, resource, resolver) {
    this.routes[`${resource}/${method}`] = resolver;
  }

  use(resource, router) {
    router.getRoutes().forEach(route => {
      const path = route.path === '/' ? '': route.path;
      this.addRoute(route.method, `${resource}${path}`, route.resolver);
    });
  }

  get(resource, resolver) {
    this.addRoute('get', resource, resolver);
  }

  post(resource, resolver) {
    this.addRoute('post', resource, resolver);
  }

  delete(path, resolver) {
    this.addRoute('delete', resource, resolver);
  }

  put(path, resolver) {
    this.addRoute('put', resource, resolver);
  }
};


Api.Request = Request;
Api.Router = Router;

export {
  Request,
  Router,
};

export default Api;
