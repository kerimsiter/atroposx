export interface IElectronAPI {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => void
    invoke: (channel: string, ...args: any[]) => Promise<any>
  }
}

export interface IApi {
  getNestApiUrl: () => Promise<string>
}

declare global {
  interface Window {
    electron: IElectronAPI
    api: IApi
  }
}
