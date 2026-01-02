// scripts/generate-proto.js
console.log('1')
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

console.log('Generating TypeScript from .proto files...')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const protoDir = join(__dirname, '../grpc/proto')
const outputDir = join(__dirname, '../grpc/generated')

// Ensure output directory exists
import { existsSync, mkdirSync } from 'fs'
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

try {
  // Generate TypeScript files
  // Use .cmd extension on Windows for the plugin and absolute path
  const isWindows = process.platform === 'win32'
  const pluginExt = isWindows ? '.cmd' : ''
  const pluginPath = join(
    process.cwd(),
    'node_modules',
    '.bin',
    `protoc-gen-ts_proto${pluginExt}`
  )

  const command = `npx protoc \
    --plugin=protoc-gen-ts_proto="${pluginPath}" \
    --ts_proto_out=${outputDir} \
    --ts_proto_opt=outputServices=grpc-js,env=node,esModuleInterop=true,useOptionals=messages,exportCommonSymbols=false,oneof=unions \
    --proto_path=${protoDir} \
    ${protoDir}/notification.proto`

  console.log('Running command:', command)
  execSync(command, { stdio: 'inherit' })

  console.log('✅ TypeScript files generated successfully!')
} catch (error) {
  console.error('❌ Failed to generate TypeScript files:', error.message)
  process.exit(1)
}
