import service from '@/utils/request'

export function getInterestsApi({ page_size, page_num }) {
  return service({
    url: '/v1/interests',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function putInterestApi(params) {
  return service({
    url: '/v1/interest',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addInterestApi(params) {
  return service({
    url: '/v1/interest',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delInterestApi(params) {
  return service({
    url: '/v1/interest',
    method: 'delete',
    data: params
  })
}
