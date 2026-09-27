import { describe, it, expect } from 'vitest';
import api from './config';

describe('api config', () => {
  it('has correct defaults', () => {
    // baseURL should match the one in config.tsx
    expect(api.defaults.baseURL).toBe('/api/v1');
    // content-type header should be application/json
    const contentType = api.defaults.headers['Content-Type'] || api.defaults.headers.common['Content-Type'];
    expect(contentType).toBe('application/json');
  });
});
