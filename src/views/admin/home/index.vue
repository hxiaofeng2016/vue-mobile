<template>
  <div class="home">
    <div class="home-logo">
      <img src="@/assets/images/login_logo.png" />
    </div>
    <h1>后台首页</h1>
    <div class="home-content">
      <router-link :to="{ name: 'home'}">
        返回官网首页
      </router-link>
    </div>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>

<script type="text/ecmascript-6">
export default {
  data() {
    return {}
  },
  methods: {
    // 初始化
    init: function() {
      console.log(this.$route)
    }
  },
  created() {
    this.init()
  }
}
</script>
