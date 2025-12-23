#!/usr/bin/env node
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const protocPath = path.join(__dirname, 'protoc_install', 'bin', 'protoc.exe')

try {
  // Run protoc with the ts_proto plugin
  const cmd = `"${protocPath}" --plugin=protoc-gen-ts_proto=".\\node_modules\\.bin\\protoc-gen-ts_proto.cmd" --ts_proto_out=. ./src/grpc/proto/notification.proto`
  console.log('Running:', cmd)
  execSync(cmd, { stdio: 'inherit', shell: true })
} catch (error) {
  console.error('Failed to run protoc:', error.message)
  process.exit(1)
}
