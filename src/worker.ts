export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404 && request.method === 'GET') {
      const url = new URL(request.url);
      if (!url.pathname.startsWith('/assets/')) {
        return env.ASSETS.fetch(new Request(url.origin + '/index.html'));
      }
    }
    return res;
  },
};
