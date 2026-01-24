# SchoolERP Platform (Phase 1)

**Enterprise School ERP for Multi-Campus Institutions**

## 1. Project Overview
This repository contains the source code, database scripts, and deployment configurations for the SchoolERP platform.
Phase 1 focuses on **Student Management, Fees, Invoicing, and Receipts** for a hybrid cloud-edge deployment model.

## 2. Repository Structure
- **docs/**: Technical specifications, ERD, API specs, and SOPs. (See `12_erd_data_dictionary.md` etc.)
- **src/backend**: .NET 8 ASP.NET Core Web API (Clean Architecture).
- **src/frontend**: React + Vite + TypeScript.
- **database/**: SQL Server migration scripts (Sequenced).
- **deploy/**: IIS/Nginx configs and Cloud backup scripts.
- **tools/**: Data migration and import utilities.

## 3. Getting Started (Development)

### Prerequisites
- .NET SDK 8.0+
- Node.js 20+
- SQL Server Developer Edition (Localhost)

### Setup
1. **Database**: Run scripts in `database/migrations` in order against your local instance.
2. **Backend**:
   ```bash
   cd src/backend/SchoolERP.Api
   dotnet run
   ```
3. **Frontend**:
   ```bash
   cd src/frontend/schoolerp-web
   npm install
   npm run dev
   ```

## 4. Documentation
Refer to `docs/` for authoritative specifications:
- **API**: `docs/13_api_specification.md`
- **Database**: `docs/12_erd_data_dictionary.md`
- **UI Contracts**: `docs/14_ui_wireframes.md`
- **Testing**: `docs/17_test_plan.md`
