<template>
  <transition name="van-slide-right">
    <div class="detail">
      <iframe
        class="detail__video"
        allowtransparency="true"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
        autoplay="true"
      />
      <div class="detail__content">
        <div class="detail__title">
          <div class="title">{{ detailData.introduction.title }}</div>
          <div class="info" v-html="detailData.introduction.detail_info" />
        </div>
        <div class="detail__play">
          <div class="update">
            <div
              v-show="detailData.introduction.update_notify_desc"
              class="update__title"
            >
              剧集与更新
            </div>
            <div class="update__desc">
              {{ detailData.introduction.update_notify_desc }}
            </div>
          </div>
          <play-list v-model:active="active" :list="playlist" show-active />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { getPlaylist, getDetail } from '@/api/detail'
import { PlayItem } from '@/types/search'
import { DetailRes } from '@/types/detail'

const route = useRoute()
const router = useRouter()
const url = ref('')
const active = ref('10')
const playlist = ref<PlayItem[]>([])
const detailData = ref<DetailRes>({
  introduction: {
    area_name: '',
    cover_description: '',
    detail_info: '',
    episode_all: '',
    hotval: '',
    main_genres: '',
    title: '',
    update_notify_desc: '',
    year: '',
  },
  topList: [],
})

watchEffect(() => {
  // url.value = `https://m2090.com/?url=${route.query.url}`
  // url.value = `https://okjx.cc/?url=${route.query.url}`
  url.value = `https://jx.bozrc.com:4433/player/?url=${route.query.url}`
})

onMounted(async () => {
  if (!url.value) {
    toHome()
  }
  detailData.value = await getDetail(route.query.url as string)
  playlist.value = await getPlaylist()
})

function toHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  &__video {
    width: 100vw;
    height: 56.25vw;
    background: #000;
  }
  &__content {
    flex: 1;
    padding: 0 12px;
    overflow: hidden;
  }
  &__title {
    margin-top: 16px;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .info {
      color: #848492;
      margin: 8px 0;
    }
  }
  &__play {
    margin-top: 50px;
    .update {
      &__title {
        font-size: 16px;
        font-weight: bold;
      }
      &__desc {
        color: #848492;
        margin: 6px 0 12px;
      }
    }
  }
}
</style>
