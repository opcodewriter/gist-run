export class RateLimit {
  limit = 99999;
  remaining = 99999;
  reset = null;

  readHeaders(response) {
    this.limit = parseInt(response.headers.get('X-RateLimit-Limit'), 10),
    this.remaining = parseInt(response.headers.get('X-RateLimit-Remaining'), 10),
    this.reset = new Date(parseInt(response.headers.get('X-RateLimit-Reset'), 10) * 1000)
  }
}
