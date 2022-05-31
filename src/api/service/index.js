import service from '@/utils/request'

export function getServicesApi({ page_size, page_num }) {
  return service({
    url: '/v1/customservices',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function putServiceApi(params) {
  return service({
    url: '/v1/customservice',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addServiceApi(params) {
  return service({
    url: '/v1/customservice',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delServiceApi(params) {
  return service({
    url: '/v1/customservice',
    method: 'delete',
    params: params
  })
}
