/**
 * 认证相关工具函数
 */

/**
 * 从 Socket 客户端提取 JWT token
 * @param client Socket 客户端
 * @returns JWT token 或 null
 */
export function extractTokenFromSocket(client: any): string | null {
  // 方法1: 从查询参数获取 (推荐)
  if (client.handshake?.query?.token) {
    return client.handshake.query.token;
  }

  return null;
}

/**
 * 解析 cookie 字符串
 * @param cookieString cookie 字符串
 * @returns cookie 对象
 */
export function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieString.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
}

/**
 * 从 HTTP 请求中提取 JWT token
 * @param request HTTP 请求对象
 * @returns JWT token 或 null
 */
export function extractTokenFromRequest(request: any): string | null {
  // 从 Authorization header 获取
  const authHeader = request.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
}
