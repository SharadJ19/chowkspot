import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
  }
  if (value !== null && typeof value === 'object') {
    for (const key in value) {
      value[key] = sanitizeValue(value[key]);
    }
  }
  return value;
};

export const xssSanitizer = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) req.body = sanitizeValue(req.body);
  next();
};
