import service from '@/utils/request'

export function getAddressesApi({ page_size, page_num, userid: user_id, keyword = '' }) {
  return service({
    url: '/v1/addresses',
    method: 'get',
    params: {
      page_size,
      page_num,
      user_id,
      keyword
    }
  })
}

export function putAddressApi(params) {
  return service({
    url: '/v1/address',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addAddressApi(params) {
  return service({
    url: '/v1/address',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delAddressApi(params) {
  return service({
    url: '/v1/address',
    method: 'delete',
    data: params
  })
}
