export interface ApiClientConfig {
  apiKey: string;
  baseUrl: string;
}

export class QrMakerApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public suggestion?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'QrMakerApiError';
  }
}

export class ApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ApiClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
  }

  private async request(method: string, path: string, body?: unknown): Promise<any> {
    const url = `${this.baseUrl}/v2${path}`;
    const headers: Record<string, string> = {
      'x-api-key': this.apiKey,
      'Accept': 'application/json',
    };
    if (body) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    });

    // DELETE returns 204 No Content with no body
    if (res.status === 204) return undefined;

    const json = await res.json() as any;

    if (!res.ok) {
      const err = json.error ?? {};
      throw new QrMakerApiError(
        err.code ?? 'unknown',
        err.message ?? `HTTP ${res.status}`,
        err.suggestion,
        err.details,
      );
    }

    return json.data ?? json;
  }

  // QR
  async generateQr(params: { content: string; format?: string; style?: Record<string, any>; template_id?: string }) {
    return this.request('POST', '/qr/generate', params);
  }

  async batchGenerate(params: { items: any[]; webhook_url?: string }) {
    return this.request('POST', '/qr/generate/batch', params);
  }

  async getBatchStatus(id: string) {
    return this.request('GET', `/qr/batch/${id}`);
  }

  // Links
  async createLink(params: { target_url: string; custom_code?: string; expires_at?: string }) {
    return this.request('POST', '/links', params);
  }

  async listLinks(cursor?: string, limit?: number) {
    const qs = new URLSearchParams();
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    const query = qs.toString();
    return this.request('GET', `/links${query ? '?' + query : ''}`);
  }

  async getLink(id: string) {
    return this.request('GET', `/links/${id}`);
  }

  async updateLink(id: string, params: { target_url?: string; status?: string; expires_at?: string | null; qr_style?: Record<string, any>; folder_id?: string | null }) {
    return this.request('PATCH', `/links/${id}`, params);
  }

  async deleteLink(id: string) {
    return this.request('DELETE', `/links/${id}`);
  }

  async getLinkAnalytics(id: string) {
    return this.request('GET', `/links/${id}/analytics`);
  }

  // Templates
  async listTemplates(cursor?: string, limit?: number) {
    const qs = new URLSearchParams();
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    const query = qs.toString();
    return this.request('GET', `/templates${query ? '?' + query : ''}`);
  }

  async getTemplate(id: string) {
    return this.request('GET', `/templates/${id}`);
  }

  async createTemplate(params: { name: string; options: Record<string, any>; description?: string; tags?: string[]; is_public?: boolean }) {
    return this.request('POST', '/templates', params);
  }

  async updateTemplate(id: string, params: { name?: string; description?: string; options?: Record<string, any>; is_public?: boolean; tags?: string[] }) {
    return this.request('PATCH', `/templates/${id}`, params);
  }

  async deleteTemplate(id: string) {
    return this.request('DELETE', `/templates/${id}`);
  }

  async renderTemplate(id: string, params: { content: string; overrides?: Record<string, any>; format?: string }) {
    return this.request('POST', `/templates/${id}/render`, params);
  }

  // Landings
  async publishLandingWithQr(params: { html: string; title?: string; style?: Record<string, any>; format?: string }) {
    return this.request('POST', '/landings/publish-with-qr', params);
  }

  async getLanding(id: string) {
    return this.request('GET', `/landings/${id}`);
  }

  async updateLanding(id: string, params: { html: string; title?: string }) {
    return this.request('PUT', `/landings/${id}`, params);
  }

  // Usage & Capabilities
  async getUsage() {
    return this.request('GET', '/usage');
  }

  async getCapabilities() {
    return this.request('GET', '/capabilities');
  }
}
