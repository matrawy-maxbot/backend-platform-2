import send from '../../../../../utils/responseHandler.util.js';
import { ProfileService } from '../../../../../modules/database/postgreSQL/index.js';

const profileService = new ProfileService();

export async function getProfile(req, res) {
    const profile = await profileService.getById(req.params.id);
    if (profile) {
        send(res, { data: profile }, 'Profile retrieved successfully', 200);
    } else {
        send(res, {}, 'Profile not found', 404);
    }
}

export async function createProfile(req, res) {
    try {
        const newProfile = await profileService.create(req.body);
        if (newProfile) {
            send(res, { data: newProfile }, 'Profile created successfully', 201);
        } else {
            send(res, {}, 'Profile creation failed', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'Profile creation failed', 400);
    }
}

export async function updateProfile(req, res) {
    try {
        const updatedProfile = await profileService.update(req.params.id, req.body);
        if (updatedProfile) {
            send(res, { data: updatedProfile }, 'Profile updated successfully', 200);
        } else {
            send(res, {}, 'Profile update failed', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'Profile update failed', 400);
    }
}

export async function deleteProfile(req, res) {
    try {
        const deletedProfile = await profileService.delete(req.params.id);
        if (deletedProfile) {
            send(res, {}, 'Profile deleted successfully', 200);
        } else {
            send(res, {}, 'Profile deletion failed', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'Profile deletion failed', 400);
    }
}