'use strict';

module.exports = {
    method: 'get',
    path: '/user/favorites',
    options: {
        tags: ['api'],
        auth: { scope: ['user', 'admin'] }
    },
    handler: async (request, h) => {
        const { favoriteService } = request.services();
        const userId = request.auth.credentials.id;
        return favoriteService.listUserFavorites(userId);
    }
};