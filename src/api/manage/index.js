import service from '@/utils/request'

export function getOpusersApi({ page_size, page_num, keyword = '' }) {
  return service({
    url: '/v1/opusers',
    method: 'get',
    params: {
      page_size,
      page_num,
      keyword
    }
  })
}

export function putOpuserApi(params) {
  return service({
    url: '/v1/opuser',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addOpuserApi(params) {
  return service({
    url: '/v1/opuser',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delOpuserApi(params) {
  return service({
    url: '/v1/opuser',
    method: 'delete',
    data: params
  })
}
