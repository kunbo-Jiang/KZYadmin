import service from '@/utils/request'

export function getNoticesApi({ page_size, page_num }) {
  return service({
    url: '/v1/notices',
    method: 'get',
    params: {
      page_size,
      page_num
    }
  })
}

export function putNoticeApi(params) {
  return service({
    url: '/v1/notice',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addNoticeApi(params) {
  return service({
    url: '/v1/notice',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delNoticeApi(params) {
  return service({
    url: '/v1/notice',
    method: 'delete',
    data: params
  })
}
