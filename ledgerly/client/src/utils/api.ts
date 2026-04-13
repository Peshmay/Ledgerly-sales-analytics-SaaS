export function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data;
}
