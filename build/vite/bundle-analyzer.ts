import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import pc from 'picocolors'

/**
 * 简单的打包产物大小分析插件
 * 在构建完成后输出文件大小信息到控制台
 */
export function bundleAnalyzer(): Plugin {
  let hasAnalyzed = false

  const analyzeBundleSize = () => {
    const outDir = 'dist'

    if (!fs.existsSync(outDir)) {
      return
    }

    console.log(`\n${pc.cyan('📦 打包产物大小分析:')}`)
    console.log(pc.white('='.repeat(50)))

    let totalSize = 0
    const files: Array<{ name: string, size: number, type: string }> = []

    // 递归读取 dist 目录下的所有文件
    const readDirRecursive = (dir: string, basePath = '') => {
      const items = fs.readdirSync(dir)

      items.forEach((item) => {
        const fullPath = path.join(dir, item)
        const relativePath = basePath ? path.join(basePath, item) : item
        const stats = fs.statSync(fullPath)

        if (stats.isDirectory()) {
          readDirRecursive(fullPath, relativePath)
        }
        else if (stats.isFile()) {
          const size = stats.size
          totalSize += size

          // 判断文件类型
          let type = 'Assets'
          if (item.endsWith('.js')) {
            type = 'JS'
          }
          else if (item.endsWith('.css')) {
            type = 'CSS'
          }

          files.push({
            name: relativePath,
            size,
            type,
          })
        }
      })
    }

    readDirRecursive(outDir)

    // 按大小排序
    files.sort((a, b) => b.size - a.size)

    // 输出文件信息
    files.forEach((file) => {
      const sizeKB = (file.size / 1024).toFixed(2)
      const percentage = ((file.size / totalSize) * 100).toFixed(1)

      // 根据文件类型设置颜色
      let typeColor = pc.gray
      let nameColor = pc.white

      if (file.type === 'JS') {
        typeColor = pc.yellow
        nameColor = pc.cyan
      }
      else if (file.type === 'CSS') {
        typeColor = pc.magenta
        nameColor = pc.magenta
      }
      else {
        typeColor = pc.gray
        nameColor = pc.gray
      }

      console.log(`${typeColor(file.type.padEnd(6))} ${nameColor(file.name.padEnd(35))} ${pc.green(`${sizeKB.padStart(8)} KB`)} ${pc.dim(`(${percentage}%)`)}`)
    })

    console.log(pc.white('='.repeat(50)))
    console.log(`${pc.bold('总计:')} ${pc.green(`${(totalSize / 1024).toFixed(2)} KB`)}`)

    let estimatedGzipSize = 0
    files.forEach((file) => {
      let compressionRatio = 0.3 // 默认压缩比

      if (file.type === 'JS') {
        compressionRatio = 0.25
      }
      else if (file.type === 'CSS') {
        compressionRatio = 0.3
      }
      else if (file.name.endsWith('.html')) {
        compressionRatio = 0.2
      }
      else {
        compressionRatio = 0.8
      }

      estimatedGzipSize += file.size * compressionRatio
    })

    console.log(`${pc.bold('Gzip 预估:')} ${pc.cyan(`~${(estimatedGzipSize / 1024).toFixed(2)} KB`)}`)
    console.log('')
  }

  return {
    name: 'bundle-analyzer',
    apply: 'build',
    buildStart() {
      hasAnalyzed = false
    },
    closeBundle() {
      if (!hasAnalyzed) {
        hasAnalyzed = true
        setTimeout(() => {
          analyzeBundleSize()
        }, 100)
      }
    },
  }
}
