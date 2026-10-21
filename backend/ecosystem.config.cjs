module.exports = {
  apps: [
    {
      name: "letschat",
      script: "./letschatapp.js",
      instances: 4,
      exec_mode: "cluster",

      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};