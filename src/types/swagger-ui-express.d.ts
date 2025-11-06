declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  export const serve: RequestHandler[];
  export function setup(swaggerDoc: any, opts?: any, options?: any): RequestHandler;

  const swaggerUi: {
    serve: RequestHandler[];
    setup: typeof setup;
  };

  export default swaggerUi;
}
