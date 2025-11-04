package com.example.backend.Utilities;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access.expiration:3600000}") // 1h default, ms
    private long accessExpiration;

    @Value("${jwt.refresh.expiration:86400000}") // 24h default
    private long refreshExpiration;

    private SecretKey getSigningKey() {
        if (secret.getBytes().length < 32) {
            throw new IllegalArgumentException("JWT secret too short; use at least 256 bits");
        }
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Embed id, name, email, role vào claims (email là subject nhưng nhúng thêm cho tiện)
    private Map<String, Object> getClaims(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof com.example.backend.Config.CustomUserDetails custom) {
            claims.put("id", custom.getId());
            claims.put("name", custom.getName());
            claims.put("email", custom.getEmail());
            claims.put("role", custom.getRole().name());
            claims.put("profileId", custom.getProfileId());
            claims.put("profileImageUrlId", custom.getProfileImageUrlId());
        }
        // Giữ roles list cho Spring Security
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        return claims;
    }

    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = getClaims(userDetails);
        return createToken(claims, userDetails.getUsername(), accessExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername(), refreshExpiration);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationMs) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Helper để extract role từ token (client có thể dùng tương tự)
    public String extractRole(String token) {
        return (String) extractClaim(token, claims -> claims.get("role"));
    }

    // Giữ extractRoles cũ nếu cần
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return (List<String>) extractClaim(token, claims -> claims.get("roles", List.class));
    }
}