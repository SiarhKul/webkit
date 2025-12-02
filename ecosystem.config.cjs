module.exports = {
  apps: [
    {
      name: 'webkit-app',
      script: './build/src/main.js',
      cwd: __dirname,
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster', // Cluster mode for better performance
      watch: false, // Set to true if you want auto-restart on file changes
      max_memory_restart: '512M', // Restart if memory exceeds 512MB
      env_production: {
        NODE_ENV: 'production',
      },
      env_local: {
        NODE_ENV: 'local',
        PORT: 3002,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USER: 'user',
        DB_PASSWORD: 'password',
        DB_NAME: 'db-webkit',
        DB_LOGGING: false,
        DB_SYNCHRONIZE: true,
        LOKI_HOST: 'http://localhost:3100',
        LOG_TO_LOKI: true,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3002,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USER: 'user',
        DB_PASSWORD: 'password',
        DB_NAME: 'db-webkit',
        DB_LOGGING: false,
        DB_SYNCHRONIZE: true,
        LOKI_HOST: 'http://localhost:3100',
        LOG_TO_LOKI: true,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
}
