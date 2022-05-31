import cookie from 'js-cookie'
import { IS_GET_MENU_KEY, MENU_KEY, MENU_STORAGE, PERMISSION_KEY, TOKEN_KEY, TOKEN_STORAGE } from '@/utils/constant'
import { StorageType } from '@/utils/dictionary'

/**
 * @description: token-存储、获取、清除
 * @param {*}
 * @return {*}
 */
export function getToken() {
  let token
  switch (TOKEN_STORAGE) {
    case StorageType.COOKIE:
      token = cookie.get(TOKEN_KEY)
      break
    case StorageType.SESSION:
      token = sessionStorage.getItem(TOKEN_KEY)
      break
    case StorageType.LOCAL:
      token = localStorage.getItem(TOKEN_KEY)
      break
    default:
      token = cookie.get(TOKEN_KEY)
      break
  }
  return token
}
export function setToken(token) {
  switch (TOKEN_STORAGE) {
    case StorageType.COOKIE:
      cookie.set(TOKEN_KEY, token)
      break
    case StorageType.SESSION:
      sessionStorage.setItem(TOKEN_KEY, token)
      break
    case StorageType.LOCAL:
      localStorage.setItem(TOKEN_KEY, token)
      break
    default:
      cookie.set(TOKEN_KEY, token)
      break
  }
}
export function clearToken() {
  switch (TOKEN_STORAGE) {
    case StorageType.COOKIE:
      cookie.remove(TOKEN_KEY)
      break
    case StorageType.SESSION:
      sessionStorage.removeItem(TOKEN_KEY)
      break
    case StorageType.LOCAL:
      localStorage.removeItem(TOKEN_KEY)
      break
    default:
      cookie.remove(TOKEN_KEY)
      break
  }
}

/**
 * @description: 菜单、权限-存储、获取、清除
 * @param {*}
 * @return {*}
 */
export function getMenuAndPermissions() {
  let result
  switch (MENU_STORAGE) {
    case StorageType.COOKIE:
      result = {
        menus: JSON.parse(cookie.get(MENU_KEY) || '[]') || [],
        permissions: JSON.parse(cookie.get(PERMISSION_KEY) || '[]') || []
      }
      break
    case StorageType.SESSION:
      result = {
        menus: JSON.parse(sessionStorage.getItem(MENU_KEY) || '[]') || [],
        permissions: JSON.parse(sessionStorage.getItem(PERMISSION_KEY) || '[]') || []
      }
      break
    case StorageType.LOCAL:
      result = {
        menus: JSON.parse(localStorage.getItem(MENU_KEY) || '') || [],
        permissions: JSON.parse(localStorage.getItem(PERMISSION_KEY) || '') || []
      }
      break
    default:
      result = {
        menus: JSON.parse(sessionStorage.getItem(MENU_KEY) || '[]') || [],
        permissions: JSON.parse(sessionStorage.getItem(PERMISSION_KEY) || '[]') || []
      }
      break
  }
  return result
}
export function setMenuAndPermissions(data) {
  switch (MENU_STORAGE) {
    case StorageType.COOKIE:
      cookie.set(MENU_KEY, JSON.stringify(data.menus))
      cookie.set(PERMISSION_KEY, JSON.stringify(data.permissions))
      break
    case StorageType.SESSION:
      sessionStorage.setItem(MENU_KEY, JSON.stringify(data.menus))
      sessionStorage.setItem(PERMISSION_KEY, JSON.stringify(data.permissions))
      break
    case StorageType.LOCAL:
      localStorage.setItem(MENU_KEY, JSON.stringify(data.menus))
      localStorage.setItem(PERMISSION_KEY, JSON.stringify(data.permissions))
      break
    default:
      sessionStorage.setItem(MENU_KEY, JSON.stringify(data.menus))
      sessionStorage.setItem(PERMISSION_KEY, JSON.stringify(data.permissions))
      break
  }
}
export function clearMenuAndPermissions() {
  switch (MENU_STORAGE) {
    case StorageType.COOKIE:
      cookie.remove(MENU_KEY)
      cookie.remove(PERMISSION_KEY)
      break
    case StorageType.SESSION:
      sessionStorage.removeItem(MENU_KEY)
      sessionStorage.removeItem(PERMISSION_KEY)
      break
    case StorageType.LOCAL:
      localStorage.removeItem(MENU_KEY)
      localStorage.removeItem(PERMISSION_KEY)
      break
    default:
      sessionStorage.removeItem(MENU_KEY)
      sessionStorage.removeItem(PERMISSION_KEY)
      break
  }
}
export function getIsGet() {
  let result
  switch (MENU_STORAGE) {
    case StorageType.COOKIE:
      result = cookie.get(IS_GET_MENU_KEY) === 'true'
      break
    case StorageType.SESSION:
      result = sessionStorage.getItem(IS_GET_MENU_KEY) === 'true'
      break
    case StorageType.LOCAL:
      result = localStorage.getItem(IS_GET_MENU_KEY) === 'true'
      break
    default:
      result = sessionStorage.getItem(IS_GET_MENU_KEY) === 'true'
      break
  }
  return result
}
export function setIsGet(val = true) {
  switch (MENU_STORAGE) {
    case StorageType.COOKIE:
      cookie.set(IS_GET_MENU_KEY, JSON.stringify(val))
      break
    case StorageType.SESSION:
      sessionStorage.setItem(IS_GET_MENU_KEY, JSON.stringify(val))
      break
    case StorageType.LOCAL:
      localStorage.setItem(IS_GET_MENU_KEY, JSON.stringify(val))
      break
    default:
      sessionStorage.setItem(IS_GET_MENU_KEY, JSON.stringify(val))
      break
  }
}
export function clearIsGet() {
  switch (MENU_STORAGE) {
    case StorageType.COOKIE:
      cookie.remove(IS_GET_MENU_KEY)
      break
    case StorageType.SESSION:
      sessionStorage.removeItem(IS_GET_MENU_KEY)
      break
    case StorageType.LOCAL:
      localStorage.removeItem(IS_GET_MENU_KEY)
      break
    default:
      cookie.remove(IS_GET_MENU_KEY)
      break
  }
}

/**
 * @description: 清除缓存 退出登录
 * @param {*}
 * @return {*}
 */
export function clear() {
  clearMenuAndPermissions()
  clearIsGet()
}
export function exit() {
  clear()
  clearToken()
}

class StorageUtil {
  get(key) {
    const result = localStorage.getItem(key)
    try {
      return JSON.parse(result)
    } catch (e) {
      return result
    }
  }
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log(e)
    }
  }
}
export const storageUtil = new StorageUtil()
