package com.icssizero.XandO.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    boolean existsUserByUsername(String username);
    //User updateUser(Long userId, String username, String password);
}
