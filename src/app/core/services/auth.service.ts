import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../models/storage-keys';
import {
  AuthCredentials,
  RegisterPayload,
  User,
  UserPublic,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly currentUserSubject = new BehaviorSubject<UserPublic | null>(
    this.loadCurrentUser(),
  );

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));

  get currentUser(): UserPublic | null {
    return this.currentUserSubject.value;
  }

  register(payload: RegisterPayload): { success: boolean; message: string } {
    const users = this.getUsers();
    const email = payload.email.trim().toLowerCase();

    if (users.some((u) => u.email === email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email,
      password: payload.password,
    };

    users.push(user);
    this.storage.setItem(STORAGE_KEYS.users, users);
    this.setSession(this.toPublic(user));
    return { success: true, message: 'Account created successfully.' };
  }

  login(credentials: AuthCredentials): { success: boolean; message: string } {
    const email = credentials.email.trim().toLowerCase();
    const user = this.getUsers().find(
      (u) => u.email === email && u.password === credentials.password,
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    this.setSession(this.toPublic(user));
    return { success: true, message: 'Welcome back!' };
  }

  logout(): void {
    this.storage.removeItem(STORAGE_KEYS.currentUser);
    this.currentUserSubject.next(null);
    void this.router.navigate(['/login']);
  }

  private setSession(user: UserPublic): void {
    this.storage.setItem(STORAGE_KEYS.currentUser, user);
    this.currentUserSubject.next(user);
  }

  private getUsers(): User[] {
    return this.storage.getItem<User[]>(STORAGE_KEYS.users) ?? [];
  }

  private loadCurrentUser(): UserPublic | null {
    return this.storage.getItem<UserPublic>(STORAGE_KEYS.currentUser);
  }

  private toPublic(user: User): UserPublic {
    return { id: user.id, name: user.name, email: user.email };
  }
}
