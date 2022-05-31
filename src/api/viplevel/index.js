import service from '@/utils/request'

export function getViplevelsApi({ page_size, page_num }) {
  return service({
    url: '/v1/viplevels',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function putViplevelApi(params) {
  return service({
    url: '/v1/viplevel',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addViplevelApi(params) {
  return service({
    url: '/v1/viplevel',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delViplevelApi(params) {
  return service({
    url: '/v1/viplevel',
    method: 'delete',
    data: params
  })
}
