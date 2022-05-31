import service from '@/utils/request'

export function getBusinesApi({ page_size, page_num, userid: user_id, keyword = '' }) {
  return service({
    url: '/v1/businesses',
    method: 'get',
    params: {
      page_size,
      page_num,
      user_id,
      keyword
    }
  })
}

export function getBusinessExportListApi(userid) {
  return service({
    url: '/v1/business/export',
    method: 'get',
    params: {
      user_id: userid
    }
  })
}

export function addBusinessApi(params) {
  return service({
    url: '/v1/business',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
