// Constant-time string comparison — pure JS so it works in both the Node and
// Edge runtimes (the Edge middleware can't use node:crypto). Comparison time
// does not depend on where the strings first differ, so it doesn't leak the
// secret one character at a time via timing.
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
