import UserRepository from '../repositories/User.repository.js';
// import { hashPassword } from '../../../../utils/hash.util.js';

class UserService {
  async createUser(userData) {
    // userData.password = await hashPassword(userData.password);
    return await UserRepository.create(userData);
  }

  async getUserById(id) {
    return await UserRepository.findById(id);
  }

  async getUserByEmail(email) {
    return await UserRepository.findByEmail(email);
  }

  async updateUser(id, userData) {
    if (userData.password) {
      // userData.password = await hashPassword(userData.password);
    }
    return await UserRepository.update(id, userData);
  }

  async deleteUser(id) {
    return await UserRepository.delete(id);
  }
}

export default new UserService();