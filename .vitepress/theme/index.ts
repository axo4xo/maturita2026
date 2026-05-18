import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import DownloadMd from './DownloadMd.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-top': () => h(DownloadMd)
    })
}
