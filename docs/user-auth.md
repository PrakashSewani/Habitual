# 👤 User Management & Authentication Module

## 📌 Overview

This module implements core **user management and authentication foundations** using:

* Clean Architecture
* CQRS (Command Query Responsibility Segregation)
* MediatR pipelines
* Repository pattern
* AutoMapper for object mapping
* Secure password hashing

---

## 🧱 Architecture

```plaintext
API → Application → Domain → Infrastructure → Database
```

* **API Layer**: Handles HTTP requests
* **Application Layer**: Business logic (CQRS handlers)
* **Domain Layer**: Core entities (User)
* **Infrastructure Layer**: Database & hashing implementation

---

## ⚙️ CQRS Implementation

The system follows CQRS using MediatR:

* **Commands** → Handle write operations (Create, Update, Delete)
* **Queries** → Handle read operations (Get user)

### Benefits

* Clear separation of concerns
* Scalable and maintainable structure
* Easy to extend with pipelines (validation, logging, etc.)

---

## 🔁 MediatR Pipelines

Pipeline behaviors are used to intercept requests:

* Centralized validation (extendable)
* Cross-cutting concerns handled cleanly
* Keeps handlers focused on business logic

---

## 👤 User Domain

The `User` entity represents application users.

### Key Properties

```plaintext
Id (Guid)
Name (string)
Email (string)
PhoneNumber (string)
PasswordHash (string)
CreatedAt (DateTime)
```

---

## 🔐 Password Handling

### Approach

* Passwords are **never stored in plain text**
* A dedicated hashing mechanism is used:

  * Hash during registration
  * Verify during login

### Flow

```plaintext
User enters password
→ Password is hashed
→ Stored as PasswordHash

Login:
→ Input password is verified against stored hash
```

---

## 🗄️ Repository Pattern

### IUserRepository

Provides abstraction for user data operations:

```plaintext
- AddUserAsync
- GetUserByIdAsync
- GetUserByEmailIdAsync
- UpdateUserAsync
- DeleteUserAsync
```

### Responsibilities

* Encapsulates data access logic
* Keeps Application layer independent of EF Core
* Enables easier testing and mocking

---

## 🔄 AutoMapper Integration

AutoMapper is used for:

* Mapping Domain → DTOs
* Reducing manual mapping code
* Improving maintainability

---

## 🔁 User Operations

### Create User

* Accept user input
* Hash password
* Store user in database

### Get User

* Fetch by ID or Email

### Update User

* Modify user details

### Delete User

* Remove user record

---

## 🔐 Authentication Readiness

The system is prepared for authentication:

* Password hashing implemented
* Email-based login supported
* JWT integration can be added next

---

## 🚀 Future Enhancements

* JWT authentication & authorization
* OTP-based login (mobile)
* Email verification
* Role-based access control (RBAC)
* Refresh tokens

---

## 🧠 Design Principles Followed

* Separation of concerns
* Dependency inversion
* Single responsibility
* Clean architecture boundaries

---

## 📌 Summary

This module establishes a **secure, scalable foundation** for user management and authentication by combining:

* CQRS + MediatR
* Repository pattern
* Secure password handling
* Clean architecture principles

---
