<template>
  <div class="theme-picker_wrapper">
    <ul class="theme-picker_list">
      <li v-for="theme in themeList"
        :key="theme.color"
        :style="{backgroundColor: theme.color}"
        :title="theme.name"
        @click="changeTheme(theme.theme)">{{theme.name}}</li>
    </ul>
  </div>
</template>

<script>
import './index.less'
import { registerTheme } from './registerTheme'
export default {
  name: 'ThemePicker',
  data() {
    return {
      themeList: [
        {
          name: '默认',
          color: 'rgba(0, 0, 0, .3)',
          theme: 'default'
        },
        {
          name: '切换黑色',
          color: '#000000',
          theme: 'dark'
        },
        {
          name: '切换橙色',
          color: '#ff8000',
          theme: 'orange'
        }
      ],
      currentTheme: 'default'
    }
  },
  methods: {
    changeTheme(theme) {
      if (theme === this.currentTheme) return
      this.currentTheme = theme
      let styles = document.getElementsByTagName('style')
      for (let i = 0; i < styles.length; i++) {
        if (styles[i].id) {
          styles[i].parentNode.removeChild(styles[i])
        }
      }
      registerTheme(theme)
    }
  }
}
</script>
