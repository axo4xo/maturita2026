import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import DownloadMd from './DownloadMd.vue'
import CJLBookCards from './CJLBookCards.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    const { page } = useData()
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(DownloadMd),
      'doc-after': () =>
        page.value.relativePath === 'CJL/index.md' ? h(CJLBookCards) : null
    })
  }
}
