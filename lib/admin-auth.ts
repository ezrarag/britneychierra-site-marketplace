const FALLBACK_ADMIN_PASSWORD = "temp123"

export function getAdminPassword() {
  return process.env.ADMIN_DASHBOARD_PASSWORD || FALLBACK_ADMIN_PASSWORD
}

export function isValidAdminPassword(password: string | null) {
  return Boolean(password) && password === getAdminPassword()
}
