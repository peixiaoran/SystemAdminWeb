<template>
  <main class="doodle-page doodle-page--403">
    <div class="doodle-scene">
      <!-- 左侧文案：整块左对齐，不做居中 -->
      <div class="doodle-copy">
        <p class="doodle-eyebrow">
          <svg viewBox="0 0 30 6" aria-hidden="true">
            <path d="M2 4.2 C9 2.4 18 4.6 28 2.6" />
          </svg>
          {{ $t('error.eyebrow403') }}
        </p>

        <h1 class="doodle-code">403</h1>

        <!-- 手绘横线：抖动的单笔，替代规整分隔线 -->
        <svg class="doodle-underline" viewBox="0 0 196 9" aria-hidden="true">
          <path d="M4 6.2 C38 3.4 78 6.8 114 4.2 C138 2.6 166 4.2 192 3" />
        </svg>

        <h2 class="doodle-title">{{ $t('error.accessDenied') }}</h2>
        <p class="doodle-desc">{{ $t('error.desc403') }}</p>

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
            d="M25.4 3.6 C34.6 3.2 43.4 9.4 45 18.4 C46.6 27.6 42 37.8 33.6 42.6
               C25.2 47.4 13.8 45.4 7.8 38.6 C1.8 31.8 1.6 20.4 6 13
               C10.2 5.8 17.4 4 25.4 3.6 Z"
          />
        </svg>

        <!-- 手绘挂锁：全部为不完美贝塞尔笔画，色块与描边故意错位 -->
        <svg
          class="doodle-art"
          viewBox="0 0 48 48"
          role="img"
          :aria-label="$t('error.eyebrow403')"
        >
          <!-- 色块：锁体（向左下错开约 1.7px，像手工上色出界） -->
          <path
            class="art-tint"
            transform="translate(-1.7 1.5)"
            d="M11.9 24.2 C11.7 22.6 12.6 21.7 14.2 21.6 C21.2 21 28.8 21.2 34.4 21.9
               C35.9 22.1 36.7 23 36.6 24.5 C36.3 29.4 36.5 35 36 39.4
               C35.8 40.9 34.9 41.7 33.4 41.8 C27.2 42.3 20 42.2 14.2 41.6
               C12.8 41.5 12 40.6 12 39.2 C11.8 34.4 12.2 28.9 11.9 24.2 Z"
          />
          <!-- 锁梁围出的空档用纸色垫住，和底衬拉开层次 -->
          <path
            class="art-paper"
            transform="translate(1.3 -1.2)"
            d="M19.4 21.4 C19 18.2 18.8 14.6 21.4 12.6 C23.7 10.8 26.7 11.2 28.3 13.4
               C29.7 15.4 29.4 18.6 29.2 21.3 Z"
          />

          <!-- 锁体轮廓 -->
          <path
            class="art-line"
            d="M11.9 24.2 C11.7 22.6 12.6 21.7 14.2 21.6 C21.2 21 28.8 21.2 34.4 21.9
               C35.9 22.1 36.7 23 36.6 24.5 C36.3 29.4 36.5 35 36 39.4
               C35.8 40.9 34.9 41.7 33.4 41.8 C27.2 42.3 20 42.2 14.2 41.6
               C12.8 41.5 12 40.6 12 39.2 C11.8 34.4 12.2 28.9 11.9 24.2 Z"
          />
          <!-- 锁梁：两侧高度略不等，制造手绘的不对称 -->
          <path
            class="art-line"
            d="M17.4 21.4 C16.9 17.6 16.2 13.2 19.4 10.4 C22.6 7.6 27.6 8 29.9 11
               C31.9 13.6 31.6 17.8 31.3 21.2"
          />
          <!-- 锁孔 -->
          <path
            class="art-line"
            d="M24.3 27.4 C26.1 27.5 27.4 28.8 27.3 30.5 C27.2 32 26 33.2 24.3 33.3
               C22.5 33.3 21.2 32 21.2 30.4 C21.3 28.8 22.6 27.5 24.3 27.4 Z"
          />
          <path class="art-line" d="M24.2 33.3 C24.5 34.7 24.1 36.2 23.7 37.5" />
          <!-- 桌面阴影线 -->
          <path class="art-line art-line--thin" d="M9.6 45.1 C16.4 45.9 27.8 45.8 34.6 44.9" />
        </svg>

        <!-- 配件：一把斜放的钥匙 -->
        <svg class="doodle-sticker doodle-sticker--key" viewBox="0 0 48 48" aria-hidden="true">
          <path
            class="art-tint"
            transform="translate(-1.4 1.3)"
            d="M18.6 9.4 C23 9.2 26.4 12.4 26.3 16.6 C26.2 20.4 23.2 23.4 19.2 23.5
               C15 23.6 11.8 20.4 11.9 16.4 C12 12.4 14.8 9.6 18.6 9.4 Z"
          />
          <path
            class="art-line"
            d="M18.6 9.4 C23 9.2 26.4 12.4 26.3 16.6 C26.2 20.4 23.2 23.4 19.2 23.5
               C15 23.6 11.8 20.4 11.9 16.4 C12 12.4 14.8 9.6 18.6 9.4 Z"
          />
          <path
            class="art-line"
            d="M18.8 14.3 C20.2 14.2 21.3 15.2 21.3 16.5 C21.2 17.8 20.2 18.8 18.9 18.8
               C17.6 18.9 16.5 17.8 16.6 16.5 C16.6 15.2 17.6 14.4 18.8 14.3 Z"
          />
          <path class="art-line" d="M22.8 21.4 C27.6 26.4 32.6 32 37.6 37.6" />
          <path class="art-line" d="M31.4 31.2 C32.6 30.1 33.6 29.2 34.7 28.5" />
          <path class="art-line" d="M34.9 34.8 C35.9 33.9 36.9 33 37.9 32.3" />
        </svg>

        <!-- 散落笔画：星、风线、点阵 -->
        <svg class="doodle-mark doodle-mark--star" viewBox="0 0 48 48" aria-hidden="true">
          <path
            class="art-line"
            d="M24 9.4 C25.1 16 27.8 19.4 34.2 20.6 C27.6 22 25 25.6 24 32.2
               C23 25.4 20.3 22 13.8 20.7 C20.4 19.4 22.9 15.8 24 9.4 Z"
          />
        </svg>

        <svg class="doodle-mark doodle-mark--wind" viewBox="0 0 48 48" aria-hidden="true">
          <path class="art-line" d="M8.6 17.4 C15.4 12.4 25.8 12 33.6 16.2" />
          <path class="art-line" d="M11.4 27.6 C17 23.8 24.4 22.8 30.4 25" />
        </svg>

        <svg class="doodle-mark doodle-mark--dots" viewBox="0 0 48 48" aria-hidden="true">
          <path
            class="art-line"
            d="M11 15.4 L11.2 15.6 M23 13.6 L23.2 13.8 M34.6 16.4 L34.8 16.6
               M12.8 29.6 L13 29.8 M24.4 31.4 L24.6 31.6 M35.8 28.8 L36 29"
          />
        </svg>
      </div>

      <!-- 远处的一笔，压住右侧留白 -->
      <svg class="doodle-drift" viewBox="0 0 48 48" aria-hidden="true">
        <path class="art-line" d="M9.6 30.4 C15.4 21.6 26.4 17.6 36.4 20.6" />
        <path class="art-line" d="M31.2 14.6 C34.6 17 36.4 19 37.8 21.4" />
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

/* 403 的浅色点缀：暖陶土色 */
.doodle-page--403 {
  --doodle-accent: #F1DFD6;
}

/* 配件与散落笔画各自落在主图四周，位置刻意不对称 */
.doodle-sticker--key {
  right: 2%;
  bottom: 6%;
  transform: rotate(-16deg);
}

.doodle-mark--star {
  right: 6%;
  top: 6%;
}

.doodle-mark--wind {
  left: 1%;
  top: 16%;
  transform: rotate(-8deg);
}

.doodle-mark--dots {
  left: 6%;
  bottom: 10%;
}
</style>
