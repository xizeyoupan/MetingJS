import fetchJsonp from 'fetch-jsonp'

// const qq_get_url_from_json = async (res) => {
//   const [handle, jsonpCallback, jsonpCallbackFunction, url] = res[0].url.split('@').slice(1)

//   let result = await fetchJsonp(url)

//   result = await result.json()
//   const domain =
//     result.req_0.data.sip.find(i => !i.startsWith('http://ws')) ||
//     result.req_0.data.sip[0]
//   let _map = {}
//   res.map(item => _map[item.songmid] = item)

//   result.req_0.data.midurlinfo.map(info => {
//     let purl = info.purl
//     _map[info.songmid].url = (domain + purl).replace('http://', 'https://')
//   })

//   res = res.map(item => _map[item.songmid])

//   // console.log(res)
//   return res
// }

const qq_get_url_from_json = async (res) => {
  res = await Promise.all(
    res.map(async (song) => {
      if (!song.url || song.url.startsWith('@')) {
        try {
          song.url = await get_song_url(song.songmid)
        } catch (e) {
          console.error(e)
          song.url = ''
        }
      }
      return song
    }))

  return res
}

const get_song_url = async (id, cookie = '') => {

  id = id.split(',')
  let uin = ''
  let qqmusic_key = ''
  const typeObj = {
    s: 'M500',
    e: '.mp3',
  }

  const file = id.map(e => `${typeObj.s}${e}${e}${typeObj.e}`)
  const guid = (Math.random() * 10000000).toFixed(0)

  let purl = ''

  let data = {
    req_0: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {
        // filename: file,
        guid: guid,
        songmid: id,
        songtype: [0],
        uin: uin,
        loginflag: 1,
        platform: '20',
      },
    },
    comm: {
      uin: uin,
      format: 'json',
      ct: 19,
      cv: 0,
      authst: qqmusic_key,
    },
  }

  let params = {
    '-': 'getplaysongvkey',
    g_tk: 5381,
    loginUin: uin,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8¬ice=0',
    platform: 'yqq.json',
    needNewCode: 0,
    data: JSON.stringify(data),
  }


  const url = changeUrlQuery(params, 'https://u.y.qq.com/cgi-bin/musicu.fcg')

  let result = await fetchJsonp(url)

  result = await result.json()

  if (result.req_0 && result.req_0.data && result.req_0.data.midurlinfo) {
    purl = result.req_0.data.midurlinfo[0].purl
  }

  const domain =
    result.req_0.data.sip.find(i => !i.startsWith('http://ws')) ||
    result.req_0.data.sip[0]

  const res = `${domain}${purl}`.replace('http://', 'https://')
  // console.log(res);
  return res

}


function changeUrlQuery(obj, baseUrl) {
  const query = getQueryFromUrl(null, baseUrl)
  let url = baseUrl.split('?')[0]

  const newQuery = { ...query, ...obj }
  let queryArr = []
  Object.keys(newQuery).forEach((key) => {
    if (newQuery[key] !== undefined && newQuery[key] !== '') {
      queryArr.push(`${key}=${encodeURIComponent(newQuery[key])}`)
    }
  })
  return `${url}?${queryArr.join('&')}`.replace(/\?$/, '')
}

function getQueryFromUrl(key, search) {
  try {
    const sArr = search.split('?')
    let s = ''
    if (sArr.length > 1) {
      s = sArr[1]
    } else {
      return key ? undefined : {}
    }
    const querys = s.split('&')
    const result = {}
    querys.forEach((item) => {
      const temp = item.split('=')
      result[temp[0]] = decodeURIComponent(temp[1])
    })
    return key ? result[key] : result
  } catch (err) {
    // 除去search为空等异常
    return key ? '' : {}
  }
}

export default { qq_get_url_from_json }