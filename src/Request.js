import uuid from 'uuid';

export default class IpcRequest {
  constructor(electron, apiId) {
    this.ipcRenderer = electron.ipcRenderer;
    this.apiId = apiId || 'ipc-api';
    this.listeners = [];

    this.ipcRenderer.on(`${this.apiId}-response`, (event, arg) => {
      const idx = this.listeners.findIndex(item => item.requestId === arg.requestId);

      if (idx < 0) {
        return;
      }

      const listener = this.listeners[idx];

      listener.resolve(arg.data);

      this.listeners.splice(idx, 1);
    });
  }

  addResponseListener(requestId) {
    return new Promise((resolve, reject) => {
      this.listeners.push({
        resolve,
        reject,
        requestId,
      });
    });
  }
  
  get(resource, params) {
    return this.fetch('get', resource, params);
  }

  put(resource, params) {
    return this.fetch('put', resource, params);
  }

  post(resource, params) {
    return this.fetch('post', resource, params);
  }

  delete(resource, params) {
    return this.fetch('delete', resource, params);
  }

  fetch(method, resource, params) {
    const requestId = uuid();

    this.ipcRenderer.send(`${this.apiId}-request`, {
      requestId,
      method,
      resource,
      params,
    });

    return this.addResponseListener(requestId);
  }
}
