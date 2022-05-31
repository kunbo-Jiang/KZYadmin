import service from '@/utils/request'

export function getBannersApi({ page_size, page_num }) {
  return service({
    url: '/v1/banners',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function putBannersApi(params) {
  return service({
    url: '/v1/banner',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addBannersApi(params) {
  return service({
    url: '/v1/banner',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delBannersApi(params) {
  return service({
    url: '/v1/banner',
    method: 'delete',
    data: params
  })
}
