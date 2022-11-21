import request from "./request";
import {EditMessage} from "../interface/MessageInterface";


export function getMessageList({ page = 1, limit = 10} = {}) {
  return request.get(`/posts`, {params:{page,limit}});
}

export function createMessage(body: EditMessage) {
  return request.post("/posts", body);
}

export function getSearchMessage(keywords:string){
  return request.get("/posts",{params:{search:keywords}})
}

export function updateMessage(id:number,body: EditMessage) {
  return request.put(`/posts/${id}`,  body );
}

export function deleteMessage(id: number) {
  return request.delete(`/posts/${id}`);
}
