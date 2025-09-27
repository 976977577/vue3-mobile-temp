import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { transformSync } from 'esbuild'

export function preloadErrorHandler(): Plugin {
  return {
    name: 'preload-error-handler',
    apply: 'build',
    transformIndexHtml(html: string): string {
      const scriptPath = resolve(__dirname, 'preload-error-handler-script.ts')
      const tsContent = readFileSync(scriptPath, 'utf-8')

      const result = transformSync(tsContent, {
        loader: 'ts',
        target: 'es2015',
        minify: true,
        format: 'iife'
      })

      const scriptTag = `<script>${result.code}</script>\n`
      const headEndIndex = html.indexOf('</head>')
      if (headEndIndex !== -1) {
        return html.slice(0, headEndIndex) + scriptTag + html.slice(headEndIndex)
      }
      return html
    }
  }
}
