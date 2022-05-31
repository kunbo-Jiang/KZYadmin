import service from '@/utils/request'

export function getUserInfo() {
  return service({
    url: '/v1/opuser/islogin',
    method: 'get'
  })
}

export function getUsersApi({ page_size, page_num }) {
  return service({
    url: '/v1/users',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function putUserApi(params) {
  return service({
    url: '/v1/user',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addUserApi(params) {
  return service({
    url: '/v1/user',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delUserApi(params) {
  return service({
    url: '/v1/user',
    method: 'delete',
    data: params
  })
}
