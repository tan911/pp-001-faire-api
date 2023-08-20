/**
 *
 * @param data
 * @param key
 * @returns
 */

export enum Is {
  NotExist = 'userNotExist',
}

export function getValueByKey<T>(data: T[], key: keyof T): T[keyof T] | string {
  return data.length === 0 ? Is.NotExist : data[0][key];
}
