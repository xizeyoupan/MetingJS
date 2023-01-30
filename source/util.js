import fetchJsonp from 'fetch-jsonp'

const qq_get_url_from_json = async (res) => {
  const [handle, jsonpCallback, jsonpCallbackFunction, url] = res[0].url.split('@').slice(1)

  let result = await fetchJsonp(url)

  result = await result.json()
  const domain =
        result.req_0.data.sip.find(i => !i.startsWith('http://ws')) ||
        result.req_0.data.sip[0]
  let _map = {}
  res.map(item => _map[item.songmid] = item)

  result.req_0.data.midurlinfo.map(info => {
    let purl = info.purl
    _map[info.songmid].url = domain + purl
  })

  res = res.map(item => _map[item.songmid])

  // console.log(res)
  return res
}

export default { qq_get_url_from_json }