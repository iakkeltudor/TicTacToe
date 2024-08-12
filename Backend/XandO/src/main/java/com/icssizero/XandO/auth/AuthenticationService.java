package com.icssizero.XandO.auth;

import com.icssizero.XandO.config.CustomPasswordEncoder;
import com.icssizero.XandO.config.DataAccessService;
import com.icssizero.XandO.config.JwtService;
import com.icssizero.XandO.user.Role;
import com.icssizero.XandO.user.User;
import com.icssizero.XandO.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final DataAccessService dataAccessService;
    private final UserRepository repository;
    //private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    //private final CustomPasswordEncoder customPasswordEncoder;

    public AuthenticationResponse register(RegisterRequest request) {
        String encryptedPassword = bytesToHex(hashPassword(request.getPassword()));
        var user = User.builder()
                .username(request.getUsername())
                .password(encryptedPassword)
                .role(Role.USER)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    private byte[] hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(password.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            // Handle NoSuchAlgorithmException (e.g., log the error, throw an exception, etc.)
            e.printStackTrace(); // Example: Printing the stack trace
            return new byte[0]; // Or return some default value indicating an error
        }
    }

    static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (int i = 0; i < hash.length; i++) {
            String hex = Integer.toHexString(0xff & hash[i]);
            if(hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }
}
