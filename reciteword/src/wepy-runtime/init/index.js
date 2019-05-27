
function $initAPI (wepy, noPromiseAPI) {
  let native = {};
  const self = this;
  let noPromiseMethods = {
      // 媒体
      stopRecord: true,
      getRecorderManager: true,
      pauseVoice: true,
      stopVoice: true,
      pauseBackgroundAudio: true,
      stopBackgroundAudio: true,
      getBackgroundAudioManager: true,
      createAudioContext: true,
      createInnerAudioContext: true,
      createVideoContext: true,
      createCameraContext: true,

      // 位置
      createMapContext: true,

      // 设备
      canIUse: true,
      startAccelerometer: true,
      stopAccelerometer: true,
      startCompass: true,
      stopCompass: true,
      onBLECharacteristicValueChange: true,
      onBLEConnectionStateChange: true,

      // 界面
      hideToast: true,
      hideLoading: true,
      showNavigationBarLoading: true,
      hideNavigationBarLoading: true,
      navigateBack: true,
      createAnimation: true,
      pageScrollTo: true,
      createSelectorQuery: true,
      createCanvasContext: true,
      createContext: true,
      drawCanvas: true,
      hideKeyboard: true,
      stopPullDownRefresh: true,

      // 自定义分析
      reportAnalytics: true,

      // 拓展接口
      arrayBufferToBase64: true,
      base64ToArrayBuffer: true,
  };
  if (noPromiseAPI) {
      if (Array.isArray(noPromiseAPI)) {
          noPromiseAPI.forEach(v => noPromiseMethods[v] = true);
      } else {
          for (let k in noPromiseAPI) {
              noPromiseMethods[k] = noPromiseAPI[k];
          }
      }
  }
  Object.keys(wx).forEach((key) => {
      if (!noPromiseMethods[key] && key.substr(0, 2) !== 'on' && !(/\w+Sync$/.test(key))) {
          Object.defineProperty(native, key, {
              get () {
                  return (obj) => {
                      obj = obj || {};
                      if (key === 'request') {
                          obj = (typeof(obj) === 'string') ? {url: obj} : obj;
                      }
                      if (typeof obj === 'string') {
                          return wx[key](obj);
                      }
                          let task;
                          const p = new Promise((resolve, reject) => {
                              let bak = {};
                              ['fail', 'success', 'complete'].forEach((k) => {
                                  bak[k] = obj[k];
                                  obj[k] = (res) => {
                                      if (k === 'success')
                                          resolve(res);
                                      else if (k === 'fail')
                                          reject(res);
                                  };
                              });
                              
                              task = wx[key](obj);
                          });
                          if (key === 'uploadFile' || key === 'downloadFile') {
                              p.progress = (cb) => {
                                  task.onProgressUpdate(cb);
                                  return p;
                              };
                              p.abort = (cb) => {
                                  cb && cb();
                                  task.abort();
                                  return p;
                              }
                          }
                          return p;
                      
                  };
              }
          });
          wepy[key] = native[key];
      } else {
          Object.defineProperty(native, key, {
              get () { return (...args) => wx[key].apply(wx, args) }
          });
          wepy[key] = native[key];
      }
  });

}

export {
  $initAPI
}