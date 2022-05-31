import service from '@/utils/request'

export function getCouponsApi({ type, page_size, page_num, keyword = '' }) {
  return service({
    url: '/v1/coupons',
    method: 'get',
    params: {
      type,
      page_size,
      page_num,
      keyword
    }
  })
}

export function putCouponApi(params) {
  return service({
    url: '/v1/coupon',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addCouponApi(params) {
  return service({
    url: '/v1/coupon',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function delCouponApi(params) {
  return service({
    url: '/v1/coupon',
    method: 'delete',
    data: params
  })
}
