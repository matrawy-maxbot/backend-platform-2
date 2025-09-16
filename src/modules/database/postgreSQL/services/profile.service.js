import { Profile } from '../models/index.js';
import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';

class ProfileService {
  async create(profileData) {
    return await PGinsert(Profile, {
      id: profileData.id,
      credits: profileData.credits || 0,
      xp: profileData.xp || 0,
      level: profileData.level || 1,
      country: profileData.country || null,
      city: profileData.city || null,
      backgrounds: profileData.backgrounds || '[]',
      active_background: profileData.active_background || null
    });
  }

  async get(filter = {}) {
    return await PGselectAll(Profile, filter);
  }

  async getById(id) {
    return await PGselectAll(Profile, { id });
  }

  async getByLevel(level) {
    return await PGselectAll(Profile, { level });
  }

  async getByCountry(country) {
    return await PGselectAll(Profile, { country });
  }

  async update(id, updateData) {
    return await PGupdate(Profile, updateData, { id });
  }

  async updateCredits(id, credits) {
    return await PGupdate(Profile, { credits }, { id });
  }

  async updateXP(id, xp) {
    return await PGupdate(Profile, { xp }, { id });
  }

  async updateLevel(id, level) {
    return await PGupdate(Profile, { level }, { id });
  }

  async delete(id) {
    return await PGdelete(Profile, { id });
  }

  async deleteByCountry(country) {
    return await PGdelete(Profile, { country });
  }
}

export default ProfileService;