import { redirect } from "../utils/redirect";

export function init() {
  redirect({ url: "/", message: "homePage" });
}
