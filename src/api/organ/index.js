import service from '@/utils/request'

export function getOrgansApi({ page_size, page_num }) {
  return service({
    url: '/v1/organs',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function putOrganApi(params) {
  return service({
    url: '/v1/organ',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addOrganApi(params) {
  return service({
    url: '/v1/organ',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delOrganApi(params) {
  return service({
    url: '/v1/organ',
    method: 'delete',
    data: params
  })
}
