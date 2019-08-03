import { AlfredError, CACHE_PATH, FILES, getSetting } from '@/project'
import remove from 'lodash.remove'
import LRU from 'lru-cache'
import writeJsonFile from 'write-json-file'

/** @hidden */
// @ts-ignore: don't know how to express this in typescript but this will
// be a number
const cacheTimeout: number = getSetting('cache_timeout')

/** @hidden */
const options = {
  max: 500,
  maxAge: 1000 * cacheTimeout
}
/** @hidden */
const cache = new LRU(options)
cache.load(FILES.cache)

/**
 * Pre-loaded disk cache
 */
export { cache }

/**
 * Remove an object at a specific key in cache by id.
 *
 * @export
 * @param {string} type
 * @param {number} id
 */
export function removeObject(type: string, id: number): void {
  // @ts-ignore incorrect return type on cache.get()
  let objects: any[] = cache.get(type) || []
  let removed = remove(objects, (obj: any) => obj.id === id)

  if (!removed) {
    throw new AlfredError(`Could not remove item with id ${id} from ${type}`)
  }
}

/**
 * Serialize cache changes back to disk
 *
 * @export
 * @param {LRU.LRUEntry<{}, {}>[]} dump
 * @returns
 */
export function serialize(dump: LRU.LRUEntry<{}, {}>[]) {
  return writeJsonFile(CACHE_PATH, dump)
}
