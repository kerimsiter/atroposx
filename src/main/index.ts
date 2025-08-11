import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn, ChildProcess } from 'child_process'

let mainWindow: BrowserWindow | null = null
let nestProcess: ChildProcess | null = null

// Environment setup for NestJS
const NEST_ENV = process.env.NODE_ENV || 'development'
const NEST_PORT = process.env.NEST_PORT || 3000
const NEST_HOST = '127.0.0.1' // Only allow local connections
const NEST_BASE_URL = `http://${NEST_HOST}:${NEST_PORT}`

function createWindow(): void {
  // Override CSP headers to allow API requests to localhost
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; " +
          "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: blob:; " +
          "font-src 'self' data:;"
        ]
      }
    })
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Atropos POS System',
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Keep this for additional security bypass in development
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../frontend/index.html'))
  }
}

// Start NestJS backend
function startNestBackend() {
  const nestDistPath = join(__dirname, '../../backend/dist/main.js')
  console.log('Starting NestJS backend from:', nestDistPath)

  nestProcess = spawn('node', [nestDistPath], {
    env: {
      ...process.env,
      NODE_ENV: NEST_ENV,
      PORT: NEST_PORT.toString(),
      HOST: NEST_HOST,
      DATABASE_URL: process.env.DATABASE_URL
    },
    stdio: 'inherit' // Show NestJS logs in Electron console
  })

  nestProcess.on('close', (code: number) => {
    console.log(`NestJS backend process exited with code ${code}`)
  })

  nestProcess.on('error', (err: any) => {
    console.error('Failed to start NestJS backend process:', err)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.atropos')

  // Start NestJS backend first
  startNestBackend()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handlers
  ipcMain.on('ping', () => console.log('pong'))
  
  // Expose NestJS API URL to renderer process
  ipcMain.handle('get-nest-api-url', async () => {
    return NEST_BASE_URL
  })

  // Sürüm bilgileri için IPC handler'ları ekle
  ipcMain.handle('get-chrome-version', () => process.versions.chrome);
  ipcMain.handle('get-electron-version', () => process.versions.electron);
  ipcMain.handle('get-node-version', () => process.versions.node);

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  // Kill NestJS process when app closes
  if (nestProcess && !nestProcess.killed) {
    nestProcess.kill()
    console.log('NestJS backend process killed.')
  }
})

// Handle second instance
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

// Ensure single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
