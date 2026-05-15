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
  const source = relativeMarkdownPath(filePath)
  const rel = (routeRewrites[source] ?? source).replace(/\.md$/i, '')
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

function cleanNotionId(value: string): string {
  return value.replace(/\s+[0-9a-f]{32}(?=\.md$|$)/i, '').trim()
}

function cleanNotionPath(value: string): string {
  return value.split('/').map(cleanNotionId).join('/')
}

function slugifySegment(value: string): string {
  const extension = value.endsWith('.md') ? '.md' : ''
  const basename = extension ? value.slice(0, -extension.length) : value

  if (basename === 'index') return `${basename}${extension}`

  const slug = cleanNotionId(basename)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${slug || basename.toLowerCase()}${extension}`
}

function slugifyPath(value: string): string {
  return value.split('/').map(slugifySegment).join('/')
}

function relativeMarkdownPath(filePath: string): string {
  return relative(contentDir, filePath).replace(/\\/g, '/')
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

function markdownFilesDeep(dir: string): string[] {
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .flatMap((entry) => {
      if (ignoredDirs.has(entry)) return []

      const path = join(dir, entry)
      const stats = statSync(path)

      if (stats.isDirectory()) return markdownFilesDeep(path)
      if (stats.isFile() && entry.endsWith('.md')) return [path]
      return []
    })
    .sort(sortPages)
}

function createRouteRewrites(): Record<string, string> {
  const rewrites: Record<string, string> = {}
  const sourcePaths = new Set(markdownFilesDeep(contentDir).map(relativeMarkdownPath))
  const destinationPaths = new Set<string>()

  for (const source of sourcePaths) {
    if (!source.includes('/')) continue

    const destination = slugifyPath(cleanNotionPath(source))
    if (destination === source) continue
    if (sourcePaths.has(destination) || destinationPaths.has(destination)) continue

    rewrites[source] = destination
    destinationPaths.add(destination)
  }

  return rewrites
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

const routeRewrites = createRouteRewrites()

function rewriteRoute(id: string): string {
  return routeRewrites[id] ?? id
}

const sectionEntries = [...sectionLabels.keys()]
  .map((section) => [section, sectionSidebar(section)] as const)
  .filter(([, items]) => items.length > 0)

const sidebar: DefaultTheme.Sidebar = Object.fromEntries(
  sectionEntries.map(([section, items]) => [sectionOverviewLink(section), items])
)

const readmePath = join(contentDir, 'README.md')
const planPath = join(contentDir, 'PLAN.md')

sidebar['/'] = [
  {
    text: 'Wiki',
    collapsed: false,
    items: [
      { text: 'Domů', link: '/' },
      ...(existsSync(readmePath) ? [{ text: 'README', link: routeFor(readmePath) }] : []),
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
  return normalizeSectionDirectoryLinks(escapeVueMustachesOutsideCode(normalizeNotionAsides(source)))
}

function normalizeSectionDirectoryLinks(source: string): string {
  const sectionRoutes = new Map(
    [...sectionLabels.keys()].map((section) => [section, sectionOverviewLink(section)])
  )

  return source.replace(
    /(\[[^\]\n]+\]\()(\.\/)?([A-Za-z0-9_-]+)\/(\))/g,
    (match, prefix: string, relativePrefix: string | undefined, section: string, suffix: string) => {
      const route = sectionRoutes.get(section)
      return route ? `${prefix}${route}${suffix}` : match
    }
  )
}

function readPhantomExpression(source: string, start = 0): { content: string; end: number } | null {
  if (source[start] !== '$') return null

  let cursor = start + 1

  while (source[cursor] === ' ' || source[cursor] === '\t') cursor += 1

  if (!source.startsWith('\\phantom{', cursor)) return null

  const contentStart = cursor + '\\phantom{'.length
  cursor = contentStart

  let depth = 1

  while (cursor < source.length) {
    const char = source[cursor]

    if (char === '\\') {
      cursor += 2
      continue
    }

    if (char === '{') depth += 1
    if (char === '}') depth -= 1

    if (depth === 0) {
      const content = source.slice(contentStart, cursor)
      cursor += 1

      while (source[cursor] === ' ' || source[cursor] === '\t') cursor += 1

      return source[cursor] === '$'
        ? { content, end: cursor + 1 }
        : null
    }

    cursor += 1
  }

  return null
}

function phantomRendererPlugin(md: any): void {
  md.block.ruler.before('paragraph', 'phantom_block', (state: any, startLine: number, _endLine: number, silent: boolean) => {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const end = state.eMarks[startLine]
    const line = state.src.slice(start, end).trim()
    const expression = readPhantomExpression(line)

    if (!expression || expression.end !== line.length) return false
    if (silent) return true

    const token = state.push('phantom_block', 'div', 0)
    token.block = true
    token.content = expression.content
    token.map = [startLine, startLine + 1]

    state.line = startLine + 1
    return true
  })

  md.inline.ruler.before('text', 'phantom_inline', (state: any, silent: boolean) => {
    const expression = readPhantomExpression(state.src, state.pos)

    if (!expression) return false
    if (!silent) {
      const token = state.push('phantom_inline', 'span', 0)
      token.content = expression.content
    }

    state.pos = expression.end
    return true
  })

  md.renderer.rules.phantom_block = (tokens: any[], index: number) =>
    `<div class="llm-phantom" aria-hidden="true">${md.utils.escapeHtml(tokens[index].content)}</div>\n`

  md.renderer.rules.phantom_inline = (tokens: any[], index: number) =>
    `<span class="llm-phantom" aria-hidden="true">${md.utils.escapeHtml(tokens[index].content)}</span>`
}

export default defineConfig({
  srcDir,
  title: 'Maturita 2026',
  description: 'Statická maturitní wiki z Markdown poznámek',
  lang: 'cs-CZ',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]],
  cleanUrls: true,
  rewrites: rewriteRoute,
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
    lineNumbers: true,
    config(md) {
      md.use(phantomRendererPlugin)
    }
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
