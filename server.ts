import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    const hydrogenContext = await createHydrogenRouterContext(
      request,
      env,
      executionContext,
    );
    const handleRequest = createRequestHandler({
      build: serverBuild,
      mode: process.env.NODE_ENV,
      getLoadContext: () => hydrogenContext,
    });

    const response = await handleRequest(request);
    if (hydrogenContext.session.isPending) {
      response.headers.append(
        'Set-Cookie',
        await hydrogenContext.session.commit(),
      );
    }
    return response;
  },
};
