import { type Address } from 'viem'
import { AuthStorage } from './storage'
import {
  type AuthMessageRequest,
  type AuthSignInRequest,
  type AuthResponse,
  type UserProfile,
  type ApiError,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wrytes.io'

export class AuthService {
  private static instance: AuthService
  private baseURL: string

  private constructor() {
    this.baseURL = API_BASE_URL
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // HTTP client with error handling
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = AuthStorage.getToken()

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const apiError: ApiError = {
          message: errorData.message || `HTTP ${response.status}`,
          code: errorData.code || 'HTTP_ERROR',
          statusCode: response.status,
          details: errorData,
        }
        throw apiError
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error // Re-throw API errors
      }
      
      // Handle network errors
      const networkError: ApiError = {
        message: 'Network error occurred',
        code: 'NETWORK_ERROR',
        statusCode: 0,
        details: { originalError: error },
      }
      throw networkError
    }
  }

  // Generate message for signing
  async generateMessage(address: Address, valid?: number, expired?: number): Promise<string> {
    const requestBody: AuthMessageRequest = {
      address,
      ...(valid && { valid }),
      ...(expired && { expired }),
    }

    const url = `${this.baseURL}/auth/message`
    const token = AuthStorage.getToken()

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const apiError: ApiError = {
          message: errorData.message || `HTTP ${response.status}`,
          code: errorData.code || 'HTTP_ERROR',
          statusCode: response.status,
          details: errorData,
        }
        throw apiError
      }

      // The API returns a plain string, not JSON
      return await response.text()
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error // Re-throw API errors
      }
      
      // Handle network errors
      const networkError: ApiError = {
        message: 'Network error occurred',
        code: 'NETWORK_ERROR',
        statusCode: 0,
        details: { originalError: error },
      }
      throw networkError
    }
  }

  // Sign in with message and signature
  async signIn(message: string, signature: `0x${string}`): Promise<AuthResponse> {
    const requestBody: AuthSignInRequest = {
      message,
      signature,
    }

    const response = await this.makeRequest<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })

    // Store the token
    AuthStorage.setToken(response.accessToken)

    return response
  }

  // Get current user profile
  async getCurrentUser(): Promise<UserProfile> {
    const user = await this.makeRequest<UserProfile>('/auth/me', {
      method: 'GET',
    })

    // Store user data
    AuthStorage.setUser(user)

    return user
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    })

    // Store the new token
    AuthStorage.setToken(response.accessToken)

    return response
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await this.makeRequest('/auth/signout', {
        method: 'POST',
      })
    } catch (error) {
      // Continue with local cleanup even if server request fails
      console.warn('Sign out request failed:', error)
    }

    // Clear local storage
    AuthStorage.clearAll()
  }

  // Token management
  getStoredToken(): string | null {
    return AuthStorage.getToken()
  }

  setToken(token: string): void {
    AuthStorage.setToken(token)
  }

  clearToken(): void {
    AuthStorage.clearToken()
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return AuthStorage.hasValidToken()
  }

  // Get stored user
  getStoredUser(): UserProfile | null {
    return AuthStorage.getUser()
  }

  // Check token expiration
  isTokenExpiringSoon(): boolean {
    return AuthStorage.isTokenExpiringSoon()
  }

  // Validate address format
  validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  // Validate signature format
  validateSignature(signature: string): boolean {
    return /^0x[a-fA-F0-9]{130}$/.test(signature)
  }
}