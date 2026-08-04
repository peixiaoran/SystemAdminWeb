<template>
  <main class="doodle-page doodle-page--404">
    <div class="doodle-scene">
      <!-- 左侧文案：整块左对齐，不做居中 -->
      <div class="doodle-copy">
        <p class="doodle-eyebrow">
          <svg viewBox="0 0 30 6" aria-hidden="true">
            <path d="M2 3.6 C10 2.2 19 4.4 28 2.4" />
          </svg>
          {{ $t('error.eyebrow404') }}
        </p>

        <h1 class="doodle-code">404</h1>

        <!-- 手绘横线：抖动的单笔，替代规整分隔线 -->
        <svg class="doodle-underline" viewBox="0 0 196 9" aria-hidden="true">
          <path d="M4 5.4 C36 2.8 76 6.4 112 3.8 C136 2.2 164 4 192 2.6" />
        </svg>

        <h2 class="doodle-title">{{ $t('error.title404') }}</h2>
        <p class="doodle-desc">{{ $t('error.desc404') }}</p>

        <div class="doodle-actions">
          <button type="button" class="doodle-btn doodle-btn--solid" @click="goHome">
            {{ $t('error.backToModuleSelect') }}
          </button>
          <button type="button" class="doodle-btn" @click="goBack">
            {{ $t('error.backToPrev') }}
          </button>
        </div>
      </div>

      <!-- 右侧插图区：底衬 + 主图 + 配件 + 散落笔画 -->
      <div class="doodle-figure">
        <!-- 浅色底衬：手绘的一团，把整组收在一起 -->
        <svg class="doodle-blob" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24.6 3.8 C33.8 3.2 43 9.8 44.6 19 C46.2 28.2 41.2 38.2 32.8 42.8
               C24.4 47.4 13.4 45.2 7.4 38.4 C1.4 31.6 1.8 20.6 6.2 13.2
               C10.4 6.2 17 4.2 24.6 3.8 Z"
          />
        </svg>

        <!-- 手绘折角纸：全部为不完美贝塞尔笔画，色块与描边故意错位 -->
        <svg
          class="doodle-art"
          viewBox="0 0 48 48"
          role="img"
          :aria-label="$t('error.eyebrow404')"
        >
          <!-- 色块：纸张（向左下错开约 1.6px） -->
          <path
            class="art-tint"
            transform="translate(-1.6 1.6)"
            d="M13.2 9.4 C13.1 7.9 13.9 7 15.4 6.9 C20.6 6.5 25.4 6.6 29.6 6.9
               L40.3 17.4 C40.9 18 41.1 18.8 41 19.8 C40.7 26.6 40.9 34.2 40.3 39.6
               C40.1 41 39.2 41.8 37.8 41.9 C30.4 42.4 21 42.3 14.6 41.7
               C13.3 41.6 12.6 40.7 12.6 39.4 C12.4 31.6 13.4 17.2 13.2 9.4 Z"
          />
          <!-- 折角三角区用纸色垫住，和底衬拉开层次 -->
          <path
            class="art-paper"
            transform="translate(1.2 -1.1)"
            d="M29.8 7.6 C30.1 10.6 29.8 13.8 30.1 16.6 C30.2 17.6 30.9 18.2 32 18.3
               C34.6 18.5 37.6 18.4 40.2 18.5 Z"
          />

          <!-- 纸张轮廓 -->
          <path
            class="art-line"
            d="M13.2 9.4 C13.1 7.9 13.9 7 15.4 6.9 C20.6 6.5 25.4 6.6 29.6 6.9
               L40.3 17.4 C40.9 18 41.1 18.8 41 19.8 C40.7 26.6 40.9 34.2 40.3 39.6
               C40.1 41 39.2 41.8 37.8 41.9 C30.4 42.4 21 42.3 14.6 41.7
               C13.3 41.6 12.6 40.7 12.6 39.4 C12.4 31.6 13.4 17.2 13.2 9.4 Z"
          />
          <!-- 折角 -->
          <path
            class="art-line"
            d="M29.6 6.9 C29.9 10.2 29.5 13.6 29.8 16.4 C29.9 17.6 30.7 18.3 32 18.4
               C34.8 18.6 38 18.5 40.9 18.7"
          />
          <!-- 问号：笔画收尾略歪 -->
          <path
            class="art-line"
            d="M20.9 24.3 C20.4 21.2 22.4 18.8 25.3 18.9 C28.1 19 30 20.9 29.7 23.3
               C29.4 25.7 26.7 26.5 25.9 28 C25.5 28.8 25.5 29.7 25.6 30.7"
          />
          <!-- 问号的点：极短笔画 + 圆头，即为手绘的点 -->
          <path class="art-line" d="M25.6 33.9 C25.7 34.2 25.7 34.4 25.7 34.6" />
          <!-- 桌面阴影线 -->
          <path class="art-line art-line--thin" d="M10.4 45.2 C17.4 46 29.2 45.9 36.2 45" />
        </svg>

        <!-- 配件：一只斜放的放大镜 -->
        <svg class="doodle-sticker doodle-sticker--lens" viewBox="0 0 48 48" aria-hidden="true">
          <path
            class="art-paper"
            transform="translate(1.4 -1.3)"
            d="M20.4 9.6 C26.8 9.2 32.2 14.2 32.2 20.6 C32.2 26.6 27.4 31.4 21.4 31.6
               C15 31.8 10 26.8 10.2 20.6 C10.4 14.6 15 9.9 20.4 9.6 Z"
          />
          <path
            class="art-line"
            d="M20.4 9.6 C26.8 9.2 32.2 14.2 32.2 20.6 C32.2 26.6 27.4 31.4 21.4 31.6
               C15 31.8 10 26.8 10.2 20.6 C10.4 14.6 15 9.9 20.4 9.6 Z"
          />
          <path class="art-line" d="M15.2 17.6 C16.1 15.4 17.6 13.9 19.6 13.2" />
          <path class="art-line" d="M28.9 28.6 C32.4 32.5 35.7 36.2 39 39.7" />
        </svg>

        <!-- 散落笔画：星、找寻的波浪线、点阵 -->
        <svg class="doodle-mark doodle-mark--star" viewBox="0 0 48 48" aria-hidden="true">
          <path
            class="art-line"
            d="M24 9.4 C25.1 16 27.8 19.4 34.2 20.6 C27.6 22 25 25.6 24 32.2
               C23 25.4 20.3 22 13.8 20.7 C20.4 19.4 22.9 15.8 24 9.4 Z"
          />
        </svg>

        <svg class="doodle-mark doodle-mark--wave" viewBox="0 0 48 48" aria-hidden="true">
          <path
            class="art-line"
            d="M8.4 21.6 C12.4 15.8 16.8 27.4 21.2 21.4 C25.4 15.6 30 27 34.4 21.2"
          />
        </svg>

        <svg class="doodle-mark doodle-mark--dots" viewBox="0 0 48 48" aria-hidden="true">
          <path
            class="art-line"
            d="M11.4 14.6 L11.6 14.8 M23.4 12.8 L23.6 13 M35 15.6 L35.2 15.8
               M12.4 28.8 L12.6 29 M24.2 30.6 L24.4 30.8 M35.4 28 L35.6 28.2"
          />
        </svg>
      </div>

      <!-- 远处的一笔，压住右侧留白 -->
      <svg class="doodle-drift" viewBox="0 0 48 48" aria-hidden="true">
        <path
          class="art-line"
          d="M24 11.4 C25.2 18.6 28 22.2 34.8 23.6 C27.8 25.2 25.1 28.8 24 35.6
             C22.9 28.6 20.2 25 13.4 23.7 C20.2 22.2 22.8 18.4 24 11.4 Z"
        />
      </svg>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.replace('/module-select')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  goHome()
}
</script>

<style scoped>
@import '@/assets/styles/doodleErrorPage.css';

/* 404 的浅色点缀：浅雾蓝 */
.doodle-page--404 {
  --doodle-accent: #DEE7ED;
}

/* 配件与散落笔画各自落在主图四周，位置刻意不对称 */
.doodle-sticker--lens {
  left: 1%;
  bottom: 8%;
  transform: rotate(12deg);
}

.doodle-mark--star {
  right: 7%;
  top: 8%;
}

.doodle-mark--wave {
  right: 3%;
  bottom: 22%;
}

.doodle-mark--dots {
  left: 10%;
  top: 6%;
}
</style>
