<script setup lang="ts">
import type { Log } from '@/types'

const logEdit = defineModel<Log>({ required: true })

const release = () => {
  console.log('发布', logEdit)
}

const add = (item: string) => {
  console.log('添加', item)
}


</script>

<template>
  <div class="log-release" v-m>
    <!-- {{ editNote }} -->
    {{ logEdit }}

    <ElInput v-model="logEdit.content" :autosize="{ minRows: 3 }" type="textarea" placeholder="记录内容" />

    <div class="icons">
      <Clock class="icon" @click="add('logtime')" />
      <PriceTag class="icon" @click="add('tags')" />
      <Picture class="icon" @click="add('imgs')" />
      <VideoCamera class="icon" @click="add('videos')" />
      <Microphone class="icon" @click="add('audios')" />
      <FolderOpened class="icon" @click="add('files')" />
      <Location class="icon" @click="add('location')" />
      <User class="icon" @click="add('people')" />
      <More class="icon" @click="add('info')" />
    </div>

    <div class="edits">
      <div>
        <EditTime v-model="logEdit.logtime" />
      </div>

      <div>
        <EditTags v-model="logEdit.tags" />
      </div>


    </div>

    <div>

      <ElButton size="small" type="primary" @click="release">发布</ElButton>
    </div>
  </div>
</template>

<style scoped lang="less">
.log-release {
  padding: var(--padding);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 8px;


  .icons {
    display: flex;
    gap: 4px;

    .icon {
      height: 24px;
      cursor: pointer;
    }
  }

  .edits {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

}
</style>