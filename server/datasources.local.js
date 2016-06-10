module.exports = {
  db: {
    connector: 'mysql',
    hostname: process.env.DB_HOST || '192.168.99.100',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || 'password',
    database: 'release',
  },
  mysqlDS: {
    connector: 'mysql',
    hostname: process.env.DB_HOST || '192.168.99.100',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || 'password',
    database: 'release',
  }

};

