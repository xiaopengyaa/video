const cheerio = require('cheerio')
const { api, getResult } = require('../../utils')

const homeApi = {
  async getDetail(url) {
    const html = await api.get(url)
    const reg = /window\.__pinia=(.*)<\/script>/
    const match = reg.exec(html)
    if (match) {
      const data = eval('(' + match[1] + ')')
      return getResult({
        introduction: data.introduction.introData.list[0].item_params,
        topList: data.topList.data,
        videoInfo: data.global.videoInfo,
      })
    }
  },
  async getPlaylist(cid, page_num = 0) {
    const list = await getList(cid, page_num)

    return getResult(
      list.map((item) => {
        const vid = item.item_params.vid
        const text = item.item_params.title
        const isTrailer = item.item_params.is_trailer
        const mark =
          isTrailer === '0'
            ? '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
            : '//vfiles.gtimg.cn/vupload/20210322/tag_mini_trailerlite.png'
        return {
          vid,
          cid,
          href: `https://v.qq.com/x/cover/${cid}/${vid}.html`,
          text,
          mark: item.item_params.imgtag_all ? mark : '',
        }
      })
    )
  },
}

async function getList(cid, page_num) {
  const res = await api.post(
    'https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2',
    {
      page_params: {
        req_from: 'web_vsite',
        page_id: 'vsite_episode_list',
        page_type: 'detail_operation',
        id_type: '1',
        cid,
        vid: '',
        lid: '',
        page_num: '',
        page_size: '100',
        detail_page_type: '1',
        page_context: `lid=&cid=${cid}&page_num=${page_num}&page_size=100&id_type=1&req_type=6&req_from=web_vsite&req_from_second_type=&detail_page_type=1`,
      },
      has_cache: 0,
    },
    {
      headers: {
        cookie:
          'pgv_pvi=8573031424; pgv_pvid=8947964065; RK=OBA0+gHGTO; ptcz=d186f2272cbac03ebf779ae821718e80f710b0dad9495ead8d72199f277b69b2; OUTFOX_SEARCH_USER_ID_NCOO=666751736.2981735; tvfe_boss_uuid=673647b3d879c7a8; video_platform=2; pac_uid=0_bd7fed03ea0f0; iip=0; fqm_pvqid=4ecf67ae-3fd4-4fc8-9cb1-f9c31dd37cbc; video_guid=f5fa8c6fc7877de1; pgv_info=ssid=s4574773043; vversion_name=8.2.95; video_omgid=f5fa8c6fc7877de1; video_bucketid=4',
        referer: 'https://v.qq.com/',
      },
    }
  )
  const params = res.data.module_list_datas[0].module_datas[0].module_params
  let list =
    res.data.module_list_datas[0].module_datas[0].item_data_lists.item_datas
  if (params.has_next === 'true') {
    list = list.concat(await getList(cid, ++page_num))
  }
  return list
}

module.exports = homeApi
