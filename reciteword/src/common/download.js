
import wepy from 'wepy'

let state = 'none'
const bunchDownload = async (needDownloadList, bunchNum, fn, attr = 'voice', count = 1, isFirst = true) => {
  if (!isFirst && state === 'stoped') return
  if (state !== 'starting') {
    state = 'starting'
  }
  let {restList, topList} = getTopBunch(needDownloadList, bunchNum)
  let results = await downloadResource(topList, attr)
  let flag = restList.length === 0
  typeof fn === 'function' && fn({results, hasFinish: flag, currBunch: count})
  if (flag) {
    stopDownload()
    return
  }
  bunchDownload(restList, bunchNum, fn, attr, ++count, false)
}

const stopDownload = () => {
  console.log('---下载完毕---')
  state = 'stoped'
}
// 下载音频
const downloadResource = async (urls, attr) => {
  // console.log('urls')
  // console.log(urls)
  try {
    let res = await Promise.all(urls.map(item => wepy.downloadFile({url: item[attr]})))
    return res.map((item, index) => {
      return Object.assign(urls[index], {[attr]: item.tempFilePath})
    })
  } catch (error) {
    console.log('downloadResource error')
    console.log(error)
  }
}

// 获取剩余的列表及取出的列表
const getTopBunch = (list, limit) => {
	if (list.length < limit) return {restList: [], topList: list}
	let restList = JSON.parse(JSON.stringify(list)), topList = []
	while (limit > 0) {
		topList.push(restList.shift())
    --limit
	}
	return {restList, topList}
}
export {
  bunchDownload,
  stopDownload
}