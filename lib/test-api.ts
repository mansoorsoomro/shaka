import { authService } from './services/auth-service';

async function testApi() {
    console.log('--- Testing API Integration ---');

    try {
        console.log('1. Testing Google Redirect URL...');
        const googleRedirect = await authService.getGoogleRedirect();
        console.log('Success:', googleRedirect);

        // Note: Other endpoints require dynamic data (email/password) or valid tokens.
        // We've verified the client structure and base setup with the public redirect call.

        console.log('\n2. Testing Login structure (Expected error if creds are wrong)...');
        try {
            await authService.login({ email: 'test@example.com', password: 'password' });
        } catch (error: any) {
            console.log('Caught expected error from login:', error.message);
        }

    } catch (error) {
        console.error('API Test Failed:', error);
    }
}

// In a real Next.js environment, we would call this from a component or server action.
// This file serves as a reference for how to use the services.
// To run this manually if you have ts-node: npx ts-node lib/test-api.ts
// export { testApi };
