<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user and return a Sanctum token.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $plainTextToken = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => [
                'user'          => $user,
                'session_token' => $plainTextToken,
            ],
            'message' => 'Registration successful',
        ], 201);
    }

    /**
     * Login an existing user and return a Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $plainTextToken = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => [
                'user'          => $user,
                'session_token' => $plainTextToken,
            ],
            'message' => 'Login successful',
        ]);
    }

    /**
     * Return authenticated user details.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'user' => $request->user(),
            ],
            'message' => 'Authenticated user retrieved',
        ]);
    }

    /**
     * Logout (revoke current token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Health-check endpoint.
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'status'  => 'ok',
                'service' => 'Eventra API',
                'version' => '1.0.0',
            ],
            'message' => 'API is running',
        ]);
    }
}
