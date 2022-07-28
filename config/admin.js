module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '28678f38d9e69376a50a903d3fe85912'),
  },
});
