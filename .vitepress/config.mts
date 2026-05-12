import { defineConfig, type DefaultTheme } from 'vitepress'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const configDir = dirname(fileURLToPath(import.meta.url))
const rootDir = join(configDir, '..')
const hasContentCheckout =
  existsSync(join(rootDir, 'content', 'README.md')) ||
  existsSync(join(rootDir, 'content', 'PLAN.md')) ||
  existsSync(join(rootDir, 'content', 'SWI'))
const contentDir = hasContentCheckout
  ? join(rootDir, 'content')
  : rootDir
const srcDir = relative(rootDir, contentDir).replace(/\\/g, '/') || '.'

const sectionLabels = new Map<string, string>([
  ['SWI', 'SWI'],
  ['DAT', 'DAT'],
  ['ANJ', 'ANJ'],
  ['CJL', 'CJL'],
  ['obhajoba', 'Obhajoba']
])

function ensureSectionIndexes(): void {
  for (const [section, label] of sectionLabels) {
    const dir = join(contentDir, section)
    if (!existsSync(dir)) continue

    const index = join(dir, 'index.md')
    const readme = join(dir, 'README.md')
    if (existsSync(index) || existsSync(readme)) continue

    writeFileSync(index, `# ${label}\n\nRozcestnik pro sekci ${label}.\n`, 'utf8')
  }
}

const ignoredDirs = new Set([
  '.git',
  '.github',
  '.vitepress',
  '.claude',
  'node_modules',
  '_podklady'
])

function routeFor(filePath: string): string {
  const rel = relative(contentDir, filePath).replace(/\\/g, '/').replace(/\.md$/i, '')
  if (rel === 'index') return '/'
  if (rel.endsWith('/index')) return `/${rel.replace(/\/index$/, '/')}`
  return `/${rel}`
}

function cleanTitle(value: string): string {
  return value
    .replace(/\s+[0-9a-f]{32}$/i, '')
    .replace(/^README$/i, 'Přehled')
    .trim()
}

function titleFor(filePath: string): string {
  const source = readFileSync(filePath, 'utf8')
  const heading = source.match(/^#\s+(.+)$/m)?.[1]
  if (heading) return cleanTitle(heading)

  const basename = filePath.split(/[\\/]/).pop()?.replace(/\.md$/i, '') ?? 'Stránka'
  return cleanTitle(basename)
}

function sortPages(a: string, b: string): number {
  const aName = a.split(/[\\/]/).pop() ?? a
  const bName = b.split(/[\\/]/).pop() ?? b
  const aNum = Number(aName.match(/^(\d+)/)?.[1])
  const bNum = Number(bName.match(/^(\d+)/)?.[1])

  if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) return aNum - bNum
  return aName.localeCompare(bName, 'cs', { numeric: true, sensitivity: 'base' })
}

function markdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .map((entry) => join(dir, entry))
    .filter((entry) => statSync(entry).isFile() && entry.endsWith('.md'))
    .sort(sortPages)
}

function nestedMarkdownGroups(dir: string): DefaultTheme.SidebarItem[] {
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .map((entry) => join(dir, entry))
    .filter((entry) => {
      if (!statSync(entry).isDirectory()) return false
      const name = entry.split(/[\\/]/).pop() ?? ''
      return !ignoredDirs.has(name) && markdownFiles(entry).length > 0
    })
    .sort((a, b) => a.localeCompare(b, 'cs', { numeric: true, sensitivity: 'base' }))
    .map((entry) => ({
      text: cleanTitle(entry.split(/[\\/]/).pop() ?? 'Sekce'),
      collapsed: false,
      items: markdownFiles(entry).map((file) => ({
        text: titleFor(file),
        link: routeFor(file)
      }))
    }))
}

function sectionSidebar(section: string): DefaultTheme.SidebarItem[] {
  const dir = join(contentDir, section)
  const pages = markdownFiles(dir)
    .filter((file) => !file.endsWith('README.md') && !file.endsWith('index.md'))
    .map((file) => ({
      text: titleFor(file),
      link: routeFor(file)
    }))

  const index = join(dir, 'index.md')
  const readme = join(dir, 'README.md')
  const overview = existsSync(index) || existsSync(readme)
    ? [{ text: 'Přehled', link: routeFor(existsSync(index) ? index : readme) }]
    : []

  return [
    {
      text: sectionLabels.get(section) ?? section,
      collapsed: false,
      items: [...overview, ...pages]
    },
    ...nestedMarkdownGroups(dir)
  ].filter((group) => group.items.length > 0)
}

function sectionOverviewLink(section: string): string {
  const dir = join(contentDir, section)
  const index = join(dir, 'index.md')
  const readme = join(dir, 'README.md')

  if (existsSync(index)) return routeFor(index)
  if (existsSync(readme)) return routeFor(readme)
  return `/${section}/`
}

