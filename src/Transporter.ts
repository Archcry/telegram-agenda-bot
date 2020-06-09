import { RequestInit, Response } from 'node-fetch';

type Transporter = (url: string, init?: RequestInit) => Promise<Response>;

export { Response, RequestInit };

export default Transporter;
