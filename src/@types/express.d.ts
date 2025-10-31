declare namespace Express {
  export interface Request {
    requestId?: string
    clientIp?: string
  }
}