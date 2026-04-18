# 🧠 Data Storage Strategy (Hot & Cold Architecture)

## 📌 Overview

Habitual uses a **hot + cold data storage strategy** to balance:

* ⚡ Fast access for active data
* 🧊 Efficient storage for historical data
* 📊 Scalable analytics over time

Instead of multiple backends, the system uses a **single API with logical data separation**.

---

## 🧱 Architecture

```plaintext
API (.NET)
   └── AppDbContext
         ├── HabitStats        (Hot Storage - current data)
         └── HabitStatsArchive (Cold Storage - historical data)
```

---

## 🔥 Hot Storage (Active Data)

### Purpose

Stores **recent and frequently accessed data**.

### Contains

* Current month `HabitStat` records
* Active user interactions

### Characteristics

* Optimized for **low latency reads/writes**
* Smaller dataset → faster queries
* Indexed for performance

---

## 🧊 Cold Storage (Archived Data)

### Purpose

Stores **historical data** that is accessed less frequently.

### Contains

* Older `HabitStat` records (previous months)

### Characteristics

* Optimized for **storage efficiency**
* Accessed **on-demand**
* No heavy relational navigation (lightweight structure)

---

## 🔁 Data Lifecycle

A background process periodically moves data from hot → cold storage.

### Flow

```plaintext
1. User logs habit → stored in HabitStats (hot)
2. End of cycle (e.g., monthly job)
3. Move old records → HabitStatsArchive (cold)
4. Remove moved records from hot storage
```

---

## ⚙️ Implementation Approach

### 1. Single DbContext

A unified `DbContext` manages both hot and cold data:

* Avoids duplication
* Simplifies dependency injection
* Keeps transaction handling consistent

---

### 2. Separate Tables

Two tables are used:

* `HabitStats`
* `HabitStatsArchive`

Each maps to its own entity for clarity and control.

---

### 3. Background Job

Archival is handled by a scheduled job (e.g., Hangfire or cron):

* Moves records older than current period
* Ensures hot table remains small and performant

---

### 4. Query Strategy

* **Current data** → query `HabitStats`
* **Historical data** → query `HabitStatsArchive`

The application layer decides which source to use.

---

## 📈 Scalability Path

This design allows gradual evolution:

### Phase 1 (Current)

* Single DB
* Hot + Archive tables

### Phase 2

* Table partitioning (by month)

### Phase 3

* Separate database for archive

### Phase 4

* Data warehouse / analytics layer

---

## ⚠️ Design Considerations

* Avoid premature multi-database setup
* Keep domain model independent of storage strategy
* Archive logic should reside in **Application layer**, not Domain
* Ensure proper indexing (e.g., `HabitId + Date`)

---

## 🧠 Summary

This approach provides:

* Simplicity (single backend)
* Performance (small hot dataset)
* Scalability (clear evolution path)

It balances **engineering effort today** with **scaling needs tomorrow**.

---
