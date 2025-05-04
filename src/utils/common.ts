import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { Types, UpdateQuery } from 'mongoose';
import moment from 'moment-timezone';
import { DecryptionData, EncryptionData, TypesObjectId } from '@schemas';

const { ObjectId } = Types;

const isDevEnv = process.env.NODE_ENV === 'development';

const randomString = (length: number = 30): string => {
    let result: string = '';
    while (result.length < length) {
        result += crypto
            .randomBytes(length)
            .toString('hex')
            .substring(2, length + 2);
    }

    return result;
};

const escapeRegex = (text: string): string => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const isValidObjectId = (objectId: string): boolean => {
    if (ObjectId.isValid(objectId)) {
        const id: TypesObjectId = new ObjectId(objectId);
        return id.toString() === objectId;
    }
    return false;
};

const toObjectId = (id: string): TypesObjectId => new ObjectId(id);

const generateOtp = (length: number = 6): string => {
    let result = '';
    if (isDevEnv) {
        result = '123456';
    } else {
        while (result.length < length) {
            result += crypto.randomInt(0, 9).toString();
        }
    }

    return result.padEnd(length, '0');
};

const showDate = (
    date: Date | number = new Date(),
    timeZone: string = 'UTC',
    format: string = 'MMM DD YYYY hh:mm:ss A'
): string => moment(date).tz(timeZone).format(format);

const fromNow = (date: Date): string => moment(date).fromNow();

const getSearchRegex = (text: string | undefined): RegExp | null =>
    text
        ? new RegExp(
              text
                  .split(' ')
                  .filter(val => val)
                  .map(value => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
                  .join(' '),
              'i'
          )
        : null;

const getUpdateQuery = <T>(data: T): UpdateQuery<T> => {
    const unsetFields: Partial<Record<keyof T, true>> = {};
    const setFields: Partial<T> = {};

    for (const key in data) {
        if (data[key as keyof T] === undefined) {
            unsetFields[key as keyof T] = true;
        } else {
            setFields[key as keyof T] = data[key as keyof T];
        }
    }

    return {
        ...(Object.keys(setFields).length > 0 && { $set: setFields }),
        ...(Object.keys(unsetFields).length > 0 && { $unset: unsetFields }),
    };
};

const allowedDomainPatterns: RegExp[] = [/\.socialservice\.in$/];

const otherAllowedDomains: string[] =
    process.env.IS_ANY_OTHER_DOMAINS_ALLOWED === 'true' ? ['http://localhost:3000'] : [];

const getSessionCookieDomain = (origin: string): string | undefined => {
    if (origin.endsWith('.homelead.in')) {
        return '.homelead.in';
    } else if (origin.endsWith('.homelead.app')) {
        return '.homelead.app';
    } else if (origin.endsWith('.homelead.io')) {
        return '.homelead.io';
    }

    return undefined;
};

const encrypt = ({ key, text }: EncryptionData): string => {
    return encodeURIComponent(CryptoJS.AES.encrypt(text, key).toString());
};

const decrypt = ({ key, encryptedText }: DecryptionData): string => {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedText), key);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const toChunkedArray = <T>(array: T[], chunkSize: number) => {
    const result: T[][] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }

    return result;
};

export {
    isDevEnv,
    encrypt,
    decrypt,
    randomString,
    escapeRegex,
    isValidObjectId,
    toObjectId,
    generateOtp,
    showDate,
    fromNow,
    getSearchRegex,
    getUpdateQuery,
    allowedDomainPatterns,
    otherAllowedDomains,
    getSessionCookieDomain,
    toChunkedArray,
};
