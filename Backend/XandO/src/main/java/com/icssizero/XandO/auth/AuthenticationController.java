package com.icssizero.XandO.auth;

import com.icssizero.XandO.config.CustomPasswordEncoder;
import com.icssizero.XandO.user.User;
import com.icssizero.XandO.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request
    ) throws NoSuchAlgorithmException {
        System.out.println(request.getUsername().length());
        if (request.getUsername().isEmpty()) {
            return new ResponseEntity<>("Username must not be empty", HttpStatus.BAD_REQUEST);
        } else {
            if (repository.existsUserByUsername(request.getUsername())) {
                return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
            }
        }

        service.register(request);
        return new ResponseEntity<>("User registered successfully", HttpStatus.ACCEPTED);
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
            //PasswordEncoder encoder = new BCryptPasswordEncoder();
            CustomPasswordEncoder encoder = new CustomPasswordEncoder();
            String encryptedPass = encoder.encode(requestPassword);

            System.out.println("hashedPasswordFromDB: " + hashedPasswordFromDB);
            System.out.println("encryptedPass: " + encryptedPass);


            if (encryptedPass.equals(hashedPasswordFromDB)) {
                System.out.println("asd");
                return ResponseEntity.ok(service.authenticate(request));
            }
        }
        return new ResponseEntity<>("Wrong username or password", HttpStatus.BAD_REQUEST);

    }
}
