export type AppRole =
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "DENTIST"
  | "RECEPTION"
  | "PATIENT";

export function roleHomePath(role: AppRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin";
    case "ORG_ADMIN":
      return "/org";
    case "DENTIST":
      return "/provider";
    case "RECEPTION":
      return "/scheduling";
    case "PATIENT":
      return "/portal";
    default:
      return "/";
  }
}

