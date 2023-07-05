import { BackendProvider } from "../contexts/BackendProvider";

import "../activity.js";
import capytaleLoad from "@capytale/activity.js/backend/capytale/activityContext";

function getId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');
  return id;
}


export function CapytaleBackendProvider({ children }) {
  async function load() {
    const id = getId();
    const data = await capytaleLoad(id);
    window.context = data;
    if (data.activity.content.value == null) {
      return null;
    } else {
      // TODO: check if the following line is working
      // const binaryFilesData = await data.activity.binaryFiles.getAsync();
      // data.isAssignment
      // data.mode
      // data.activity.sacontent.value
      // const title = data.activity.title.value;
      // const binaryFilesData = await data.activity.binaryFiles.getAsync("arrayBuffer"); ?
      // const binaryFilesData = await data.activity.binaryFiles.getAsync("blob"); ?
      // const binaryFilesData = await data.activity.binaryFiles.getAsync("stream"); ?
      // const binaryFilesData = await data.activity.binaryFiles.getAsync("text"); ?
      // const binaryFilesData = await data.activity.saBinaryFiles. ...
      return JSON.parse(data.activity.content.value);
    }
  }
  async function save(data) {
    // window.context.activity.content.setSource(() => null);
    // window.context.activity.content.invalidate();
    window.context.activity.content.value = JSON.stringify(data);
    window.context.activity.save();
  }

  return (
    <BackendProvider load={load} save={save}>
      {children}
    </BackendProvider>
  );
}
