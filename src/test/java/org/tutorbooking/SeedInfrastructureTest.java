package org.tutorbooking;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

class SeedInfrastructureTest {

    private static final Pattern TEST_PASSWORD_HASH = Pattern.compile(
            "SET @test_password_hash = '([^']+)';");

    @Test
    void runnerPasswordHashMatchesTheRequiredTestCredential() throws IOException {
        String runner = Files.readString(
                Path.of("scripts", "seed-test-data.ps1"), StandardCharsets.UTF_8);
        Matcher hashAssignment = TEST_PASSWORD_HASH.matcher(runner);

        assertThat(hashAssignment.find())
                .as("the seed runner must assign its test-password hash")
                .isTrue();
        String hashUsedByRunner = hashAssignment.group(1).replace("`$", "$");

        assertThat(new BCryptPasswordEncoder().matches("Test@123", hashUsedByRunner)).isTrue();
    }
}
