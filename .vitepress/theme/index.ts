import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import DownloadMd from './DownloadMd.vue'
import CJLBookCards from './CJLBookCards.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    const { frontmatter } = useData()
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(DownloadMd),
      'doc-footer-before': () =>
        frontmatter.value?.cjlCards ? h(CJLBookCards) : null
    })
  }
}