ensureSectionIndexes()

const sectionEntries = [...sectionLabels.keys()]
  .map((section) => [section, sectionSidebar(section)] as const)
  .filter(([, items]) => items.length > 0)

const sidebar: DefaultTheme.Sidebar = Object.fromEntries(
  sectionEntries.map(([section, items]) => [`/${section}/`, items])
)

sidebar['/'] = [
  {
    text: 'Wiki',
    collapsed: false,
    items: [
      { text: 'Domů', link: '/' },
      { text: 'README', link: '/README' },
      { text: 'Plán', link: '/PLAN' }
    ]
  }
]

const staticExtensions = new Set([
  '.csv',
  '.docx',
  '.gif',
  '.html',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.png',
  '.pptx',
  '.svg',
  '.txt',
  '.webp',
  '.xlsx'
])

function copyStaticAssets(sourceDir: string, outputDir: string): void {
  if (!existsSync(sourceDir)) return

  for (const entry of readdirSync(sourceDir)) {
    if (ignoredDirs.has(entry)) continue

    const source = join(sourceDir, entry)
    const output = join(outputDir, entry)
    const stats = statSync(source)

    if (stats.isDirectory()) {
      copyStaticAssets(source, output)
      continue
    }

    if (!staticExtensions.has(extname(entry).toLowerCase())) continue

    mkdirSync(dirname(output), { recursive: true })
    copyFileSync(source, output)
  }
}

function calloutTypeFor(icon: string): string {
  if (/⚠|❗|‼|🚨|😡/.test(icon)) return 'danger'
  if (/💡|✅|😇|☝|👉/.test(icon)) return 'tip'
  return 'info'
}

function normalizeAsideContent(raw: string): string {
  const lines = raw.trim().split(/\r?\n/)
  const firstContentLine = lines.findIndex((line) => line.trim().length > 0)
  const icon = firstContentLine >= 0 && lines[firstContentLine].trim().length <= 4
    ? lines[firstContentLine].trim()
    : 'Poznámka'

  const body = lines
    .filter((_, index) => index !== firstContentLine)
    .join('\n')
    .trim()
    .replace(/^#{1,6}\s+\*\*(.+?)\*\*$/gm, '**$1**')
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')

  return `::: ${calloutTypeFor(icon)} ${icon}\n${body}\n:::`
}

function normalizeNotionAsides(source: string): string {
  return source.replace(/^<aside>\s*\n([\s\S]*?)\n<\/aside>/gm, (_, content: string) => normalizeAsideContent(content))
}

function escapeVueMustachesOutsideCode(source: string): string {
  const parts = source.split(/(```[\s\S]*?```)/g)

  return parts
    .map((part) => {
      if (part.startsWith('```')) return part
      return part.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;')
    })
    .join('')
}

function normalizeMarkdown(source: string): string {
  return escapeVueMustachesOutsideCode(normalizeNotionAsides(source))
}

export default defineConfig({
  srcDir,
  title: 'Maturita 2026',
  description: 'Statická maturitní wiki z Markdown poznámek',
  lang: 'cs-CZ',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]],
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  srcExclude: ['_podklady/**', 'node_modules/**'],
  vite: {
    plugins: [
      {
        name: 'maturita-markdown-normalizer',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('.md')) return

          return normalizeMarkdown(code)
        }
      },
      {
        name: 'maturita-static-assets',
        apply: 'build',
        writeBundle() {
          for (const [section] of sectionEntries) {
            copyStaticAssets(join(contentDir, section), join(configDir, 'dist', section))
          }
        }
      }
    ]
  },
  markdown: {
    html: false,
    lineNumbers: true
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      ...sectionEntries.map(([section]) => ({
        text: sectionLabels.get(section) ?? section,
        link: sectionOverviewLink(section)
      })),
      { text: 'Plán', link: '/PLAN' }
    ],
    sidebar,
    outline: {
      level: [2, 3],
      label: 'Na stránce'
    },
    docFooter: {
      prev: 'Předchozí',
      next: 'Další'
    },
    lastUpdated: {
      text: 'Aktualizováno',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    darkModeSwitchLabel: 'Vzhled',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Zpět nahoru',
    socialLinks: [],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Hledat',
            buttonAriaLabel: 'Hledat'
          },
          modal: {
            displayDetails: 'Zobrazit detail',
            resetButtonTitle: 'Vymazat hledání',
            backButtonTitle: 'Zavřít hledání',
            noResultsText: 'Žádné výsledky pro',
            footer: {
              selectText: 'vybrat',
              selectKeyAriaLabel: 'enter',
              navigateText: 'procházet',
              navigateUpKeyAriaLabel: 'šipka nahoru',
              navigateDownKeyAriaLabel: 'šipka dolů',
              closeText: 'zavřít',
              closeKeyAriaLabel: 'escape'
            }
          }
        }
      }
    }
  }
})
