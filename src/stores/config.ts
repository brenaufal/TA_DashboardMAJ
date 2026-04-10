/* eslint-disable no-prototype-builtins */
import { defineStore } from "pinia";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";


const origin = window.location.origin.replace("http://", "");
let apiUrl = "192.168.10.80";
let socketUrl = "192.168.10.80";
const findTerm = (term: string) => {
  if (origin.includes(term)) {
    return origin;
  }
};
switch (window.location.origin.replace("http://", "")) {
  //Development
  case findTerm("localhost"):
    apiUrl = "192.168.10.80";
    socketUrl = "192.168.10.80";
    break;
  default:
    apiUrl = "192.168.10.80";
    socketUrl = "192.168.10.80";
    break;
}
const socketIoUrlParts = socketUrl.split(":");
const socketIoUrl = `http://${socketIoUrlParts[0]}:4000`;
const tokenID = "token-inventory-dashboard";
export const useConfigStore = defineStore("config", {
  state: () => ({
    apiUrl,
    socketIoUrl,
    tokenID,
    sideBar: {
      drawer: true,
      topbar: true,
      width: 300
    },
    currentLayout: "layout-blank",
    page: {
      name: "",
      navigations: [],
      drawer: false,
    },
    router: null as Router | null,
    route: null as RouteLocationNormalizedLoaded | null
  }),
  actions: {
    onError(error: any) {
      console.error(error);

      if (error?.response?.data?.status === "Expired token") {
        this.router?.push({ name: "login" });
      }
    }
  }
});
