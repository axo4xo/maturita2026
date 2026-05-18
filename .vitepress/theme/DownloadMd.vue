<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

const { frontmatter, page } = useData()

const href = computed(() => {
  const path = (frontmatter.value?.mdDownload as string | undefined) ?? `/${page.value.relativePath}`
  return withBase(path)
})

const filename = computed(() => href.value.split('/').pop() || 'stranka.md')
</script>

<template>
  <div class="md-download">
    <a :href="href" :download="filename" rel="nofollow">
      <span class="md-download__icon" aria-hidden="true">↓</span>
      Stáhnout jako MD
    </a>
  </div>
</template>

<style scoped>
.md-download {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 16px;
}

.md-download a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, background-color 0.15s;
}

.md-download a:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
}

.md-download__icon {
  font-size: 14px;
  line-height: 1;
}
</style>
