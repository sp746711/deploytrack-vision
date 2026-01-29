/**
 * Safe extraction helpers for API responses (after axios unwrap).
 * Prevents white-screen crashes when backend returns unexpected shapes.
 */
export const asList = (res) => (Array.isArray(res?.data) ? res.data : []);

export const asObject = (res) =>
  res?.data && typeof res.data === "object" && !Array.isArray(res.data) ? res.data : null;
