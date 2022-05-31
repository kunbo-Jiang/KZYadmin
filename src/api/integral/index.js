import service from '@/utils/request'

export function getIntegralsApi({ page_size, page_num }) {
  return service({
    url: '/v1/integrals',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function getIntegralExportListApi(userid) {
  return service({
    url: '/v1/integral/export',
    method: 'get',
    params: {
      user_id: userid
    }
  })
}

export function addIntegralApi(params) {
  return service({
    url: '/v1/integral',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
