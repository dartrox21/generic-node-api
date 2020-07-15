const User = require('./User.model');
const GenericRepository = require('../generics/GenericRepository');

/**
 * Class used to manage all the User requests to the DB
 */
class UserRepository extends GenericRepository {

    constructor() {
        super(User);
    }

    /**
     * Method to find a user by email
     * @param Email email 
     */
    async findByEmail(email) {
        return User.findOne({email: email});
    }

    /**
     * Method used to get all the active users from the db
     * @param filters filters object
     * @param projection. Can be null
     * @returns List of users
     */
    async getAll(filters, projection) {
        filters['active'] = true;
        return super.getAll(filters, projection);
    }

    /**
     * Method used to get all the active users from the db with params
     * such as limit & page
     * @param limit limit
     * @param page page
     * @param filters filters object
     * @param projection. Can be null
     * @returns List of users
     */
    async getAllPageable(limit, page, filters, projection) {
        filters['active'] = true;
        return super.getAllPageable(limit, page, filters, projection);
    }

    /**
     * Method used to count all the active users in the db
     */
    async countDocuments() {
        return User.countDocuments()
        .where('active').equals('true');
    }

    /**
     * Gets an active user by id 
     * @param id 
     * @param projection object. Can be null
     */
    async getById(id, projection) {
        return User.findById(id, projection)
        .where('active').equals('true');
    }

    /**
     * Logically deletes a user setting its flag active to false
     * @param id 
     */
    async delete(id) {
        return User.findByIdAndUpdate(id, {active: false}, {new: true});
    }

    /**
     * Update a user
     * @param id 
     * @param User user object
     * @param projection object. Can be null
     */
    async update(id, user, projection) {
        delete user.active;
        delete user._id;
        return User.findByIdAndUpdate(id, user, {new: true, projection});
    }
}

module.exports = new UserRepository();
