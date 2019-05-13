
import wepy from 'wepy'


class BunchDownload {

  constructor(sourceList = [], attrName = 'voice', options = {
    preCount: 5,
    threshold: 2
  }) {
    this.sourceList = sourceList
    this.attrName = attrName
    this.options = options
    this.currentIndex = 0
    this.finished = false
  }

  download() {
    return new Promise(async (resolve, reject) => {
      try {
        const nextIndex = this.currentIndex + this.options.preCount
        const butchList = this.sourceList.slice(this.currentIndex, nextIndex)
        // 更新当前下标
        this.currentIndex = nextIndex
        if (!this.finished) {
          this.finished = this.currentIndex >= this.sourceList.length
        }
        
        const downloadFn = butchList.map(
          item =>
            () =>
              wepy.downloadFile({
                url: item[this.attrName]
              })
        )
        const cachedVoices = await Promise.all(downloadFn.map(fn => fn()))
  
        const rst = butchList.map((item, index) => ({
          ...item,
          cached: cachedVoices[index]['tempFilePath']
        }))
        console.log(rst)
        resolve(rst)
      } catch (e) {
        console.log('bunchDownload error:')
        console.log(e)
      }
    })
  }

  /**
   * 
   * @param index 当前执行到的下标
   */
  start(index) {
    const { preCount, threshold } = this.options

    if (this.currentIndex === 0) {
      return this.download()
    }
    // console.log(this.finished);
    // console.log(index);
    // console.log(this.currentIndex);
    if (
      !this.finished
      && (index + threshold >= this.currentIndex)
    ) {
      console.log('当前下标:' + index);
      console.log('开始预下载');
      return this.download()
    }
    return Promise.resolve()
  }
  end() {
    console.log('停止下载')
    this.finished = true
  }
}

export {
  BunchDownload
}