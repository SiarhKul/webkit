module.exports = {
  apps: [
    {
      name: 'webkit-main',
      script: './build/src/main.js',
      cwd: __dirname,
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster', // Cluster mode for better performance
      watch: false, // Set to true if you want auto-restart on file changes
      max_memory_restart: '512M', // Restart if memory exceeds 512MB
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
}
