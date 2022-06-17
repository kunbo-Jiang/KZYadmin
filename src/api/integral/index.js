import service from '@/utils/request'

export function getIntegralsApi({ page_size, page_num, user_id }) {
  return service({
    url: '/v1/integrals',
    method: 'get',
    params: {
      page_size,
      page_num,
      user_id
    }
  })
}

export function getIntegralExportListApi(userid) {
  return service({
    url: '/v1/oplog/integral/export',
    method: 'get',
    params: {
      user_id: userid
    }
  })
}
export function delIntegralApi(id) {
  return service({
    url: '/v1/integral',
    method: 'delete',
    data: {
      id: id
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

export function putIntegralApi(params) {
  return service({
    url: '/v1/integral',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
