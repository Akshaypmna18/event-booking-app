export interface PagesFunctionArgs {
  request: Request;
  env: Record<string, unknown>;
  params: Record<string, string>;
  next: () => Promise<Response>;
  data: Record<string, unknown>;
}
