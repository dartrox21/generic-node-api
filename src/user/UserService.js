const GenericService = require('../generics/GenericService');
const CustomValidateException = require('../exceptionHandler/CustomValidateException');
const CustomErrorMessages = require('../exceptionHandler/CustomErrorMessages');
const HttpStatus = require('http-status-codes');
const UserRepository = require('./UserRepository');
const User = require('./User.model');
const userProjection = require('./projections/user.projection');

class UserSevice extends GenericService {
    constructor() {
        super(User);
        this.create = this.create.bind(this);
        this.uniqueValidateException = this.uniqueValidateException.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.delete = this.delete.bind(this);
        this.findByIdAndValidate = this.findByIdAndValidate.bind(this);
        this.update = this.update.bind(this);
    }

    /**
     * Finds a user in the database based on the email
     * @param User user object
     * @throws CustomValidateException if the user with the email exists
    */ 
    async uniqueValidateException(user) {
        let found = await UserRepository.findByEmail(user.email);
        if(found !== null) {
            throw CustomValidateException.conflict().errorMessage(CustomErrorMessages.EMAIL_ALREADY_USE).build();
        }
    }
    
    /**
     * Service used to create a new user
     * @param req Request object
     * @param res Response object
     * @throws CustomValidateException CONFLICT if the email already exists
     * @throws CustomValidateException BAD REQUEST if Mongoose throws an error
     * @returns Response 201 CREATED with the user created
    */
    async create(req, res) {
        const user = req.body;
        await this.uniqueValidateException(user);
        let userCreated = await UserRepository.save(user);
        userCreated = userCreated.toObject();
        delete userCreated.password;
        res.status(HttpStatus.CREATED).json(userCreated);
    }
    
    /**
     * Service to get the list of all the users with the user projection
     * @param req Request object
     * @param res Response object
     * @returns 200 OK if the list is not empty.
     * @returns 204 NO CONTENT if the list is empty.
    */ 
    async getAll(req, res) {
        const users = await UserRepository.getAll(req.query.filters, userProjection);
        super.getListResponse(res, users);
    }
    
    /**
     * Service to get the pageable list of all the users with the user projection
     * @param req Request object
     * @param res Response object
     * @returns 200 OK if the list is not empty.
     * @returns 204 NO CONTENT if the list is empty.
    */
    async getAllPageable(req, res) {
        const limit = req.query.limit;
        const page = req.query.page;
        const filters = req.query.filters;
        const users =  await UserRepository.getAllPageable(limit, page, filters, userProjection);
        const totalDocuments = await UserRepository.countDocuments();
        super.getPageableResponse(res, users, page, limit, totalDocuments);
    }

    /**
     * Service used to find a user by id
     * @param req Request object
     * @param res Response object
     * @returns 404 NOT FOUND if the user is not found
     * @returns 200 OK If the user is found
     */
    async getById(req, res) {
        const user = await this.findByIdAndValidate(req.params.id);
        res.status(HttpStatus.OK).json(user);
    }

    /**
     * Serivce used to logically deletes a user setting its flag active to false
     * @param req Request object
     * @param res Response object
     * @returns 404 NOT FOUND if the user is not found
     * @returns 200 OK If the user is deleted successfully
     */
    async delete(req, res) {
        await this.findByIdAndValidate(req.params.id);
        await UserRepository.delete(req.params.id);
        res.status(HttpStatus.OK).send();
    }

    /**
     * Service used to update a user.
     * Fields susch as _id and active cannot be updated
     * @param req Request object
     * @param res Response object
     * @returns 404 NOT FOUND if the user is not found
     * @returns 200 OK If the user is updated successfully
     */
    async update(req, res) {
        const id = req.params.id;
        await this.findByIdAndValidate(id);
        const user = await UserRepository.update(id, req.body, userProjection);
        res.status(HttpStatus.OK).json(user);
    }

    /**
     * Service used to find an user by id
     * @param req Request object
     * @param id 
     * @returns User found
     * @throws CustomValidateException 404 NOT FOUND if the user is not found
     */
    async findByIdAndValidate(id) {
        const user = await UserRepository.getById(id, userProjection);
        if(!user) {
            throw CustomValidateException.notFound().build();
        }
        return user;
    }

    /**
     * Finds and validates a user by its email
     * @param email 
     */
    async findByEmail(email) {
        const user = await UserRepository.findByEmail(email);
        if(!user || !user.active) {
            throw CustomValidateException.notFound().build();
        }
        return user;
    }
}

module.exports = new UserSevice();
