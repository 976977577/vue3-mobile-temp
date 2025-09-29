import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const createFontSlice = (await import('font-slice')).default

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface FontConfig {
  name: string
  file: string
}

const fontConfigs: FontConfig[] = [
  {
    name: 'HarmonyOS_Sans_SC_Thin',
    file: 'HarmonyOS_Sans_SC_Thin.ttf'
  },
  {
    name: 'HarmonyOS_Sans_SC_Light',
    file: 'HarmonyOS_Sans_SC_Light.ttf'
  },
  {
    name: 'HarmonyOS_Sans_SC_Regular',
    file: 'HarmonyOS_Sans_SC_Regular.ttf'
  },
  {
    name: 'HarmonyOS_Sans_SC_Medium',
    file: 'HarmonyOS_Sans_SC_Medium.ttf'
  },
  {
    name: 'HarmonyOS_Sans_SC_Bold',
    file: 'HarmonyOS_Sans_SC_Bold.ttf'
  },
  {
    name: 'HarmonyOS_Sans_SC_Black',
    file: 'HarmonyOS_Sans_SC_Black.ttf'
  }
]

async function processFonts(): Promise<void> {
  console.log('开始处理字体切片...')

  for (const config of fontConfigs) {
    const fontPath = path.resolve(__dirname, '../src/assets/fonts/HarmonyOS_Sans_SC', config.file)
    const outputDir = path.resolve(__dirname, '../fonts', config.name)

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    if (!fs.existsSync(fontPath)) {
      console.warn(`字体文件不存在: ${fontPath}`)
      continue
    }

    try {
      await createFontSlice({
        fontPath,
        outputDir,
        preview: false,
        fontFamily: 'HarmonyOS Sans SC',
        fontDisplay: 'swap',
        formats: ['woff2'] as const,
        generateFontSubsetName: (fontFileName, index) => {
          return `${path.basename(fontFileName, '.ttf')}.${index + 1}`
        }
      })

      console.log(`✅ ${config.name} 处理完成`)
    }
    catch (error) {
      console.error(`❌ 处理 ${config.name} 时出错:`, error)
    }
  }

  console.log('字体切片处理完成！')
}

processFonts().catch(console.error)
