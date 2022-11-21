<template>
  <div class="container">
    <h1>Mssage Wall</h1>
    <Search @submitSearch="submitSearch" @resetList="resetList"></Search>
    <CreateMessage v-if="isEdit" @closeEdit="closeEdit" @submitMessage="submitMessage"></CreateMessage>
    <Message
      v-for="item in posts"
      :key="item.post_id"
      :content="item.content"
      :time="item.publish_time"
      :id="item.post_id"
      @confirmEdit="confirmEdit"
      @confirmDelete="confirmDelete"
    ></Message>
    <div v-if="isFinished">已经没有更多数据了</div>
    <Publish @toCreateMessage="toCreateMessage"></Publish>
  </div>
</template>

<script setup lang="ts">
import Message from "../components/Message.vue";
import { MessageInterface } from "../interface/MessageInterface";
import { getMessageList, getSearchMessage } from "../api";
import Search from "../components/Search.vue";
import {reactive, onBeforeMount, onMounted, onBeforeUpdate, ref} from "vue";
import { AxiosResponse } from "axios";
import Publish from "../components/Publish.vue";
import CreateMessage from "../components/createMessage.vue";

const posts = reactive<MessageInterface>([]);
const isEdit = ref<boolean>(false)
const isFinished = ref<boolean>(false)
let page = 1
const limit = 5

const getPosts = async (page:number,limit:number) => {
  let tmp: MessageInterface = [];
  await getMessageList({page,limit})
    .then((res: AxiosResponse) => {
      tmp = res.data.results;
      for (let i = 0; i < tmp.length; i++) {
        posts.push(tmp[i]);
      }
      page++
      if (!isScroll()) {
            // 如果没出现滚动条
            // 则继续拿数据
            getPosts(page,limit)
        }
      page = 1
      isFinished.value = true
    })
    .catch((error: Error) => {
      console.log(`getList Error: ${error}`);
    });
};

const isScroll = ()=>{
  return (
            document.documentElement.clientHeight !=
            document.documentElement.scrollHeight
        )
}

onBeforeMount(() => {
  getPosts(page,limit);
});

const confirmEdit = async (refresh: boolean) => {
  if (refresh === true) {
    await getPosts(page,limit);
  }
};

const confirmDelete = async (refresh: boolean) => {
  if (refresh === true) {
    await getPosts(page,limit);
  }
};

const resetList = (keywords:string)=>{
  submitSearch(keywords)
}

const submitSearch = async (keywords: string) => {
  if (keywords === "") {
    await getPosts(page,limit);
  } else {
    let tmp: MessageInterface = [];
    await getSearchMessage(keywords)
      .then((res: AxiosResponse) => {
        tmp = res.data.results;
        posts.splice(0, posts.length + 1);
        for (let i = 0; i < tmp.length; i++) {
          posts[i] = tmp[i];
        }
        console.log(posts);
      })
      .catch((error: Error) => {
        console.log(`Search Error: ${error}`);
      });
  }
};
const toCreateMessage = ()=>{
  isEdit.value = true
}
const closeEdit = ()=>{
  isEdit.value = false
}
const submitMessage = ()=>{
  isEdit.value = false
  getPosts(page,limit)
}
</script>

<style scoped>
.container {
  margin-top: 30px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
