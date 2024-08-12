package com.icssizero.XandO.auth;

import com.icssizero.XandO.config.CustomPasswordEncoder;
import com.icssizero.XandO.user.Message;
import com.icssizero.XandO.user.Role;
import com.icssizero.XandO.user.User;
import com.icssizero.XandO.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;

    @PostMapping("/register")
    public Message register(
            @RequestBody RegisterRequest request
    ) throws NoSuchAlgorithmException {
        if (request.getUsername().isEmpty()) {
            return new Message("Username must not be empty");
        } else {
            if (repository.existsUserByUsername(request.getUsername())) {
                System.out.println(request.getUsername() + " already exists");
                return new Message("Username already exists");
            }
        }

        service.register(request);
        System.out.println(request.getUsername() + " registered successfully");
        return new Message("User registered successfully");
    }

    public User updateUser(Long userId, String newUsername, String newPassword, Role role) {
        try {
            Optional<User> optionalUser = repository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setUsername(newUsername);
                user.setPassword(newPassword);
                user.setRole(role);
                repository.save(user);
                return user;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @PutMapping("/updateUser")
    @ResponseBody
    public User updateUser(@RequestBody UpdateUserRequest updateUserRequest) {
        Long userId = Long.parseLong(updateUserRequest.getId());
        String newUsername = updateUserRequest.getNewUsername();
        String newPassword = updateUserRequest.getNewPassword();
        Role role = updateUserRequest.getRole();
        CustomPasswordEncoder encoder = new CustomPasswordEncoder();
        String encryptedPass = encoder.encode(newPassword);

        return updateUser(userId, newUsername, encryptedPass, role);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        Optional<User> userOptional = repository.findByUsername(request.getUsername());

        if (userOptional.isPresent()) {

            User user = userOptional.get();
            String hashedPasswordFromDB = user.getPassword();

            String requestPassword = request.getPassword();
            CustomPasswordEncoder encoder = new CustomPasswordEncoder();
            String encryptedPass = encoder.encode(requestPassword);

            //System.out.println("hashedPasswordFromDB: " + hashedPasswordFromDB);
            //System.out.println("encryptedPass: " + encryptedPass);


            if (encryptedPass.equals(hashedPasswordFromDB)) {
                System.out.println(user.getUsername() + " has logged in");
                return ResponseEntity.ok(service.authenticate(request));
            }
        }
        System.out.println(request.getUsername() + " couldn't log in");
        return new ResponseEntity<>("Wrong username or password", HttpStatus.BAD_REQUEST);

    }
}
