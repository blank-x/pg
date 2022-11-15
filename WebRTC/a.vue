<template>
  <div>
    <video id="localVideo" autoplay playsinline muted></video>
    <div v-for="(item,index) in imgList.length" :key="index" class="item">
      <img :src="item" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  methods: {
    takePhoto() {
      const videoEl = document.getElementById('localVideo')
      const canvas = document.createElement('canvas')
      canvas.width = videoEl.videoWidth
      canvas.height = videoEl.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
      imgList.value.push(canvas.toDataURL('image/png'))
      console.log('🚀🚀🚀 / imgList', imgList)

      // 添加滤镜
      const filterList = [
        'blur(5px)', // 模糊
        'brightness(0.5)', // 亮度
        'contrast(200%)', // 对比度
        'grayscale(100%)', // 灰度
        'hue-rotate(90deg)', // 色相旋转
        'invert(100%)', // 反色
        'opacity(90%)', // 透明度
        'saturate(200%)', // 饱和度
        'saturate(20%)', // 饱和度
        'sepia(100%)', // 褐色
        'drop-shadow(4px 4px 8px blue)', // 阴影
      ]

      for (let i = 0; i < filterList.length; i++) {
        ctx.filter = filterList[i]
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
        imgList.value.push(canvas.toDataURL('image/png'))
      }
    }
  }
}
</script>

<style scoped>

</style>
