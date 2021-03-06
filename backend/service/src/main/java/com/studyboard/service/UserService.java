package com.studyboard.service;

import com.studyboard.exception.UniqueConstraintException;
import com.studyboard.model.User;

import java.util.List;

public interface UserService {

    /**
     * Find a single user entry by id.
     *
     * @param id of the user
     * @return the user object with the specified id
     */
    User getUser(Long id);

    /**
     * Find a single user entry by username.
     *
     * @param username of the user
     * @return the user object with the specified username
     */
    User getUserByUsername(String username);

    /**
     * Returns a list of all users.
     */
    List<User> getAllUsers();

    /**
     * Create a single user entry
     *
     * @param user to create
     * @return created user entry
     */
    User createUser(User user) throws UniqueConstraintException;


    /**
     * Update user password
     *
     * @param username of the user whose password should be updated
     * @param password new password
     * @return user with updated password
     */
    User updateUserPassword(String username, String password);

    /**
     * Resets login attempts to 0
     *
     * @param id of the user
     * @return user with 0 login attempts
     */
    User resetLoginAttempts(Long id);

    /**
     * Check if email address exists and send recovery email with reset token.
     *
     * @param email of the user
     */
    void checkEmailAndRecover(String email);

    /**
     * Validate reset token.
     *
     * @param token - password reset token which is being verified.
     * @return true if token is valid and non-expired
     */
    boolean validateResetToken(String token);

    /**
     * Change password if token is valid and non-expired.
     *
     * @param token - password reset token which is being verified.
     */
    void changePasswordWithToken(String token, String password);
}
