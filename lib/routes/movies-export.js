'use strict';

module.exports = {
    method: 'post',
    path: '/movies/export',
    options: {
        tags: ['api'],
        auth: { scope: ['admin'] }
    },
    handler: async (request, h) => {
        const { exportService } = request.services();

        try {
            await exportService.sendCsvToUser(request.auth.credentials.id);
            return { message: 'Export sent by mail' };
        } catch (err) {
            return { error: err.message };
        }
    }
};